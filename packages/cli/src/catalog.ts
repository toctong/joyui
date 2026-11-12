export type JoyComponent = {
  name: string;
  title: string;
  description: string;
  type: "compound" | "lib";
  dependencies: string[];
  registryDependencies: string[];
  category?: string;
};

/** Built-in catalog (kept in sync with packages/ui/registry.json). */
export const CATALOG: JoyComponent[] = [
  {
    name: "utils",
    title: "Utils",
    description: "cn/cx class merge helpers.",
    type: "lib",
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  {
    name: "format",
    title: "Formatters",
    description: "dayjs-based date helpers plus Intl formatters.",
    type: "lib",
    dependencies: ["dayjs"],
    registryDependencies: [],
  },
];

export function getComponent(name: string) {
  return CATALOG.find((c) => c.name === name);
}

export function resolveRegistryUrl(name: string) {
  const base =
    process.env.JOYUI_REGISTRY_URL?.replace(/\/$/, "") ?? "https://joyui.dev/r";
  return `${base}/${name}.json`;
}
