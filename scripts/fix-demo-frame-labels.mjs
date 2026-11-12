import fs from "node:fs";

const p = new URL(
  "../apps/docs/components/demos/sandpack-preview.tsx",
  import.meta.url,
);
let s = fs.readFileSync(p, "utf8");

s = s.replace(
  /(<Eye className="size-3\.5" \/>\r?\n\s*)([^\r\n<]+)/g,
  `$1预览`,
);
s = s.replace(
  /(<Code2 className="size-3\.5" \/>\r?\n\s*)([^\r\n<]+)/g,
  `$1代码`,
);

fs.writeFileSync(p, s);
console.log("fixed", (s.match(/预览/g) || []).length, (s.match(/代码/g) || []).length);
