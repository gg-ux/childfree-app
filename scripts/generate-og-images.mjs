import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const contentDir = path.join(rootDir, "src/content/blog");
const publicDir = path.join(rootDir, "public");
const outputDir = path.join(publicDir, "assets/blog/og");

fs.mkdirSync(outputDir, { recursive: true });

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    fm[key] = val;
  }
  return fm;
}

async function main() {
  console.log("Generating OG images from blog SVGs...\n");

  const files = fs.readdirSync(contentDir).filter(f => f.endsWith(".mdx"));
  let count = 0;

  for (const file of files) {
    const slug = file.replace(".mdx", "");
    const content = fs.readFileSync(path.join(contentDir, file), "utf-8");
    const fm = parseFrontmatter(content);
    const imagePath = fm.image;

    if (!imagePath) {
      console.log(`  Skipped: ${slug} (no image)`);
      continue;
    }

    const srcPath = path.join(publicDir, imagePath);
    if (!fs.existsSync(srcPath)) {
      console.log(`  Skipped: ${slug} (file not found: ${imagePath})`);
      continue;
    }

    const outputPath = path.join(outputDir, `${slug}.png`);

    await sharp(srcPath)
      .resize(1200, 630, { fit: "cover" })
      .png()
      .toFile(outputPath);

    const stats = fs.statSync(outputPath);
    console.log(`  Generated: ${slug}.png (${(stats.size / 1024).toFixed(1)}KB)`);
    count++;
  }

  console.log(`\nDone! Generated ${count} OG images.`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
