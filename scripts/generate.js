const fs = require("fs");
const path = require("path");

const baseUrl = "https://catsjuice.github.io/matter-js-playground";

const htmlTemplate = fs.readFileSync(
  path.resolve(__dirname, "_template.html"),
  "utf8"
);
const readmeTemplate = fs.readFileSync(
  path.resolve(__dirname, "_readme.md"),
  "utf8"
);

const htmlOutputPath = path.join(__dirname, "../index.html");
const readmeOutputPath = path.join(__dirname, "../README.md");
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
      `<li><a href="./src/${link.filename}/index.html">${link.filename}</a></li>`
  )
  .join("\n")}\n</ul>`;
const htmlOutput = htmlTemplate.replace(/\{\{\s*content\s*\}\}/, linksHtml);

const readmeOutput = readmeTemplate.replace(
  /\{\{\s*demoList\s*\}\}/,
  links
    .map(({ filename }) => `- [${filename}](${baseUrl}/src/${filename}/index.html)`)
    .join("\n")
);

fs.writeFileSync(htmlOutputPath, htmlOutput);
fs.writeFileSync(readmeOutputPath, readmeOutput);
