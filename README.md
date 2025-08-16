## Effect + Next.js Example

This example shows a minimal, practical integration of Effect with the Next.js App Router. It demonstrates typed pages, middlewares, server actions, and a simple React-side cache.

### Libraries
- **@mcrovero/effect-nextjs**: typed helpers for pages, layouts, middlewares, and actions — [GitHub](https://github.com/mcrovero/effect-nextjs)
- **@mcrovero/effect-react-cache**: tiny utility to cache Effect programs across React executions — [GitHub](https://github.com/mcrovero/effect-react-cache)

## Getting started

### Prerequisites
- Node.js 18+
- pnpm (recommended)

### Install
```bash
pnpm install
```

### Develop
```bash
pnpm dev
```
Open `http://localhost:3000`.

### Build & run
```bash
pnpm build
pnpm start
```

### Lint (optional)
```bash
pnpm lint
```

## How to “test” the example
This repo is a runnable demo rather than a unit-tested project. To validate behavior:

- **See middleware-provided user**: Header shows the current user, provided by a middleware (`CurrentUser`). The server logs “Getting user” once per request; check your terminal.
- **Search param typing**: In the "Current User" card, set `id` and click "Apply". The value is validated/typed via `Schema` in `BasePage`.
- **Client → Server action**: Click "Run server action". You’ll see an alert with the action result, typed end-to-end.
- **Caching**: The user fetch is wrapped with `reactCache`, so the Effect runs once per request (page/layout) and is reused.

## File tour
- `lib/auth-middleware.ts`: defines `CurrentUser` and a middleware that provides it using an Effect cached with `reactCache`.
- `lib/base.ts`: centralizes `Next.make(...)`, base builders, and schemas.
- `app/layout.tsx`: root layout using `BaseLayout` and showing the user in the header.
- `app/page.tsx`: page built with `BasePage`, typed `searchParams`, and simple UI.
- `app/action.tsx`: server action built with `BaseAction`.
- `app/client-component.tsx`: client-side button calling the server action.

## Philosophy: Effect × Next.js
Effect works with Next.js, but Next.js introduces a lot of “magic”: server components, request lifecycles, streaming, heterogeneous runtimes, and implicit boundaries between client/server. These abstractions are powerful, yet they can make it harder to express explicit, typed, and testable Effect programs without accidental coupling or double execution.

These libraries are one pragmatic approach to bridge the two ecosystems:

- **Make effects explicit**: model data dependencies as `Context.Tag`s and provide them via typed middlewares.
- **Constrain surface areas**: pages, layouts, and actions are built through small, typed builders that attach schemas, middlewares, and error types in one place.
- **Respect Next.js semantics**: embrace server components and the app router while keeping Effect programs predictable and request-scoped.
- **Reuse where safe**: use `@mcrovero/effect-react-cache` to memoize Effects across React executions in a request, avoiding redundant work while staying correct.

This is not the only way to integrate Effect with Next.js, but it aims to be an elegant, learnable baseline: small, typed building blocks that remove incidental complexity and let Effect and Next.js play nicely together.
