export type { JoyComponent } from "./catalog.generated.js";
export { CATALOG } from "./catalog.generated.js";

import { CATALOG, type JoyComponent } from "./catalog.generated.js";
import { assertHttpsRegistryBase } from "./fs-safe.js";

export function getComponent(name: string): JoyComponent | undefined {
  const key = name.trim().toLowerCase();
  return CATALOG.find((c) => c.name === key);
}

export function resolveRegistryUrl(name: string) {
  const raw =
    process.env.JOYUI_REGISTRY_URL?.replace(/\/$/, "") ?? "https://joyui.dev/r";
  const base = assertHttpsRegistryBase(raw);
  const safeName = name.replace(/[^a-zA-Z0-9._-]/g, "");
  if (!safeName || safeName !== name) {
    throw new Error(`Invalid component name for registry: ${name}`);
  }
  return `${base}/${safeName}.json`;
}

export function importSnippet(item: JoyComponent) {
  const names = item.exports.slice(0, 6).join(", ");
  const more = item.exports.length > 6 ? ", /* … */" : "";
  return `import { ${names}${more} } from "${item.importFrom}"`;
}
