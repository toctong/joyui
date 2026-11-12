import fs from "node:fs";
import path from "node:path";

const dir = path.resolve("apps/docs/content/docs");
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith(".mdx")) continue;
  const p = path.join(dir, f);
  let s = fs.readFileSync(p, "utf8");
  const next = s
    .replace(/\n## 预览\n\n/g, "\n")
    .replace(/npx joyui@latest add/g, "npx joyui add")
    .replace(
      /或通过 JoyUI MCP：`install_components` → `[^`]+`。/g,
      "或通过 JoyUI MCP / CLI 安装。",
    );
  if (next !== s) {
    fs.writeFileSync(p, next);
    console.log("updated", f);
  }
}
