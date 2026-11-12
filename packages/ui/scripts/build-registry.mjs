import { mkdir, readFile, writeFile, cp } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const registryPath = path.join(root, "registry.json");
const outDir = path.resolve(root, "../../apps/docs/public/r");

const registry = JSON.parse(await readFile(registryPath, "utf8"));

await mkdir(outDir, { recursive: true });

const catalog = {
  $schema: registry.$schema,
  name: registry.name,
  homepage: registry.homepage,
  items: [],
};

for (const item of registry.items) {
  const files = [];
  for (const file of item.files ?? []) {
    const abs = path.join(root, file.path);
    const content = await readFile(abs, "utf8");
    const target =
      file.type === "registry:lib"
        ? `lib/${path.basename(file.path)}`
        : `components/ui/${path.basename(file.path)}`;
    files.push({
      path: target,
      type: file.type,
      content: rewriteImports(content),
    });
  }

  const payload = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    files,
  };

  await writeFile(
    path.join(outDir, `${item.name}.json`),
    JSON.stringify(payload, null, 2),
  );

  catalog.items.push({
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    files: (item.files ?? []).map((f) => ({
      path:
        f.type === "registry:lib"
          ? `lib/${path.basename(f.path)}`
          : `components/ui/${path.basename(f.path)}`,
      type: f.type,
    })),
  });
}

await writeFile(
  path.join(outDir, "registry.json"),
  JSON.stringify(catalog, null, 2),
);

// Also keep a copy next to the package for CLI offline use
const localOut = path.join(root, "dist-registry");
await mkdir(localOut, { recursive: true });
await cp(outDir, localOut, { recursive: true });

console.log(`Built ${catalog.items.length} registry items → ${outDir}`);

function rewriteImports(source) {
  return source
    .replaceAll('../../lib/utils', '@/lib/utils')
    .replaceAll('../../lib/format', '@/lib/format')
    .replaceAll('../base/button', '@/components/ui/button')
    .replaceAll('../base/input', '@/components/ui/input')
    .replaceAll('../base/card', '@/components/ui/card')
    .replaceAll('../base/badge', '@/components/ui/badge')
    .replaceAll('../base/label', '@/components/ui/label');
}
