import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
// Recommended config, not the plugin itself: this both enables the prettier/prettier rule (reports formatting differences as lint errors, reading prettier.config.ts the same way `prettier --check` does) and applies eslint-config-prettier, which turns off every ESLint stylistic rule that could otherwise disagree with Prettier. It carries no `files:` restriction of its own, so it applies to everything ESLint actually lints below — YAML is untouched here (no ESLint language plugin for it), so `npm run format:check` remains the one authoritative formatting check that also covers the workflow YAML files.
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default defineConfig([
  // A files-less ignores-only entry applies globally, across every config below -- node_modules/** is already ESLint's own default ignore, but .turbo/** isn't: turbo writes its own cache manifests as single-line, non-pretty-printed JSON with nanosecond timestamps, which trips both prettier/prettier and json/no-unsafe-values the moment more than one `npx turbo run <task>` has populated it in the same working directory (confirmed locally -- CI's own Typecheck/Lint/Format jobs never hit this since each runs in an isolated fresh checkout with only one turbo task, but a local `npx turbo run typecheck` followed by `npx turbo run lint` in the same tree does).
  { ignores: [".turbo/**"] },
  {
    files: ["**/*.ts"],
    extends: [tseslint.configs.recommended],
  },
  {
    files: ["**/*.json"],
    ignores: ["package-lock.json"], // generated, not hand-maintained
    language: "json/json",
    plugins: { json },
    extends: ["json/recommended"],
  },
  {
    // gfm, not commonmark: every markdown file here is rendered on GitHub, which relies on GFM-only syntax CommonMark doesn't define.
    files: ["**/*.md"],
    ignores: ["CHANGELOG.md"], // generated, not hand-maintained
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"],
  },
  eslintPluginPrettierRecommended,
]);
