import path from "node:path";

/** Resolve `candidate` under `cwd` and reject path escapes (`..`, absolute). */
export function resolveInsideCwd(cwd: string, candidate: string): string {
  const root = path.resolve(cwd);
  // Reject POSIX absolutes and Windows drive/UNC paths (even on Linux CI).
  if (path.isAbsolute(candidate) || path.win32.isAbsolute(candidate)) {
    throw new Error(`Refusing absolute write path: ${candidate}`);
  }
  const cleaned = candidate.replace(/^[/\\]+/, "");
  if (!cleaned || cleaned.split(/[/\\]/).includes("..")) {
    throw new Error(`Refusing to write outside project root: ${candidate}`);
  }
  const resolved = path.resolve(root, cleaned);
  const rel = path.relative(root, resolved);
  if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(`Refusing to write outside project root: ${candidate}`);
  }
  return resolved;
}

/** Only allow HTTPS registry bases (optional JOYUI_REGISTRY_URL override). */
export function assertHttpsRegistryBase(base: string): string {
  let url: URL;
  try {
    url = new URL(base.endsWith("/") ? base : `${base}/`);
  } catch {
    throw new Error(`Invalid registry URL: ${base}`);
  }
  if (url.protocol !== "https:") {
    throw new Error(`Registry URL must be https: ${base}`);
  }
  return `${url.origin}${url.pathname}`.replace(/\/$/, "");
}
