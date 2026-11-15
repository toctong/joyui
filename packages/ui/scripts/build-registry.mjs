/**
 * Emit apps/docs/public/r/*.json from packages/ui/registry.json
 * (files already contain rewritten consumer source).
 */
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
  const files = (item.files ?? []).map((file) => ({
    path: file.path,
    type: file.type,
    content: file.content ?? "",
  }));

  const meta = item.meta ?? {};
  const payload = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    files,
    meta: {
      ...meta,
      preferredInstall: "pnpm add @joyui/react",
      styles: "@joyui/react/styles.css",
      importFrom: meta.importFrom ?? "@joyui/react",
      exports: meta.exports ?? [],
    },
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
    files: files.map((f) => ({ path: f.path, type: f.type })),
    meta: payload.meta,
  });
}

await writeFile(
  path.join(outDir, "registry.json"),
  JSON.stringify(catalog, null, 2),
);

const localOut = path.join(root, "dist-registry");
await mkdir(localOut, { recursive: true });
await cp(outDir, localOut, { recursive: true });

console.log(`Built ${catalog.items.length} registry items → ${outDir}`);
