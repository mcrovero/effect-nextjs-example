# @mcrovero/effect-nextjs Example

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) that demonstrates the usage of the [`@mcrovero/effect-nextjs`](https://www.npmjs.com/package/@mcrovero/effect-nextjs) library.

## About @mcrovero/effect-nextjs

`@mcrovero/effect-nextjs` is a library that provides typed helpers to build Next.js App Router pages, layouts, server components, and server actions with [Effect](https://effect.website/). It allows you to:

- Compose middlewares as Context.Tags
- Validate params/search params/input with Schema
- Build your Effect programs with a single call
- Handle errors in a type-safe way

⚠️ **Warning**: This library is in early alpha and is not ready for production use.

## Features Demonstrated

This example project showcases:

- **Typed Page Handlers**: Pages with validated params and search params
- **Server Actions**: Type-safe server actions with input validation
- **Client Components**: Integration with client-side components
- **Middleware System**: Authentication and other middleware patterns
- **Schema Validation**: Using Effect Schema for runtime validation
- **Error Handling**: Proper error boundaries and handling

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd my-app
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
my-app/
├── app/                    # Next.js App Router
│   ├── action.tsx         # Server action example
│   ├── client-component.tsx # Client component integration
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page with Effect integration
├── lib/
│   └── base.ts           # Effect setup, middlewares, and services
└── package.json
```

## Key Files

- **`lib/base.ts`**: Contains the core Effect setup, including services, middlewares, and the main Effect runtime configuration
- **`app/page.tsx`**: Demonstrates a typed page handler with middleware and schema validation
- **`app/action.tsx`**: Shows server action implementation with input validation
- **`app/client-component.tsx`**: Example of integrating Effect-powered server components with client components

## Core Concepts

### Services and Context

The library uses Effect's Context system to provide services to your handlers:

```typescript
// Define a service
export class CurrentUser extends Context.Tag("CurrentUser")<
  CurrentUser, 
  { id: string; name: string }
>() {}
```

### Middlewares

Middlewares are defined as Context.Tags and can provide services or handle cross-cutting concerns:

```typescript
export class AuthMiddleware extends NextMiddleware.Tag<AuthMiddleware>()(
  "AuthMiddleware", 
  {
    provides: CurrentUser,
    failure: Schema.String
  }
) {}
```

### Schema Validation

Use Effect Schema to validate and transform inputs:

```typescript
const page = Next.make(AppLive)
  .page("HomePage")
  .setParamsSchema(Schema.Struct({ id: Schema.String }))
  .setSearchParamsSchema(Schema.Struct({ q: Schema.optional(Schema.String) }))
  .build(({ params, searchParams }) => {
    // params and searchParams are fully typed and validated
    return Effect.succeed(<div>Hello World</div>)
  })
```

## Learn More

To learn more about the technologies used in this example:

- [Effect Documentation](https://effect.website/) - Learn about Effect, the functional programming library
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [@mcrovero/effect-nextjs](https://www.npmjs.com/package/@mcrovero/effect-nextjs) - The main library documentation

## License

This example is provided under the MIT License.
