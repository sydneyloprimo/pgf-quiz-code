# AGENTS.md - Development Guidelines

This document outlines the coding standards, patterns, and best practices for working with this codebase. Follow these guidelines to maintain consistency and code quality.

## ⚠️ Important: Documentation Tool

**For all new work, use the bd tool instead of markdown.** When creating documentation, writing guides, or generating any text-based content, prioritize using the bd tool over markdown files.

### Using bd (Beads)

[Beads](https://github.com/steveyegge/beads) (`bd`) is a dependency-aware issue tracker designed for coding agents. Use it to track work items, dependencies, and progress instead of creating markdown files for task tracking.

#### Setup

The `bd` tool is already initialized in this repository. The binary is located at `~/.local/bin/bd`. If it's not in your PATH, use the full path or add it to your PATH:

```bash
# Add to PATH (add to ~/.zshrc or ~/.bashrc)
export PATH="$HOME/.local/bin:$PATH"

# Or use full path
~/.local/bin/bd --version
```

#### Common Commands for Agents

**Creating Work Items:**

```bash
# Create a new issue/task
bd create "Description of work" -p 1 -t feature

# Create with dependencies (blocked by another issue)
bd create "Implement feature X" -p 1 -t feature --blocked-by bd-abc123

# Create with labels
bd create "Fix bug" -t bug -p 1 -l urgent,backend

# Create with priority (1=highest, 5=lowest)
bd create "Refactor component" -p 3 -t refactor
```

**Tracking Progress:**

```bash
# List all issues
bd list

# List ready work (no blockers)
bd ready

# Update issue status
bd status bd-abc123 in-progress
bd status bd-abc123 done

# View issue details
bd show bd-abc123
```

**Managing Dependencies:**

```bash
# Mark an issue as blocked by another
bd block bd-abc123 bd-def456

# Unblock an issue
bd unblock bd-abc123 bd-def456

# View dependencies
bd deps bd-abc123

# List blocked issues
bd blocked
```

**For Agents (JSON output):**

```bash
# Get ready work in JSON format (for programmatic access)
bd ready --json

# Get issue details in JSON
bd show bd-abc123 --json

# List all issues in JSON
bd list --json
```

**Labels and Organization:**

```bash
# Add labels during creation
bd create "Fix auth bug" -t bug -p 1 -l auth,backend,urgent

# Add/remove labels to existing issues
bd label add bd-abc123 security
bd label remove bd-abc123 urgent

# Filter by labels
bd list --label backend,auth     # AND: must have ALL labels
bd list --label-any frontend,ui  # OR: must have AT LEAST ONE
```

**Statistics:**

```bash
# View project statistics
bd stats
```

#### Best Practices

- **Create issues for all significant work items** - Don't create markdown files for task tracking
- **Use dependencies** - Track blocking relationships with `--blocked-by` or `bd block`
- **Update status** - Keep status current as work progresses (`todo`, `in-progress`, `done`)
- **Use labels** - Categorize with labels (`-l feature,bug,refactor,frontend,backend`)
- **Set priorities** - Use `-p 1` (highest) to `-p 5` (lowest)
- **Use JSON output** - For programmatic access, always use `--json` flag
- **Check ready work** - Use `bd ready` or `bd ready --json` to find unblocked tasks

#### Integration with Development Workflow

Instead of creating markdown files like `TODO.md` or `TASKS.md`, use `bd`:

```bash
# ❌ Don't create markdown files for tasks
# ✅ Do create bd issues
bd create "Implement user authentication" -p 1 -t feature -l auth,backend

# ❌ Don't track dependencies in markdown
# ✅ Do use bd dependencies
bd create "Add login form" -p 1 -t feature --blocked-by bd-abc123
```

**See the [Beads documentation](https://github.com/steveyegge/beads) for complete command reference.**

## Table of Contents

- [File Organization](#file-organization)
- [Component Patterns](#component-patterns)
- [TypeScript Guidelines](#typescript-guidelines)
- [Styling Guidelines](#styling-guidelines)
- [Internationalization (i18n)](#internationalization-i18n)
- [Import Organization](#import-organization)
- [Performance Optimization](#performance-optimization)
- [GraphQL Patterns](#graphql-patterns)
- [Code Quality Standards](#code-quality-standards)

---

## File Organization

### Component Files

- **Naming**: Files should be named after the exported component
  - ✅ `AuthCard/index.tsx` exports `AuthCard`
  - ✅ `ProductCard/index.tsx` exports `ProductCard`
  - ❌ `auth-card.tsx` or `product-card.tsx`

### Directory Structure

```
components/
  [feature]/
    [ComponentName]/
      index.tsx
      styles.modules.css (if needed)
```

### Path Aliases

Use TypeScript path aliases for imports:

- `@/*` - Root directory
- `components/*` - Components directory
- `hooks/*` - Custom hooks
- `public/*` - Public assets
- `shopify/*` - Shopify/GraphQL code
- `types/*` - Type definitions
- `utils/*` - Utility functions

**Example:**

```typescript
import Card from '@/components/common/Card'
import { useProductSearch } from '@/hooks/useProductSearch'
import { Routes } from '@/types/enums/routes'
```

---

## Component Patterns

### Component Structure

1. **Default Exports**: Components use default exports
2. **Functional Components**: Use function components (not class components)
3. **PropsWithChildren**: Extend `PropsWithChildren` when components accept children

**Example:**

```typescript
import { PropsWithChildren } from 'react'

interface CardProps extends PropsWithChildren {
  className?: string
}

const Card = ({ children, className }: CardProps) => (
  <div className={cn('base-styles', className)}>
    {children}
  </div>
)

export default Card
```

### Client Components

- Add `'use client'` directive at the top of files that use:
  - React hooks (`useState`, `useEffect`, etc.)
  - Browser APIs (`window`, `localStorage`, etc.)
  - Event handlers
  - Third-party client libraries

**Example:**

```typescript
'use client'

import { useState } from 'react'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  // ...
}
```

### Component Props

- Always define explicit interfaces for props
- Use descriptive prop names
- Make props optional with `?` when appropriate
- Extend HTML element props when wrapping native elements

**Example:**

```typescript
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
}
```

---

## TypeScript Guidelines

### Type Safety

- **Strict Mode**: TypeScript strict mode is enabled - maintain type safety
- **No Type Assertions**: Avoid unnecessary type assertions (`as Type`)
- **Type Guards**: Use type guards instead of assertions when checking types

**Example:**

```typescript
// ✅ Good - Type guard
export function isProduct(
  toBeDetermined: Product | ProductVariant
): toBeDetermined is Product {
  return (toBeDetermined as Product).__typename === 'Product'
}

// ❌ Bad - Unnecessary assertion
const product = data as Product
```

### Type Definitions

- **Enums**: Use enums for constants (routes, events, cookies, etc.)
  - Location: `types/enums/`
- **Type Guards**: Place type guards in `types/guards/`
- **Interfaces**: Define interfaces for component props and data structures

**Example:**

```typescript
// types/enums/routes.ts
export enum Routes {
  home = '/',
  cart = '/cart',
  products = '/products',
}
```

### Type Inference

- Prefer type inference when types are obvious
- Use explicit types for function parameters and return types
- Use `z.infer<typeof schema>` for Zod schema types

---

## Styling Guidelines

### Tailwind CSS

- **Primary Styling Method**: Use Tailwind CSS for all styling
- **Custom Configuration**: Colors, fonts, shadows, and z-index values are defined in `tailwind.config.js`
- **Variants Over Classes**: Prioritize Tailwind variants (`md:`, `hover:`, `focus:`, etc.) over extra classes
- **Responsive Design**: Use mobile-first approach with `md:` breakpoint

**Example:**

```typescript
// ✅ Good - Using Tailwind variants
<div className="text-sm md:text-xl font-bold hover:bg-hover focus:outline-focus">
  Content
</div>

// ❌ Bad - Extra classes or inline styles
<div className="text-sm custom-large-text" style={{ fontWeight: 'bold' }}>
  Content
</div>
```

### Color Usage

- **No Hex Colors**: Never use explicit hex colors in components
- **Use Tailwind Colors**: Use colors from `tailwind.config.js` (e.g., `bg-active`, `text-error`, `border-focus`)
- **CSS Variables**: Use existing Tailwind/custom CSS variables
- **Local Constants**: If a new color is needed, declare it as a constant locally or add to Tailwind config

**Example:**

```typescript
// ✅ Good
<div className="bg-active text-white border-focus">

// ❌ Bad
<div className="bg-[#254A96]" style={{ color: '#FFFFFF' }}>
```

### Class Merging

- Use `classnames` (imported as `cn`) for conditional classes
- Combine Tailwind classes with custom classes when needed

**Example:**

```typescript
import cn from 'classnames'

<div className={cn('base-styles', className, { 'opacity-50': disabled })}>
```

### Custom CSS

- Use CSS modules (`styles.modules.css`) only when necessary
- Prefer Tailwind utilities over custom CSS
- Custom CSS classes are defined in `globals.css` (e.g., `.btn-primary`, `.link-primary`)

---

## Internationalization (i18n)

### Text Content

- **No Hardcoded Text**: Never include explicit text strings in components
- **Use Translations**: Always use `useTranslations` hook from `next-intl`
- **Translation Keys**: Use namespaced keys (e.g., `'Header.searchPlaceholder'`)

**Example:**

```typescript
import { useTranslations } from 'next-intl'

const Header = () => {
  const t = useTranslations('Header')

  return (
    <input placeholder={t('searchPlaceholder')} />
  )
}
```

### Translation Files

- Location: `messages/en.json`, `messages/es.json`
- Keys are sorted alphabetically (enforced by ESLint)
- Use nested objects for organization

**Example:**

```json
{
  "Header": {
    "searchPlaceholder": "Search products...",
    "shoppingCart": "Shopping Cart"
  }
}
```

---

## Import Organization

### Import Order

ESLint enforces the following import order (alphabetically within groups):

1. Built-in modules
2. External packages
3. Internal imports (`@/`)
4. Sibling/parent imports
5. Index imports
6. Unknown imports

**Example:**

```typescript
// Built-in
import { useState, useEffect } from 'react'

// External
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import cn from 'classnames'

// Internal (@/)
import Card from '@/components/common/Card'
import { Routes } from '@/types/enums/routes'
import { useProductSearch } from '@/hooks/useProductSearch'

// Sibling
import HeaderDropdownMenu from './HeaderDropdownMenu'
```

### Import Rules

- **No Relative Imports**: Never use `../` imports (enforced by ESLint)
- **Use Path Aliases**: Always use `@/` or other path aliases
- **Remove Unused Imports**: ESLint automatically removes unused imports

---

## Performance Optimization

### Rendering Logic

- **Proper Rendering Decisions**: Place rendering decision logic correctly to avoid unnecessary re-renders
- **useMemo**: Use `useMemo` for expensive computations
- **useCallback**: Use `useCallback` for functions passed as props or dependencies

**Example:**

```typescript
const debouncedSearch = useCallback(
  debounce((value: string) => {
    // search logic
  }, DEBOUNCE_WAIT_TIME),
  []
)

const query = useMemo(() => constructSearchQuery(filters), [filters])
```

### React Query

- Use TanStack Query (React Query) for server state management
- Generated hooks from GraphQL Code Generator are used for queries
- Client is imported from `shopify/client`

**Example:**

```typescript
import { client } from 'shopify/client'
import { useGetAllProductsQuery } from 'shopify/generated/graphql'

const { data, isFetching } = useGetAllProductsQuery(client, variables)
```

---

## GraphQL Patterns

### Query Files

- GraphQL queries/mutations are in separate `.graphql` files
- Location: `shopify/graphql/queries/` and `shopify/graphql/mutations/`
- Use GraphQL Code Generator to generate TypeScript types and hooks

### Code Generation

- Run `yarn generate` to regenerate types after GraphQL changes
- Generated files are in `shopify/generated/graphql.ts`
- Never edit generated files directly

### Query Structure

- Use descriptive query names (e.g., `GetProductDetail`, `GetAllProducts`)
- Include only necessary fields
- Use aliases for transformed fields (e.g., `url: url(transform: {...})`)

---

## Code Quality Standards

### Unused Code

- **No Unused Variables**: Remove all unused variables and imports
- **No Unused Code**: Remove dead code and commented-out code
- ESLint automatically flags unused imports

### Line Length

- **Maximum 80 characters** per line (enforced by ESLint)
- Exceptions: comments, template literals, URLs, strings

### Code Formatting

- Use Prettier for code formatting
- Run `yarn prettier` before committing
- ESLint auto-fixes issues where possible

### Linting

- Run `yarn lint` to check for issues
- ESLint rules:
  - No relative imports (`../`)
  - Alphabetical import ordering
  - Unused imports removal
  - TypeScript strict mode compliance
  - Max line length (80 chars)

### Git Practices

- **Never commit to main or develop** without explicit consent
- Use feature branches for all changes
- Follow the existing branch naming conventions

---

## Additional Patterns

### Constants

- Define constants in `constants/index.tsx`
- Use descriptive names in UPPER_SNAKE_CASE
- Group related constants together

**Example:**

```typescript
export const MediaQuery = {
  desktop: `(min-width: ${fullConfig.theme.screens.md})`,
  mobile: `(max-width: ${fullConfig.theme.screens.md})`,
}

export const MOBILE_WIDTH = 768
```

### Hooks

- Custom hooks in `hooks/` directory
- Use `use` prefix (e.g., `useProductSearch`, `useUserAccess`)
- Return objects with descriptive property names

### Utilities

- Helper functions in `utils/` directory
- Export individual functions, not default objects
- Use descriptive function names

### Form Handling

- Use React Hook Form with Zod validation
- Define validation schemas with Zod
- Use `zodResolver` for form validation

**Example:**

```typescript
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const validationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const { register, handleSubmit } = useForm({
  resolver: zodResolver(validationSchema),
})
```

### Data Attributes

- Use `data-qa` attributes for testing/QA purposes
- Use descriptive, kebab-case names

**Example:**

```typescript
<button data-qa="delete-cart-product-button">
  Delete
</button>
```

---

## Summary Checklist

Before submitting code, ensure:

- ✅ **Use bd tool for all new documentation/work** (not markdown)
- ✅ Files are named after exported components
- ✅ No hardcoded text (use translations)
- ✅ No explicit hex colors (use Tailwind config)
- ✅ No unnecessary type assertions
- ✅ Tailwind variants used instead of extra classes
- ✅ Rendering logic optimized (useMemo/useCallback)
- ✅ No unused variables or imports
- ✅ Imports use path aliases (no `../`)
- ✅ Client components have `'use client'` directive
- ✅ Line length ≤ 80 characters
- ✅ ESLint passes without errors
- ✅ TypeScript strict mode compliance

---

## Questions?

If you're unsure about a pattern or practice, look for similar code in the codebase and follow the existing conventions. Consistency is key!
