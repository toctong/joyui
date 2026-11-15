import { GENERATED_EXAMPLES } from "./examples.generated.js";
import { getComponent, importSnippet } from "./catalog.js";
import { optionalPeersFor, pitfallsFor } from "./meta.js";

/** Hand-tuned snippets win over generated docs demos. */
const OVERRIDES: Record<string, string> = {
  utils: `import { cn, cx } from "@joyui/react"

cn("px-2", condition && "bg-background-secondary-default")`,

  format: `import { formatDate, formatCurrency, fromNow } from "@joyui/react"

formatDate(new Date(), "YYYY-MM-DD")
formatCurrency(1999, "CNY")
fromNow("2026-01-01")`,

  button: `import { Button } from "@joyui/react"
import { RiAddLine } from "@remixicon/react"

<Button variant="primary" leadingIcon={RiAddLine}>保存</Button>
<Button variant="secondary" size="small">取消</Button>
<Button variant="danger" isDisabled>删除</Button>`,

  input: `import { Input } from "@joyui/react"

<Input label="邮箱" placeholder="you@company.com" hint="工作邮箱" />
{/* Prefer Input for labeled fields; TextField is the layout shell. */}`,

  select: `import { Select, SelectItem } from "@joyui/react"

<Select label="角色" placeholder="选择…">
  <SelectItem id="admin">Admin</SelectItem>
  <SelectItem id="member">Member</SelectItem>
</Select>`,

  modal: `import { ModalTrigger, Modal, ModalDialog, ModalHeader, ModalBody, ModalFooter, Button } from "@joyui/react"

<ModalTrigger>
  <Button>打开</Button>
  <Modal>
    <ModalDialog>
      <ModalHeader title="确认" />
      <ModalBody>内容</ModalBody>
      <ModalFooter>
        <Button variant="primary">确定</Button>
      </ModalFooter>
    </ModalDialog>
  </Modal>
</ModalTrigger>`,

  "data-table": `import { DataTable } from "@joyui/react"

<DataTable data={rows} columns={columns} />
{/* Do not use DataTableExample in apps — it is docs-only. */}`,

  composer: `import { ComposerPanel } from "@joyui/react/composer"

// Peers (optional): pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-mention @tiptap/extension-placeholder @tiptap/suggestion @tiptap/pm tippy.js
<ComposerPanel />`,

  "revenue-chart-card": `import { RevenueChartCard } from "@joyui/react"

// Peer: pnpm add recharts
<RevenueChartCard />`,

  barcode: `import { Barcode } from "@joyui/react"

// Peer: pnpm add jsbarcode
<Barcode value="MH-2026-0312" format="CODE128" />`,

  "qr-code": `import { QrCode } from "@joyui/react"

// Peer: pnpm add qrcode
<QrCode value="https://joyui.dev" />`,
};

export function getUsageExample(name: string): string {
  const key = name.trim().toLowerCase();
  const item = getComponent(key);
  const peers = optionalPeersFor(key);
  const pitfalls = pitfallsFor(key);

  let body =
    OVERRIDES[key] ??
    GENERATED_EXAMPLES[key] ??
    (item
      ? `${importSnippet(item)}\n\n// See docs: https://joyui.dev/docs/${item.name}`
      : `// Unknown "${name}". Call search_components or list_components.`);

  const footer: string[] = [];
  if (peers) {
    footer.push(`// Optional peers: pnpm add ${peers.packages.join(" ")}`);
    footer.push(`// ${peers.note}`);
  }
  for (const p of pitfalls) footer.push(`// Pitfall: ${p}`);

  if (footer.length) body = `${body.trim()}\n\n${footer.join("\n")}\n`;
  return body;
}

/** @deprecated use getUsageExample — kept for any external imports */
export const EXAMPLES: Record<string, string> = new Proxy(
  {},
  {
    get(_t, prop: string) {
      if (prop in OVERRIDES) return OVERRIDES[prop];
      return GENERATED_EXAMPLES[prop];
    },
    ownKeys() {
      return Reflect.ownKeys({ ...GENERATED_EXAMPLES, ...OVERRIDES });
    },
    getOwnPropertyDescriptor() {
      return { enumerable: true, configurable: true };
    },
  },
);
