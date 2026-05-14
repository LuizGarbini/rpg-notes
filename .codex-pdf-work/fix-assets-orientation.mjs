import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outDir = path.resolve("output", "ilovepdf_merged_1");
const rawDir = path.join(outDir, "raw-rendered");
const pageDir = path.join(outDir, "pages-upscaled");
await fs.mkdir(pageDir, { recursive: true });

for (let pageNumber = 1; pageNumber <= 4; pageNumber += 1) {
  const rawPath = path.join(rawDir, `page-${String(pageNumber).padStart(2, "0")}.png`);
  const rawMeta = await sharp(rawPath).metadata();
  const width = Math.round((rawMeta.height ?? 0) * 2);
  const height = Math.round((rawMeta.width ?? 0) * 2);
  const outPng = path.join(pageDir, `page-${String(pageNumber).padStart(2, "0")}-upscaled.png`);
  const outJpg = path.join(pageDir, `page-${String(pageNumber).padStart(2, "0")}-upscaled.jpg`);

  await sharp(rawPath)
    .rotate(-90)
    .normalize()
    .resize({ width, height, kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.7 })
    .png({ compressionLevel: 9 })
    .toFile(outPng);

  await sharp(rawPath)
    .rotate(-90)
    .normalize()
    .resize({ width, height, kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.7 })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(outJpg);

  console.log(`fixed page ${pageNumber}: ${width}x${height}`);
}
