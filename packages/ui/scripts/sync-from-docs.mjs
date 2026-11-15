/**
 * @deprecated packages/ui is now the source of truth.
 * Use `node ./scripts/generate-barrel.mjs` (or `pnpm --filter @joyui/react barrel`).
 *
 * The old docs → package copy flow has been removed. Edit components under
 * packages/ui/src and styles under packages/ui/src/styles.
 */
console.error(
  "[deprecated] sync-from-docs.mjs was removed.\n" +
    "Edit packages/ui (source of truth), then run:\n" +
    "  pnpm --filter @joyui/react barrel\n" +
    "  pnpm --filter @joyui/react build",
);
process.exit(1);
