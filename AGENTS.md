# AGENTS.md

This file defines the durable repository contract for contributors and AI agents working in `dev-lab`. Keep it focused on project context, architectural boundaries, workflow rules, and facts that are not obvious from the code. Milestone plans and temporary task lists belong outside this file.

## Project overview

`dev-lab` is a frontend engineering lab and technical blog monorepo. It connects technical exploration, working experiments, reusable internal packages, and published articles.

The production blog is a statically exported Next.js application. Markdown is treated as source data, validated at build time, converted into framework-independent post models, and then rendered by the blog application.

## Sources of truth

- Root package manifests and configuration files own tool and runtime versions.
- `content/` owns post sources and content taxonomy data.
- `packages/content` owns content parsing, validation, visibility, and ordering rules.
- `apps/blog` owns routes, UI, Markdown rendering, site metadata, and deployment-specific URL handling.
- `.github/` owns executable Issue, pull request, CI, and deployment contracts.
- `README.md` owns contributor setup and common usage documentation.
- Package README files own package-specific public APIs and behavior.
- `AGENTS.md` owns repository-wide contributor and agent rules.

Do not duplicate a rule across multiple documents. When implementation and documentation diverge, update the document that owns the rule in the same change.

## Architecture

The intended dependency direction is:

```text
@dev-lab/blog → @dev-lab/content → content/posts, content/tags.yml
```

### Blog application

The blog application owns:

- Next.js routes, layouts, pages, and React components
- Markdown-to-React rendering
- Panda CSS configuration, tokens, and recipes
- site configuration and base-path handling
- metadata, sitemap, RSS, robots, and structured data
- public assets and presentation behavior

### Content package

The content package owns:

- Markdown discovery and frontmatter parsing
- post schemas and domain models
- tag registry parsing and validation
- slug, visibility, and ordering rules
- framework-independent content queries

The content package must not depend on Next.js, React, or Panda CSS. Do not reimplement content-domain rules in routes or UI components.

## Environment and generated files

- Use the Node.js and pnpm versions declared by the root configuration.
- Use pnpm workspaces. Do not add npm or Yarn lockfiles.
- Keep TypeScript strict mode enabled.
- Prefer ESM. Use CommonJS only when a tool explicitly requires it.
- Never edit or commit generated output such as `styled-system/`, `.next/`, or `out/`.
- Target workspaces by package name rather than folder path.

## Commands

Run repository commands from the root:

```text
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm format
pnpm format:check
pnpm content:validate
```

- Content validation and Panda code generation must complete before a production build.
- Use the ESLint CLI instead of `next lint`.
- Add a test command only when the repository has meaningful tests to run. Do not add placeholder test scripts.

## Exploration and implementation

- Use LSP definitions, references, workspace symbols, and incoming/outgoing call information before text search. Use `rg` for text and pattern search.
- Read the nearest relevant source, configuration, and package documentation before changing behavior.
- Keep changes small, reviewable, and reversible.
- Do not rewrite unrelated files or clean up code outside the requested scope.
- Introduce an abstraction only when it protects a domain boundary or has a second concrete use.
- Verify library behavior against the installed version, official documentation, and types or source when needed.
- Treat the deployment target as static hosting. Do not depend on a server runtime, middleware or proxy execution, ISR, or Server Actions.
- Run validation appropriate to the completed unit of work before moving on.

## Coding standards

- Prefer `interface` for object contracts. Use `type` for unions, mapped types, and other type-level expressions.
- Prefer named exports. Next.js page and layout default exports are exceptions.
- Use `import type` for type-only imports.
- Do not use `any`. Accept untrusted input as `unknown` and validate it.
- Prop callbacks use the `on~` prefix. Internal event handlers use the `handle~` prefix.
- Do not hardcode site URLs, base paths, or route variants in components.
- Error messages should include the file path, field, cause, and received value when available.
- Never edit generated code.

## Styling

- Panda CSS is the styling system.
- Keep strict token usage enabled.
- Prefer statically extractable style expressions.
- Do not build arbitrary style objects from runtime values.
- Build layouts mobile-first: use base styles for narrow viewports and Panda breakpoint conditions to enhance wider layouts.
- Keep pages usable without horizontal overflow at 320px, and verify responsive styling changes at mobile and desktop widths.
- Use recipes for real variants and `staticCss` only when extraction cannot discover a required finite set.
- Do not create a shared design-system package until multiple consumers justify it.

## Content rules

- Posts use tags rather than categories.
- Every post has at least one registered tag.
- Tag slugs use lowercase kebab-case.
- Duplicate tags within one post, duplicate registry keys, and unregistered tags are validation errors.
- Reusing a tag across posts is expected.
- Visibility is controlled by the post status contract. Every content consumer must use the shared visibility function.
- Draft posts must not appear in production routes, sitemap output, or RSS output.
- Raw HTML remains disabled in Markdown unless the security and rendering contract is deliberately revised.
- Ordering rules belong in the content package and must be deterministic.

## URLs and static deployment

- Keep the deployment base path and canonical site URL in centralized configuration.
- Do not hardcode the repository path in components, Markdown, or route literals.
- Use `next/link` for internal navigation.
- Resolve public and Markdown assets through the shared base-path helper.
- Generate canonical URLs, sitemap entries, RSS links, and structured data from the shared site URL.
- Do not use `assetPrefix` as a substitute for sub-path hosting.
- A custom-domain migration should require configuration changes and a rebuild, not component edits.

## Validation

Use the checks relevant to the change:

```text
pnpm format:check
pnpm lint
pnpm typecheck
pnpm content:validate
pnpm build
```

- Content changes require content validation and a production build.
- TypeScript changes require linting, type checking, and the relevant build.
- Styling changes require Panda generation and production CSS verification.
- Route, metadata, and URL changes require a static export check with a non-empty base path.
- Pipeline changes require verification from a frozen install or clean-checkout equivalent.
- Do not skip a failing gate. Report any check that could not run and the unverified scope.

## Git and pull request workflow

- Use GitHub Flow and do not work directly on `main`.
- Use descriptive kebab-case branch names with an appropriate type prefix.
- Follow Conventional Commits. Use the extended form when the subject alone does not provide enough context:

```text
<type>(<scope>): <description>

- <detailed change>
- <detailed change>
```

- Supported types: `feat`, `fix`, `refactor`, `docs`, `chore`, `ci`.
- Common scopes: `blog`, `content`, `ci`, `repo`.
- Types and scopes use lowercase English. Subjects may be written in Korean.
- When additional context would help future readers, separate the subject from the body with a blank line and add concise body bullets. Omit the body when the subject is sufficient.
- Describe the behavior, rationale, or rule established by the commit and any body bullets, not merely the list of touched files.
- Do not add AI attribution trailers. This includes `Co-authored-by`, `Generated-by`, `Claude-Session`, or any equivalent tool or session attribution.
- Review the diff and run the relevant checks before committing.
- Keep unrelated changes in separate commits.
- Do not push, create or merge a pull request, or publish a release without explicit user authorization.

Pull requests must describe the problem, changes, decisions or trade-offs, and verification. Include screenshots for visible UI changes.
