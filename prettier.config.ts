import type { Config } from "prettier";

/**
 * singleQuote is already Prettier's own default (false); stated explicitly rather than omitted, since every YAML, JSON, and TypeScript file in this repository is written double-quoted by hand already — an explicit setting says that's a deliberate choice, not an unexamined default.
 *
 * proseWrap is left at its own default, preserve: prose and YAML comments here are written as one continuous line regardless of length, and preserve is the one setting that leaves that alone rather than reflowing it at printWidth.
 */
const config: Config = {
  singleQuote: false,
};

export default config;
