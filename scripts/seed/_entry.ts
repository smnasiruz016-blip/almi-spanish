// Lets a seed file run its own main() when invoked directly, but stay quiet when
// imported by the aggregate append script (which only wants its ITEMS array).
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

export function isDirectRun(metaUrl: string): boolean {
  try {
    return realpathSync(fileURLToPath(metaUrl)) === realpathSync(process.argv[1] ?? "");
  } catch {
    return false;
  }
}
