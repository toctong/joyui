import { CATALOG, type JoyComponent } from "./catalog.js";

const TIPTAP_PEERS = [
  "@tiptap/react",
  "@tiptap/starter-kit",
  "@tiptap/extension-mention",
  "@tiptap/extension-placeholder",
  "@tiptap/suggestion",
  "@tiptap/pm",
  "tippy.js",
];

/** Optional peer packages required for specific surfaces (not installed by default). */
export function optionalPeersFor(name: string): {
  packages: string[];
  note: string;
} | null {
  const n = name.toLowerCase();
  if (n === "composer" || n.startsWith("composer-")) {
    return {
      packages: TIPTAP_PEERS,
      note: 'Import from `@joyui/react/composer`. Install TipTap peers before use.',
    };
  }
  if (
    n.includes("chart") ||
    n.endsWith("-chart-card") ||
    ["orders-chart-card", "revenue-chart-card", "area-chart-card"].includes(n)
  ) {
    return {
      packages: ["recharts"],
      note: "Chart cards need the optional `recharts` peer.",
    };
  }
  if (n === "barcode") {
    return {
      packages: ["jsbarcode"],
      note: "Barcode needs the optional `jsbarcode` peer.",
    };
  }
  if (n === "qr-code") {
    return {
      packages: ["qrcode"],
      note: "QR Code needs the optional `qrcode` peer.",
    };
  }
  return null;
}

const PITFALLS: Record<string, string[]> = {
  input: [
    "Prefer `<Input label=\"…\" />` for labeled fields.",
    "`TextField` is the layout shell; do not treat it as a drop-in Input with the same props.",
  ],
  "data-table": [
    "Use `<DataTable data={…} columns={…} />` for production.",
    "`DataTableExample` is docs-only and is not part of the public barrel.",
  ],
  "data-grid": [
    "Prefer the real DataGrid API from docs; avoid docs-only example wrappers in app code.",
  ],
  composer: [
    "Always import from `@joyui/react/composer`, not the root barrel.",
    "Install TipTap optional peers or the editor will fail at runtime.",
  ],
  button: [
    "Pass Remix icons as component refs: `leadingIcon={RiAddLine}` (not JSX elements).",
  ],
  select: [
    "Children must be `<SelectItem id=\"…\">`, not raw `<option>`.",
  ],
  modal: [
    "Use `ModalTrigger` + `Modal` + `ModalDialog` structure; do not invent a single `<Dialog>` API.",
  ],
};

export function pitfallsFor(name: string): string[] {
  return PITFALLS[name.toLowerCase()] ?? [];
}

function scoreItem(item: JoyComponent, q: string): number {
  const name = item.name.toLowerCase();
  const title = item.title.toLowerCase();
  const exports = item.exports.join(" ").toLowerCase();
  const desc = item.description.toLowerCase();
  if (name === q) return 100;
  if (name.startsWith(q)) return 80;
  if (name.includes(q)) return 60;
  if (title.includes(q)) return 50;
  if (exports.split(/\s+/).some((e) => e.toLowerCase() === q || e.toLowerCase().includes(q)))
    return 45;
  if (desc.includes(q)) return 20;
  // tokenized fuzzy: all query parts present
  const parts = q.split(/[\s-_]+/).filter(Boolean);
  if (parts.length > 1 && parts.every((p) => name.includes(p) || title.includes(p))) {
    return 40;
  }
  return 0;
}

export function searchComponents(query: string, limit = 20) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return CATALOG.map((item) => ({ item, score: scoreItem(item, q) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
    .slice(0, limit)
    .map(({ item, score }) => ({
      name: item.name,
      title: item.title,
      layer: item.layer,
      type: item.type,
      importFrom: item.importFrom,
      exports: item.exports.slice(0, 8),
      score,
      optionalPeers: optionalPeersFor(item.name)?.packages ?? [],
    }));
}

export function enrichComponent(item: JoyComponent) {
  const peers = optionalPeersFor(item.name);
  return {
    name: item.name,
    title: item.title,
    description: item.description,
    type: item.type,
    layer: item.layer,
    exports: item.exports,
    importFrom: item.importFrom,
    npm: "pnpm add @joyui/react",
    styles: '@import "@joyui/react/styles.css"',
    docs: `https://joyui.dev/docs/${item.name}`,
    optionalPeers: peers,
    pitfalls: pitfallsFor(item.name),
    relatedHint:
      item.layer === "application"
        ? "Application templates compose base primitives — prefer npm whole-library install."
        : undefined,
  };
}
