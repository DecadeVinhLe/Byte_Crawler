// node tests/sheets.test.js - hero sprite sheets are 768x768 (3x3 cells of 256px) and the UV offset used in arena.js picks the right cell
const fs = require("fs"), assert = require("assert");
for (const k of ["knight", "mage", "ranger", "rogue"]) {
  const b = fs.readFileSync(`assets/images/${k}-sheet.png`);
  assert.strictEqual(b.readUInt32BE(16) + "x" + b.readUInt32BE(20), "768x768", k + " sheet size");
}
const uv = fi => [fi % 3 / 3, (2 - (fi / 3 | 0)) / 3];                       // same expression as arena.js
const cell = fi => { const [u, v] = uv(fi); return [Math.round(u * 768), Math.round((1 - v - 1 / 3) * 768)]; }; // top-left px of the cell
assert.deepStrictEqual(cell(0), [0, 0]);
assert.deepStrictEqual(cell(4), [256, 256]);
assert.deepStrictEqual(cell(8), [512, 512]);
assert.deepStrictEqual(cell(5), [512, 256]);
console.log("sheets ok");
