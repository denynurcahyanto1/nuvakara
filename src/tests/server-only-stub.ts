/**
 * Test stub for the `server-only` package.
 *
 * Next.js aliases `server-only` to an empty module during bundling; Vitest
 * needs the same, otherwise importing a server module from a test throws
 * "This module cannot be imported from a Client Component module".
 */
export {};
