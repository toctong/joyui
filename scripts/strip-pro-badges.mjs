import fs from "node:fs";
import path from "node:path";

const dir = path.resolve("apps/docs/content/docs");
let n = 0;
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith(".mdx")) continue;
  const p = path.join(dir, f);
  let s = fs.readFileSync(p, "utf8");
  const next = s.replace(/\nbadge: "PRO"\n/g, "\n");
  if (next !== s) {
    fs.writeFileSync(p, next);
    n += 1;
  }
}
console.log("mdx cleaned", n);
