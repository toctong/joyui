import fs from "node:fs";
import path from "node:path";

const dir = path.resolve("apps/docs/content/docs");
const reLicense =
  /需要 \[JoyUI Pro\]\([^)]+\) 许可证。激活后：\n\n/g;

for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith(".mdx")) continue;
  const p = path.join(dir, f);
  let s = fs.readFileSync(p, "utf8");
  let next = s.replace(reLicense, "");
  next = next.replace(
    /官方参考：\[JoyUI · ([^\]]+)\]\([^)]+\)\n\n/g,
    "",
  );
  if (next !== s) {
    fs.writeFileSync(p, next);
    console.log("updated", f);
  }
}
