# dependency-heal

A reusable GitHub Actions workflow that bumps a sibling ExaDev-published dependency the instant it releases, and heals any resulting pull request that falls behind `main` before it can merge.

## Why this exists

A package that depends on another ExaDev-published package (`document-schema.js` depending on `byte-codec`, for example) shouldn't have to wait for a scheduled Dependabot scan to pick up a fresh release. This workflow does two things:

- **`bump-and-open-pr`**: triggered by a `repository_dispatch` event (`sibling-released`) that a sibling package's own release CI fires the instant it publishes. Bumps the dependency, opens a PR, waits for CI, and rebase-merges once green.
- **`heal-stranded-prs`**: triggered on every push to `main` (and manually via `workflow_dispatch`). Finds any `sibling-update/*` PR that's fallen behind or gone conflicting since it was opened, and either updates its branch or regenerates it against the current `main`.

This workflow originally lived in `ExaDev/.github`, shared across the documents.js package family. That family has since been consolidated into a single monorepo, which manages its own dependencies via pnpm workspace references and no longer needs this. It moved here because its remaining active use is a genuine cross-org caller.

## Adopting it in a repository

1. Add a caller stub at `.github/workflows/sibling-dependency-update.yml`:

   ```yaml
   name: Sibling dependency instant update

   on:
     repository_dispatch:
       types: [sibling-released]
     push:
       branches: [main]
     workflow_dispatch: {}

   permissions:
     contents: write
     pull-requests: write

   jobs:
     sync:
       uses: ExaDev/dependency-heal/.github/workflows/sibling-dependency-update.yml@v1
       with:
         workspace: true # only if your repo is itself a pnpm workspace
       secrets: inherit
   ```

2. Make sure a GitHub App with `contents: write` and `pull-requests: write` access to your repository exists, and that its private key is available as a repository (or org) secret named `AUTOMERGE_APP_PRIVATE_KEY` -- or pass a different secret explicitly via `secrets.app-private-key` if it's named something else.
3. If your repository has a minimum-release-age gate on package installs (pnpm's `minimumReleaseAgeExclude`, a project `.npmrc`), make sure it excludes the packages this workflow can bump -- otherwise the bump step's own `pnpm add`/`pnpm update` will hit the same gate a fresh release is published within.
4. Have the sibling package's own release CI fire the dispatch on publish:

   ```yaml
   - name: Notify downstream repositories
     env:
       GH_TOKEN: ${{ steps.app-token.outputs.token }}
     run: |
       gh api repos/OWNER/CONSUMER_REPO/dispatches \
         -f event_type=sibling-released \
         -F "client_payload[package]=${PACKAGE_NAME}" \
         -F "client_payload[version]=${PACKAGE_VERSION}"
   ```

## Inputs

| Input       | Type    | Default     | Description                                                                                                                                                      |
| ----------- | ------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app-id`    | string  | `"4473709"` | GitHub App ID to authenticate as for the branch push, PR, and merge.                                                                                             |
| `workspace` | boolean | `false`     | Set true when the caller repo is itself a pnpm workspace, so the bump runs recursively across every member `package.json` instead of assuming a single root one. |

## Secrets

| Secret            | Required | Description                                                                                                                                                                         |
| ----------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app-private-key` | No       | Private key for the App named by `app-id`, for a caller whose own secret isn't named `AUTOMERGE_APP_PRIVATE_KEY`. A caller relying on `secrets: inherit` doesn't need to pass this. |

## Versioning

Releases are automated by [semantic-release](https://semantic-release.gitbook.io/), triggered by the `release` job in `ci.yml` on push to `main` once `required-checks` passes. It computes the next version from [conventional commit](https://www.conventionalcommits.org/) types, writes `CHANGELOG.md`, creates a GitHub Release and version tag, and moves the floating `v1` tag to point at it via `scripts/move-major-tag.mjs` -- semantic-release has no concept of a moving major tag on its own; this is a GitHub-Actions-consumer convention layered on top, not a package-semver one.

Consumers should pin to `@v1` (recommended -- picks up every non-breaking release automatically, gated by this repository's own CI) or to an exact commit SHA (maximum stability, no automatic updates).

## Development

Single-package repository, no workspaces -- `npx turbo run <task>` gives local caching so a rerun with nothing relevant changed completes from cache instead of re-executing `tsc`/`eslint`/`prettier` from scratch.

```bash
npm install
npm run typecheck
npm run lint
npm run format:check
```

## Layout

- `.github/workflows/sibling-dependency-update.yml` -- the actual reusable workflow.
- `.github/workflows/ci.yml` -- commitlint / actionlint / typecheck / lint / format / release.
- `release.config.ts` / `commitlint.config.ts` -- semantic-release and commitlint configuration, sharing a single `commitTypes` source of truth.
- `scripts/move-major-tag.mjs` -- semantic-release plugin that moves the floating `v1` tag on every release.
- `scripts/format-changelog.mjs` -- semantic-release plugin that formats `CHANGELOG.md` with Prettier before it's committed.
