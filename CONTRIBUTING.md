# Contributing to Election AI Assistant

We welcome contributions! To ensure a smooth process, please follow these guidelines.

## Development Workflow

1.  **Fork the repository** and create your branch from `main`.
2.  **Install dependencies**: `npm install`.
3.  **Run tests**: Ensure all tests pass before submitting (`npm test`).
4.  **Linting**: Run `npm run lint` to check for style issues.
5.  **Build**: Verify the project builds successfully (`npm run build`).

## Code Standards

-   Use TypeScript for all new code.
-   Follow the existing component structure in `src/components`.
-   Abstract complex logic into custom hooks in `src/hooks`.
-   Add JSDoc comments to all exported functions and components.
-   Ensure components are accessible (ARIA labels, semantic HTML).

## Commit Messages

Use conventional commits:
-   `feat:` for new features
-   `fix:` for bug fixes
-   `docs:` for documentation changes
-   `refactor:` for code refactoring
-   `test:` for adding or updating tests
