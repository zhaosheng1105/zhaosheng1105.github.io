const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "../homepage");
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}
for (const file of walk(root)) {
  if (!/\.(html|css)$/.test(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  const links = file.endsWith(".html") ? [...text.matchAll(/(?:href|src)="([^"]+)"/g)] : [...text.matchAll(/url\(['"]?([^)'"\s]+)/g)];
  for (const [, url] of links) {
    if (/^(?:[a-z]+:|\/\/|#)/i.test(url)) continue;
    const target = path.resolve(path.dirname(file), decodeURIComponent(url.split(/[?#]/)[0]));
    assert.ok(target.startsWith(root + path.sep) || target === root, `Reference leaves site: ${url}`);
    assert.ok(fs.existsSync(target), `Missing asset or page: ${path.relative(root, file)} -> ${url}`);
  }
}
for (const language of ["", "en/"]) {
  for (const page of ["index.html", "research.html", "honors.html"]) {
    const html = fs.readFileSync(path.join(root, language + page), "utf8");
    assert.equal((html.match(/class="author-email"/g) || []).length, 2);
    assert.equal((html.match(/fa-envelope/g) || []).length, 2);
    assert.ok(html.includes("zhaoshengkim@sjtu.edu.cn") && html.includes("sheng015@e.ntu.edu.sg"));
    assert.ok(html.includes("images/sheng-zhao.jpg"));
    assert.ok(!html.includes("github.com/zhaosheng1105"));
    assert.ok(html.includes('class="header-controls"') && html.includes('class="language-switch"'));
  }
  const research = fs.readFileSync(path.join(root, language + "research.html"), "utf8");
  assert.equal((research.match(/class="research-project"/g) || []).length, 2);
  assert.equal((research.match(/class="publication"/g) || []).length, 13);
  assert.equal((research.match(/class="patent"/g) || []).length, 6);
  const honors = fs.readFileSync(path.join(root, language + "honors.html"), "utf8");
  assert.equal((honors.match(/class="honor"/g) || []).length, 15);
}
assert.ok(fs.existsSync(path.join(root, ".nojekyll")));
console.log("Approved Academic Pages files, bilingual content, photo, contacts, navigation and local assets validated.");
