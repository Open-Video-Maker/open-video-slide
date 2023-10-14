import path from "path";
import process from "process";
import { createRequire } from "module";
import { fileURLToPath } from "url";

/**
 * Strip the extension from a filename if it has one.
 * @param {string} name A filename.
 * @return {string} The filename without a path.
 */
export function stripExt(name: string) {
  const extension = path.extname(name);
  if (!extension) {
    return name;
  }

  return name.slice(0, -extension.length);
}

/**
 * Check if a module was run directly with node as opposed to being
 * imported from another module.
 * @param {ImportMeta} meta The `import.meta` object.
 * @return {boolean} The module was run directly with node.
 */
export function esMain(importUrl: string) {
  if (!importUrl || !process.argv[1]) {
    return false;
  }

  const require = createRequire(importUrl);
  const scriptPath = require.resolve(process.argv[1]);

  const modulePath = fileURLToPath(importUrl);

  const extension = path.extname(scriptPath);
  if (extension) {
    return modulePath === scriptPath;
  }

  return stripExt(modulePath) === scriptPath;
}
