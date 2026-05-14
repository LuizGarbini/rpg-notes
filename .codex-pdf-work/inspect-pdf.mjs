import fs from "node:fs/promises";
import path from "node:path";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const source = "C:/Users/gabri/Downloads/ilovepdf_merged (1).pdf";
const outDir = path.resolve("output");
await fs.mkdir(outDir, { recursive: true });

const data = new Uint8Array(await fs.readFile(source));
const doc = await pdfjsLib.getDocument({
  data,
  disableWorker: true,
  useSystemFonts: true,
}).promise;

const pages = [];
let totalChars = 0;

for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
  const page = await doc.getPage(pageNumber);
  const textContent = await page.getTextContent({ includeMarkedContent: false });
  const strings = textContent.items
    .map((item) => ("str" in item ? item.str : ""))
    .filter(Boolean);
  const text = strings.join(" ").replace(/\s+/g, " ").trim();
  const viewport = page.getViewport({ scale: 1 });
  totalChars += text.length;
  pages.push({
    pageNumber,
    rotation: page.rotate,
    width: Math.round(viewport.width),
    height: Math.round(viewport.height),
    textChars: text.length,
    sample: text.slice(0, 250),
  });
}

const result = {
  source,
  pageCount: doc.numPages,
  totalTextChars: totalChars,
  pages,
};

await fs.writeFile(path.join(outDir, "inspection.json"), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
