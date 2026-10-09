---
title: Published placeholder
slug: published-placeholder
status: published
date: 2026-10-09
updatedAt:
excerpt:
tags:
  - javascript
  - typescript
series: building-dev-lab
thumbnail:
---

## Rendering contract

This placeholder verifies the published content pipeline and will be replaced by a real post.

[Browse every published post](/posts/).

| Capability | Expected result                 |
| ---------- | ------------------------------- |
| GFM table  | Responsive horizontal scrolling |
| Raw HTML   | Ignored by the renderer         |

```ts
const status = 'published'
```

<div data-render-contract="raw-html">This must not render.</div>
