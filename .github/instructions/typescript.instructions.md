---
applyTo: "**/*.ts,**/*.tsx"
---

# TypeScript-Specific Instructions

## Type Safety

- **NEVER** use the `any` type - use `unknown` if type is truly unknown and narrow it with type guards
- **NEVER** use `@ts-ignore` or `@ts-expect-error` without a detailed comment explaining why
- Always enable strict mode in `tsconfig.json`
- Use `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, and all strict flags
- Prefer `interface` for object shapes, `type` for unions, intersections, and computed types

## React Components (for .tsx files)

- Use functional components with React hooks, not class components
- Always type component props with an interface (e.g., `interface ButtonProps { ... }`)
- Use `React.FC` sparingly - prefer explicit typing of props
- Destructure props in the component parameters
- Use `React.ReactNode` for children prop type
- Ensure all event handlers have proper typing

## Async/Await Patterns

- Always use `async/await` instead of raw promises
- Handle errors with try/catch blocks in async functions
- Always type the return value of async functions (e.g., `async function foo(): Promise<Result>`)
- Use `Promise.all()` for parallel operations
- Implement proper timeout handling for external calls

## Credential and Cryptographic Code

- Use well-established cryptographic libraries (don't implement crypto primitives)
- Validate all credential schemas against W3C VC Data Model
- Type all credential structures explicitly
- Handle selective disclosure fields as optional types
- Always validate signatures before trusting credential content

## API and Data Layer

- Define explicit types for all API request and response payloads
- Use TypeScript interfaces that match OpenAPI specifications
- Type database models separately from API DTOs
- Use discriminated unions for variant types (e.g., different credential formats)
- Validate input data at API boundaries using a validation library (e.g., Zod, io-ts)

## Error Handling

- Define custom error types that extend `Error`
- Include error codes and structured context in errors
- Type error responses consistently
- Never throw strings, always throw `Error` instances
- Use exhaustive type checking in switch statements (never reach `default` for known types)

## Dependency Injection

- Define interfaces for all injectable dependencies
- Type constructor parameters explicitly
- Use a DI container (e.g., TSyringe, InversifyJS)
- Avoid circular dependencies

## Testing

- Type test fixtures and mocks properly
- Use `jest.MockedFunction<typeof fn>` for mocked functions
- Avoid `as any` in tests - properly type test data
- Use type-safe factory functions for test data creation

## Imports and Modules

- Use explicit imports, avoid `import *`
- Group imports: external libraries, internal modules, types
- Use path aliases defined in `tsconfig.json` for internal imports
- Import types with `import type` when only using for typing

## Multi-Tenancy Typing

- Always include `tenantId: string` in types representing tenant-specific data
- Type middleware that injects tenant context
- Use branded types to distinguish tenant IDs from regular strings if appropriate

## Performance

- Avoid unnecessary type assertions (`as`)
- Use const assertions (`as const`) for literal types
- Mark readonly properties with `readonly` keyword
- Use `Readonly<T>` utility type for immutable objects

## Comments and Documentation

- Use JSDoc comments for public APIs and exported functions
- Document complex type definitions with comments
- Explain non-obvious type assertions
- Document generic type parameters
