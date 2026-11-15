import assert from "node:assert/strict";
import path from "node:path";
import { describe, it } from "node:test";
import { assertHttpsRegistryBase, resolveInsideCwd } from "./fs-safe.ts";

describe("resolveInsideCwd", () => {
  const cwd = path.resolve("/tmp/joyui-project");

  it("allows nested relative paths", () => {
    const out = resolveInsideCwd(cwd, "components/ui/button.tsx");
    assert.equal(out, path.resolve(cwd, "components/ui/button.tsx"));
  });

  it("rejects parent escapes", () => {
    assert.throws(() => resolveInsideCwd(cwd, "../secrets.txt"));
  });

  it("rejects absolute paths", () => {
    assert.throws(() => resolveInsideCwd(cwd, path.resolve(cwd, "../outside.txt")));
    assert.throws(() => resolveInsideCwd(cwd, "C:\\\\Windows\\\\system32\\\\cmd.exe"));
  });
});

describe("assertHttpsRegistryBase", () => {
  it("accepts https", () => {
    assert.equal(
      assertHttpsRegistryBase("https://joyui.dev/r"),
      "https://joyui.dev/r",
    );
  });

  it("rejects http", () => {
    assert.throws(() => assertHttpsRegistryBase("http://evil.test/r"));
  });
});
