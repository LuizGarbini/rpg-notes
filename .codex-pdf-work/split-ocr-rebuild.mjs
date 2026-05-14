import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import { createWorker } from "tesseract.js";

const outDir = path.resolve("output", "ilovepdf_merged_1");
const pageDir = path.join(outDir, "pages-upscaled");
const splitDir = path.join(outDir, "pages-split-upscaled");
const ocrDir = path.join(outDir, "ocr-split");
await fs.mkdir(splitDir, { recursive: true });
await fs.mkdir(ocrDir, { recursive: true });

async function makeCorrectedSpreadPdf() {
  const pdf = await PDFDocument.create();
  const files = [];
  for (let pageNumber = 1; pageNumber <= 4; pageNumber += 1) {
    files.push(path.join(pageDir, `page-${String(pageNumber).padStart(2, "0")}-upscaled.jpg`));
  }
  for (const file of files) {
    const meta = await sharp(file).metadata();
    const bytes = await fs.readFile(file);
    const image = await pdf.embedJpg(bytes);
    const page = pdf.addPage([meta.width, meta.height]);
    page.drawImage(image, { x: 0, y: 0, width: meta.width, height: meta.height });
  }
  const target = path.join(outDir, "documento_corrigido_upscale.pdf");
  await fs.writeFile(target, await pdf.save({ useObjectStreams: true }));
  return target;
}

async function createSplitPages() {
  const splitPages = [];
  for (let pageNumber = 1; pageNumber <= 4; pageNumber += 1) {
    const source = path.join(pageDir, `page-${String(pageNumber).padStart(2, "0")}-upscaled.jpg`);
    const meta = await sharp(source).metadata();
    const half = Math.floor(meta.width / 2);
    for (const side of ["left", "right"]) {
      const left = side === "left" ? 0 : half;
      const width = side === "left" ? half : meta.width - half;
      const outJpg = path.join(splitDir, `spread-${String(pageNumber).padStart(2, "0")}-${side}.jpg`);
      await sharp(source)
        .extract({ left, top: 0, width, height: meta.height })
        .trim({ background: "#ffffff", threshold: 8 })
        .extend({ top: 80, bottom: 80, left: 80, right: 80, background: "#ffffff" })
        .jpeg({ quality: 94, mozjpeg: true })
        .toFile(outJpg);
      const outMeta = await sharp(outJpg).metadata();
      splitPages.push({ spread: pageNumber, side, file: outJpg, width: outMeta.width, height: outMeta.height });
    }
  }
  return splitPages;
}

async function makeSplitPdf(splitPages) {
  const pdf = await PDFDocument.create();
  for (const item of splitPages) {
    const bytes = await fs.readFile(item.file);
    const image = await pdf.embedJpg(bytes);
    const page = pdf.addPage([item.width, item.height]);
    page.drawImage(image, { x: 0, y: 0, width: item.width, height: item.height });
  }
  const target = path.join(outDir, "paginas_separadas_corrigidas_upscale.pdf");
  await fs.writeFile(target, await pdf.save({ useObjectStreams: true }));
  return target;
}

async function runOcr(splitPages) {
  const worker = await createWorker("eng", 1, {
    cachePath: path.resolve(".tesseract-cache"),
    logger: (m) => {
      if (m.status && typeof m.progress === "number") {
        process.stdout.write(`\rocr ${m.status} ${Math.round(m.progress * 100)}%`);
      }
    },
  });
  await worker.setParameters({
    tessedit_pageseg_mode: "6",
    preserve_interword_spaces: "1",
  });

  const results = [];
  for (const item of splitPages) {
    const id = `spread-${String(item.spread).padStart(2, "0")}-${item.side}`;
    console.log(`\nocr ${id}`);
    const result = await worker.recognize(item.file);
    const text = result.data.text.replace(/[ \t]+\n/g, "\n").trim();
    await fs.writeFile(path.join(ocrDir, `${id}.txt`), text, "utf8");
    results.push({ ...item, id, confidence: result.data.confidence, text });
  }
  await worker.terminate();
  process.stdout.write("\n");
  await fs.writeFile(path.join(ocrDir, "ocr-split.json"), JSON.stringify(results, null, 2), "utf8");
  return results;
}

const spreadPdf = await makeCorrectedSpreadPdf();
const splitPages = await createSplitPages();
const splitPdf = await makeSplitPdf(splitPages);
const ocr = await runOcr(splitPages);

await fs.writeFile(
  path.join(outDir, "split-manifest.json"),
  JSON.stringify({ spreadPdf, splitPdf, splitPages, ocr: ocr.map(({ text, ...rest }) => rest) }, null, 2),
  "utf8",
);

console.log(JSON.stringify({ spreadPdf, splitPdf, splitPages: splitPages.length }, null, 2));
