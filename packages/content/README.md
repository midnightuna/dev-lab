# @dev-lab/content

`@dev-lab/content` is the framework-independent, build-time content domain for `dev-lab`.
It reads Markdown posts and the tag and series registries, validates the complete source set,
and returns an immutable `ContentCatalog` for static consumers.

## Source data

The default source directory is the repository-level `content/` directory:

```text
content/
├─ posts/**/*.md
├─ tags.yml
└─ series.yml
```

Callers may pass `contentDirectory` and `now` to validate isolated fixtures deterministically.

## API

```ts
const content = loadContent()

getAllPosts(content)
getPublishedPosts(content)
getPostBySlug(content, slug)
getPostsByTag(content, tag)
getSeriesPosts(content, series)
getTagDefinitions(content)
getSeriesDefinitions(content)
```

`loadContent()` throws `ContentValidationError` when any source is invalid. `validateContent()`
returns the same result as a discriminated union without throwing. Production-facing queries
return published posts only; `getAllPosts()` is the explicit API for consumers that need drafts.

## Commands

Run validation from the repository root:

```text
pnpm content:validate
```

The CLI also accepts an isolated source directory:

```text
pnpm --filter @dev-lab/content validate -- --content-dir <path>
```
