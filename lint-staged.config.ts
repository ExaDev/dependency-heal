// lint-staged loads a TypeScript config via dynamic import of the raw file, relying on Node's native type-stripping (enabled by default from v22.18.0/v23.6.0 onward). The "engines" field in package.json pins the 22.x floor higher than that, at v22.22.1 -- not the type-stripping requirement itself, but lint-staged's own declared minimum.

// eslint.config.ts excludes package-lock.json from lint entirely (generated, not hand-maintained); the `!(package-lock).json` glob below applies the same exclusion to prettier, which has no ignores option of its own here.
import { defineConfig } from "lint-staged/config";

export default defineConfig({
  "*.{ts,md}": [
    "eslint --fix --cache --cache-location node_modules/.cache/eslint/.eslintcache",
    "prettier --write --cache",
  ],
  "*.json":
    "eslint --fix --cache --cache-location node_modules/.cache/eslint/.eslintcache",
  "!(package-lock).json": "prettier --write --cache",
  "*.{yml,yaml}": "prettier --write --cache",
});
