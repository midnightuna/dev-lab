# dev-lab

`dev-lab` is a frontend engineering lab and the source repository for
[nightuna dev log](https://midnightuna.github.io/dev-lab/). It keeps Markdown content,
build-time validation, the statically exported Next.js blog, and its publishing workflow in one
pnpm monorepo.

## Requirements

- Node.js `24.19.0` (see `.nvmrc`)
- pnpm `12.9.1` (see the root `packageManager` field)

## Setup

```bash
nvm use
pnpm install --frozen-lockfile
pnpm dev
```

The development server uses `http://localhost:3000` and serves the blog from `/` by default.
Copy `apps/blog/.env.example` to `apps/blog/.env.local` only when local overrides are needed.

## Repository structure

```text
apps/blog/        Next.js routes, UI, Panda CSS, metadata, and static export
content/          Markdown posts and the tag and series registries
packages/content/ Content parsing, validation, visibility, and ordering rules
.github/          Issue forms, pull request template, CI, and Pages deployment
```

The dependency direction is:

```text
@dev-lab/blog → @dev-lab/content → content/
```

Content-domain rules belong in `@dev-lab/content`; routes and UI consume its validated models.

## Commands

Run commands from the repository root.

| Command                 | Purpose                                               |
| ----------------------- | ----------------------------------------------------- |
| `pnpm dev`              | Generate Panda CSS and start the blog locally         |
| `pnpm content:validate` | Validate every post and taxonomy registry             |
| `pnpm format:check`     | Check formatting without rewriting files              |
| `pnpm lint`             | Run ESLint                                            |
| `pnpm typecheck`        | Generate Next.js route types and check all workspaces |
| `pnpm build`            | Validate content and create the production export     |
| `pnpm format`           | Format repository files                               |

Before opening a pull request, run:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm content:validate
pnpm build
```

## Writing a post

Add a Markdown file under `content/posts/` with explicit frontmatter:

```yaml
---
title: Post title
slug: post-title
status: draft
date: 2026-10-12
updatedAt:
excerpt: A single-line summary used by lists, metadata, and RSS.
tags:
  - javascript
series:
thumbnail:
---
```

- `slug` and taxonomy keys use lowercase kebab-case.
- Every post needs at least one entry registered in `content/tags.yml`.
- Set `series` only to a key registered in `content/series.yml`.
- Keep a post as `draft` while writing. Drafts are excluded from production routes, sitemap, and
  RSS.
- Change `status` to `published` only when the post is ready to ship. A future publication date is
  invalid.
- `updatedAt`, `series`, and `thumbnail` may be left empty.

Run `pnpm content:validate` after changing a post or taxonomy registry.

### Post images

Post images are repository-local assets. Store them under:

```text
apps/blog/public/images/posts/<post-slug>/
```

Reference them from Markdown or `thumbnail` with a root-relative path:

```markdown
![Description](/images/posts/post-title/example.png)
```

External image URLs are not supported. The shared URL helper adds the deployment base path during
rendering.

## Publishing workflow

1. Create a topic branch and write the post as a draft.
2. Run the local validation commands.
3. Mark the post as published when it is ready for public release.
4. Open a pull request using the repository template.
5. The `CI / Validate` check installs from the frozen lockfile and runs every repository gate.
6. Merge with squash after review and a successful check.
7. A push to `main` builds and deploys `apps/blog/out` to GitHub Pages.

The production build uses:

```text
SITE_URL=https://midnightuna.github.io/dev-lab
NEXT_PUBLIC_BASE_PATH=/dev-lab
```

Deployment is also available through the `Deploy Pages` workflow's manual dispatch. Build output is
uploaded as a Pages artifact and is not committed to a `gh-pages` branch.

## License

Source code is licensed under the [MIT License](./LICENSE).

The following are excluded from the MIT license and remain All rights reserved unless a file states
otherwise:

- articles and taxonomy data under `content/`
- blog images under `apps/blog/public/images/`

See the license notices in those directories for details.
