// set-version.js
const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "build");
const indexPath = path.join(buildDir, "index.html");

// generate version from current date/time
const version = new Date()
  .toISOString()
  .replace(/[-:.TZ]/g, "")
  .slice(0, 12);

let html = fs.readFileSync(indexPath, "utf8");
html = html.replace(/(main\.[^"]+\.js)/g, `$1?v=${version}`);
html = html.replace(/(main\.[^"]+\.css)/g, `$1?v=${version}`);

fs.writeFileSync(indexPath, html, "utf8");

console.log(`✅ Added version query param: v=${version}`);
