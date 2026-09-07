## [1.0.2](https://github.com/ExaDev/dependency-heal/compare/v1.0.1...v1.0.2) (2026-09-07)

### Bug Fixes

- pass matrix branch/PR values through env, not inline run: interpolation ([f875cbe](https://github.com/ExaDev/dependency-heal/commit/f875cbeb351d0fb85d8681b5f721c8ba6ae49f34))
- stop serializing stranded-PR healing behind each other's CI wait ([076b98c](https://github.com/ExaDev/dependency-heal/commit/076b98c9f98076dd97a1b35676a666b0cb2d42fe))

## [1.0.1](https://github.com/ExaDev/dependency-heal/compare/v1.0.0...v1.0.1) (2026-09-07)

### Bug Fixes

- stop stranding sibling-update PRs on non-required checks, stale duplicates, and merge commits ([3b81d5d](https://github.com/ExaDev/dependency-heal/commit/3b81d5d46a8464b761592f293df8b09776245c9d))

## 1.0.0 (2026-09-04)

### Bug Fixes

- **ci:** scope actionlint's -ignore to one known false positive, give npm ci more timeout headroom ([c4bf8f8](https://github.com/ExaDev/dependency-heal/commit/c4bf8f8ddbb96642ee99852eb767220b2095fa65))
- restore packageManager field, exclude turbo's own cache from lint ([2df7fa6](https://github.com/ExaDev/dependency-heal/commit/2df7fa671a66f3df782e4b3338658341bc32fbbf))

### Features

- scaffold reusable sibling-dependency-update workflow ([a6c6f22](https://github.com/ExaDev/dependency-heal/commit/a6c6f2222791eb1810f2226e78af27ceb4b714e0))
