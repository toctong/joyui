/** Shared install snippet for component docs. */
export function docInstallBash(slug: string) {
  return `npx @joyui/cli add ${slug} --yes`;
}
