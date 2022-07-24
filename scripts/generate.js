const fs = require("fs");
const path = require("path");

const template = fs.readFileSync(
  path.resolve(__dirname, "_template.html"),
  "utf8"
);

const outputPath = path.join(__dirname, "../src/index.html");
const srcDir = path.join(__dirname, "../src");

const projects = fs.readdirSync(srcDir);
const links = [];
projects.forEach((filename) => {
  const filepath = path.join(srcDir, filename);
  const stats = fs.statSync(filepath);
  const isDir = stats.isDirectory();
  if (!isDir) return;
  if (filename.startsWith("_")) return;
  links.push({ filename });
});

const linksHtml = `<ul>\n\t${links
  .map(
    (link) =>
      `<li><a href="./${link.filename}/index.html">${link.filename}</a></li>`
  )
  .join("\n")}\n</ul>`;
const outout = template.replace(/\{\{\s*content\s*\}\}/, linksHtml);

fs.writeFileSync(outputPath, outout);
