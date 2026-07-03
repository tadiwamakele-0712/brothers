import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.dirname(fileURLToPath(import.meta.url));

const TARGETS = [
  { dir: "kunfre-pic", maxWidth: 1200, quality: 72 },
  { dir: "product logo", maxWidth: 420, quality: 80 },
  { dir: "social icon", maxWidth: 128, quality: 82 },
  { dir: "kunfre", maxWidth: 480, quality: 80 },
];

const ROOT_FILES = [
  { file: "kunfre-logo.jpg", maxWidth: 640, quality: 80 },
  { file: "logo.png", maxWidth: 512, quality: 90 },
];

function walkImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) return walkImages(full);
    if (/\.(jpe?g|png)$/i.test(name)) return [full];
    return [];
  });
}

async function compressFile(filePath, maxWidth, quality) {
  const before = fs.statSync(filePath).size;
  const ext = path.extname(filePath).toLowerCase();
  const image = sharp(filePath).rotate();
  const meta = await image.metadata();

  let pipeline = image.resize({
    width: meta.width > maxWidth ? maxWidth : undefined,
    withoutEnlargement: true,
  });

  if (ext === ".png") {
    pipeline = pipeline.png({
      compressionLevel: 9,
      palette: true,
      quality,
    });
  } else {
    pipeline = pipeline.jpeg({
      quality,
      mozjpeg: true,
    });
  }

  const buffer = await pipeline.toBuffer();
  const afterSize = buffer.length;

  if (afterSize < before) {
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, buffer);
    fs.renameSync(tempPath, filePath);
  }

  const after = afterSize < before ? afterSize : before;
  return { before, after, saved: Math.max(0, before - after) };
}

let totalBefore = 0;
let totalAfter = 0;
let fileCount = 0;

for (const target of TARGETS) {
  const dir = path.join(ROOT, target.dir);
  for (const filePath of walkImages(dir)) {
    try {
      const result = await compressFile(filePath, target.maxWidth, target.quality);
      totalBefore += result.before;
      totalAfter += result.after;
      fileCount += 1;
      if (result.saved > 0) {
        console.log(
          `saved ${Math.round(result.saved / 1024)}KB -> ${path.relative(ROOT, filePath)}`
        );
      }
    } catch (error) {
      console.warn(`skipped ${path.relative(ROOT, filePath)}: ${error.message}`);
    }
  }
}

for (const item of ROOT_FILES) {
  const filePath = path.join(ROOT, item.file);
  if (!fs.existsSync(filePath)) continue;
  try {
    const result = await compressFile(filePath, item.maxWidth, item.quality);
    totalBefore += result.before;
    totalAfter += result.after;
    fileCount += 1;
    if (result.saved > 0) {
      console.log(`saved ${Math.round(result.saved / 1024)}KB -> ${item.file}`);
    }
  } catch (error) {
    console.warn(`skipped ${item.file}: ${error.message}`);
  }
}

const savedMb = ((totalBefore - totalAfter) / (1024 * 1024)).toFixed(2);
const afterMb = (totalAfter / (1024 * 1024)).toFixed(2);
console.log(`\nCompressed ${fileCount} images. Total size now ${afterMb}MB (saved ${savedMb}MB).`);
