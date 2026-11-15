# Common pitfalls

## Input vs TextField

- Use `<Input label="…" placeholder="…" />` for labeled fields.
- `TextField` is the layout shell / composition primitive — not a 1:1 Input replacement.

## DataTable

- Production: `<DataTable data={rows} columns={columns} />`.
- `DataTableExample` is **docs-only** and is not exported from the public barrel.

## Composer

- Import from `@joyui/react/composer`.
- Install TipTap optional peers first or the editor fails at runtime.

## Icons

- Pass Remix icons as **component references**: `leadingIcon={RiAddLine}`.
- Do not pass `<RiAddLine />` JSX unless the API explicitly asks for a ReactNode.

## Select / lists

- Use `<SelectItem id="…">`, not native `<option>`.

## Modal

- Structure: `ModalTrigger` → `Modal` → `ModalDialog` → header/body/footer.
- Do not invent a single `<Dialog open>` API from other libraries.

## Tokens

- Prefer `text-text-*` / `bg-background-*` / `border-border-*`.
- Never hardcode hex or raw `bg-red-600` in product UI.
- Dark mode = `.dark` on `<html>`, not ad-hoc `dark:bg-gray-*` overrides.

## Class merge

- Always merge with `cn` / `cx` from `@joyui/react` (typography-aware).
- Plain `twMerge(clsx())` can drop JoyUI composite type utilities.
