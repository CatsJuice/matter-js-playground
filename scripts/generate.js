const fs = require("fs");
const path = require("path");

const gitPagesBaseUrl = "https://catsjuice.github.io/matter-js-playground";
const vercelBaseUrl = "https://matter-js-playground.vercel.app";

const targets = [
  { name: "Git Pages", url: gitPagesBaseUrl },
  { name: "Vercel", url: vercelBaseUrl },
];

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

// const readmeOutput = readmeTemplate.replace(
//   /\{\{\s*demoList\s*\}\}/,
//   targets
//     .map(({ name, url }) => {
//       return (
//         `## Demos on ${name}\n` +
//         links
//           .map(
//             ({ filename }) =>
//               `- [${filename}](${gitPagesBaseUrl}/src/${filename}/index.html)`
//           )
//           .join("\n")
//       );
//     })
//     .join("\n\n")
// );

const readmeContent = `<table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Git Pages</th>
        <th>Vercel</th>
      </tr>
    </thead>
    <tbody>
      ${links
        .map(
          ({ filename }) => `<tr>
        <td><code>${filename}</code></td>
        <td><a href="${gitPagesBaseUrl}/src/${filename}/index.html">GitPage</a></td>
        <td><a href="${vercelBaseUrl}/src/${filename}/index.html">Vercel</a></td>
      </tr>`
        )
        .join("\n")}
    </tbody>
</table>`;

const readmeOutput = readmeTemplate.replace(
  /\{\{\s*demoList\s*\}\}/,
  readmeContent
);

fs.writeFileSync(htmlOutputPath, htmlOutput);
fs.writeFileSync(readmeOutputPath, readmeOutput);
