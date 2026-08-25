/**
 * Makes light/white pixels transparent on the NITA logo PNG.
 * Run: node scripts/make-logo-transparent.mjs
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const inputPath = join(root, 'public', 'logo.png');

async function main() {
  const input = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { data, info } = input;
  const { width, height } = info;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    // Near-white / light gray background → transparent (keeps colored logo art)
    const brightness = (r + g + b) / 3;
    if (brightness > 248) {
      data[i + 3] = 0;
    } else if (brightness > 230) {
      // Anti-alias edge: fade out
      const fade = (248 - brightness) / 18;
      data[i + 3] = Math.round(a * Math.max(0, Math.min(1, fade)));
    } else if (r > 210 && g > 210 && b > 210 && brightness > 215) {
      data[i + 3] = Math.round(a * 0.35);
    }
  }

  const out = await sharp(Buffer.from(data), {
    raw: { width, height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toBuffer();

  writeFileSync(inputPath, out);
  console.log('Updated', inputPath, `${width}x${height}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
