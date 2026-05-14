import fs from "node:fs/promises";
import path from "node:path";
import { createCanvas } from "@napi-rs/canvas";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const source = "C:/Users/gabri/Downloads/ilovepdf_merged (1).pdf";
const outDir = path.resolve("output", "previews");
await fs.mkdir(outDir, { recursive: true });

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

const data = new Uint8Array(await fs.readFile(source));
const doc = await pdfjsLib.getDocument({ data, disableWorker: true, useSystemFonts: true }).promise;
const canvasFactory = new CanvasFactory();

for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
  const page = await doc.getPage(pageNumber);
  const base = page.getViewport({ scale: 1 });
  const scale = 1000 / base.width;
  const viewport = page.getViewport({ scale });
  const { canvas, context } = canvasFactory.create(Math.ceil(viewport.width), Math.ceil(viewport.height));
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: context, viewport, canvasFactory }).promise;
  const png = await canvas.encode("png");
  const target = path.join(outDir, `page-${String(pageNumber).padStart(2, "0")}.png`);
  await fs.writeFile(target, png);
  console.log(target);
}
