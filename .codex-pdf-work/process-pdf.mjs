import fs from "node:fs/promises";
import path from "node:path";
import { createCanvas } from "@napi-rs/canvas";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import { createWorker } from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const source = "C:/Users/gabri/Downloads/ilovepdf_merged (1).pdf";
const outDir = path.resolve("output", "ilovepdf_merged_1");
const rawDir = path.join(outDir, "raw-rendered");
const pageDir = path.join(outDir, "pages-upscaled");
const ocrDir = path.join(outDir, "ocr");

await fs.mkdir(rawDir, { recursive: true });
await fs.mkdir(pageDir, { recursive: true });
await fs.mkdir(ocrDir, { recursive: true });

class CanvasFactory {
  create(width, height) {
    const canvas = createCanvas(width, height);
    return { canvas, context: canvas.getContext("2d") };
  }
  reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }
  destroy(canvasAndContext) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

async function renderPdfPages() {
  const data = new Uint8Array(await fs.readFile(source));
  const doc = await pdfjsLib.getDocument({ data, disableWorker: true, useSystemFonts: true }).promise;
  const canvasFactory = new CanvasFactory();
  const rendered = [];

  for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
    const page = await doc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    const { canvas, context } = canvasFactory.create(Math.ceil(viewport.width), Math.ceil(viewport.height));
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: context, viewport, canvasFactory }).promise;
    const rawPng = await canvas.encode("png");
    const rawPath = path.join(rawDir, `page-${String(pageNumber).padStart(2, "0")}.png`);
    await fs.writeFile(rawPath, rawPng);

    const outPng = path.join(pageDir, `page-${String(pageNumber).padStart(2, "0")}-upscaled.png`);
    const outJpg = path.join(pageDir, `page-${String(pageNumber).padStart(2, "0")}-upscaled.jpg`);
    const rotated = sharp(rawPng).rotate(-90).normalize().sharpen({ sigma: 0.7 });
    const meta = await rotated.metadata();
    const width = Math.round((meta.width ?? 0) * 2);
    const height = Math.round((meta.height ?? 0) * 2);

    await sharp(rawPng)
      .rotate(-90)
      .normalize()
      .resize({ width, height, kernel: sharp.kernel.lanczos3 })
      .sharpen({ sigma: 0.7 })
      .png({ compressionLevel: 9 })
      .toFile(outPng);

    await sharp(rawPng)
      .rotate(-90)
      .normalize()
      .resize({ width, height, kernel: sharp.kernel.lanczos3 })
      .sharpen({ sigma: 0.7 })
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(outJpg);

    rendered.push({ pageNumber, png: outPng, jpg: outJpg, width, height });
    console.log(`rendered page ${pageNumber}: ${width}x${height}`);
  }

  return rendered;
}

async function buildPdf(pages) {
  const pdf = await PDFDocument.create();
  for (const page of pages) {
    const bytes = await fs.readFile(page.jpg);
    const image = await pdf.embedJpg(bytes);
    const pdfPage = pdf.addPage([page.width, page.height]);
    pdfPage.drawImage(image, { x: 0, y: 0, width: page.width, height: page.height });
  }
  const bytes = await pdf.save({ useObjectStreams: true });
  const target = path.join(outDir, "documento_corrigido_upscale.pdf");
  await fs.writeFile(target, bytes);
  return target;
}

async function runOcr(pages) {
  const worker = await createWorker("eng", 1, {
    cachePath: path.resolve(".tesseract-cache"),
    logger: (m) => {
      if (m.status && typeof m.progress === "number") {
        process.stdout.write(`\rocr ${m.status} ${Math.round(m.progress * 100)}%`);
      }
    },
  });

  const ocrPages = [];
  for (const page of pages) {
    console.log(`\nocr page ${page.pageNumber}`);
    const result = await worker.recognize(page.png);
    const text = result.data.text.replace(/[ \t]+\n/g, "\n").trim();
    const target = path.join(ocrDir, `page-${String(page.pageNumber).padStart(2, "0")}.txt`);
    await fs.writeFile(target, text, "utf8");
    ocrPages.push({ pageNumber: page.pageNumber, text, confidence: result.data.confidence });
  }
  await worker.terminate();
  process.stdout.write("\n");
  await fs.writeFile(path.join(ocrDir, "ocr.json"), JSON.stringify(ocrPages, null, 2), "utf8");
  return ocrPages;
}

const pages = await renderPdfPages();
const pdfPath = await buildPdf(pages);
const ocrPages = await runOcr(pages);

await fs.writeFile(
  path.join(outDir, "manifest.json"),
  JSON.stringify({ source, pdfPath, pages, ocrPages: ocrPages.map(({ pageNumber, confidence }) => ({ pageNumber, confidence })) }, null, 2),
  "utf8",
);

console.log(JSON.stringify({ outDir, pdfPath, pages: pages.length }, null, 2));
