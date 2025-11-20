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
  - [Design System Tokens](#design-system-tokens)
  - [Color Usage](#color-usage)
  - [Spacing Usage](#spacing-usage)
  - [Typography Usage](#typography-usage)
  - [Border Radius Usage](#border-radius-usage)
  - [Semantic Utilities](#semantic-utilities)
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

### Design System Tokens

**ALWAYS use design system tokens** defined in `app/[locale]/globals.css`. The design system is sourced from Figma tokens and provides a complete set of colors, spacing, typography, and other design values.

**Available Token Categories:**

- **Colors**: Primary, Secondary, Tertiary, Quaternary, Neutrals, Feedback (Success/Error/Warning/Info)
- **Typography**: Font families, sizes, line heights
- **Spacing**: Consistent spacing scale (0x through 12x)
- **Border Radius**: Standard radius values
- **Icons**: Icon size tokens
- **Breakpoints**: Mobile, Tablet, Desktop with grid configurations

**Reference Files:**

- Design tokens: `design-system/figma/figma-tokens.json`
- Breakpoints: `design-system/figma/breakpoints.yaml`
- Theme configuration: `app/[locale]/globals.css`
- Utility classes: `app/[locale]/utilities.css`

### Tailwind CSS

- **Primary Styling Method**: Use Tailwind CSS for all styling
- **Design System First**: Always prefer design system tokens over custom values
- **Custom Configuration**: All design tokens are defined in `app/[locale]/globals.css` using the `@theme` directive
- **Variants Over Classes**: Prioritize Tailwind variants (`md:`, `hover:`, `focus:`, etc.) over extra classes
- **Responsive Design**: Use mobile-first approach with `mobile:`, `tablet:`, `desktop:` custom variants

**Example:**

```typescript
// ✅ Good - Using design system tokens and Tailwind variants
<div className="text-sm tablet:text-xl font-bold hover:bg-primary-700 focus:outline-primary-600">
  Content
</div>

// ❌ Bad - Extra classes or inline styles
<div className="text-sm custom-large-text" style={{ fontWeight: 'bold' }}>
  Content
</div>
```

### Color Usage

- **No Hex Colors**: Never use explicit hex colors in components
- **Use Design System Colors**: Always use colors from the design system tokens
- **Color Families**: Use semantic color families (primary, secondary, neutral, feedback)
- **No Custom Colors**: If a color is needed, check if it exists in the design system first

**Available Color Utilities:**

```typescript
// Primary colors (100-950)
;(bg - primary - 100,
  bg - primary - 500,
  bg - primary - 600,
  text - primary - 600,
  // Secondary colors
  etc.bg - secondary - 500,
  text - secondary - 600,
  // Neutral colors
  etc.bg - neutral - 100,
  text - neutral - 700,
  border - neutral - 950,
  // Feedback colors
  etc.bg - feedback - success - 100,
  text - feedback - error - 500,
  // Background colors
  etc.bg - bg - blue,
  bg - bg - orange,
  bg - bg - violet)
```

**Example:**

```typescript
// ✅ Good - Using design system tokens
<div className="bg-primary-600 text-neutral-white border-neutral-950">
<div className="bg-feedback-success-100 text-feedback-success-500">
<div className="hover:bg-primary-700 focus:outline-primary-600">

// ❌ Bad - Hex colors or non-existent tokens
<div className="bg-[#254A96]" style={{ color: '#FFFFFF' }}>
<div className="bg-custom-blue text-active">
```

### Spacing Usage

- **Use Tailwind Default Spacing**: Tailwind provides a default spacing scale (0-12), no need to define custom spacing variables
- **Spacing Scale**: Use `p-1` through `p-12`, `gap-4`, `m-6`, etc. which use Tailwind's default spacing scale
- **No Arbitrary Values**: Avoid arbitrary spacing values like `p-[13px]`

**Example:**

```typescript
// ✅ Good - Using Tailwind default spacing
<div className="p-4 gap-6 m-8">
<div className="px-5 py-2">

// ❌ Bad - Arbitrary spacing
<div className="p-[13px]" style={{ gap: '17px' }}>
```

### Typography Usage

- **Use Design System Typography**: Use typography utilities from `utilities.css` or design system font tokens
- **Heading Classes**: Use `.heading-h1` through `.heading-h6` for headings
- **Body Text**: Use `.text-body-l`, `.text-body-m`, `.text-body-s` for body text
- **Font Families**: Use `font-sans` (Helvetica) or semantic font utilities

**Example:**

```typescript
// ✅ Good - Using design system typography
<h1 className="heading-h1">Title</h1>
<p className="text-body-m">Body text</p>
<div className="font-sans text-base">

// ❌ Bad - Custom typography
<h1 style={{ fontSize: '48px', lineHeight: '60px' }}>
```

### Border Radius Usage

- **Use Design System Radius**: Use radius tokens from the design system
- **Available Values**: `rounded-xxs`, `rounded-xs`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xxl`, `rounded-20xxl`

**Example:**

```typescript
// ✅ Good - Using design system radius
<div className="rounded-md">
<button className="rounded-lg">

// ❌ Bad - Arbitrary radius
<div className="rounded-[7px]">
```

### Semantic Utilities

- **Use React Components**: Use React components for UI elements (Button, Link, DropdownMenu) instead of CSS classes
- **Available Components**: `ButtonPrimary`, `ButtonSecondary`, `ButtonTertiary`, `ButtonOutline` from `@/components/common/Button`, `Link` from `@/components/common/Link`
- **Semantic Text Utilities**: `.text-default`, `.text-secondary`, `.text-invert`, `.text-success`, `.text-error`, `.text-warning`, `.text-info` (defined in `utilities.css`)
- **Other Utilities**: `.surface-default`, `.surface-secondary`, `.border-default`, `.elevation-sm`, etc.

**Example:**

```typescript
// ✅ Good - Using React components
import { ButtonPrimary } from '@/components/common/Button'
import CustomLink from '@/components/common/Link'

<ButtonPrimary className="w-full">
  Submit
</ButtonPrimary>
<CustomLink href="/products">View Products</CustomLink>
<div className="elevation-md">

// ❌ Bad - Recreating styles manually
<div className="bg-white text-black">
```

### Class Merging

- Use `classnames` (imported as `cn`) for conditional classes
- Combine Tailwind classes with custom classes when needed

**Example:**

```typescript
import cn from 'classnames'

<div className={cn('base-styles', className, { 'opacity-50': disabled })}>
```

### Component-Based Styling

- **Components Over CSS Classes**: Create React components for reusable UI elements (Button, DropdownMenu, Link) and put Tailwind classes directly in JSX
- **No @apply Directive**: Avoid using `@apply` to create custom CSS classes - this defeats the purpose of using Tailwind CSS
- **Component Location**: Place component classes in React components located in `components/common/` directory
- **Button Components**: Use `ButtonPrimary`, `ButtonSecondary`, `ButtonTertiary`, `ButtonOutline` from `@/components/common/Button` instead of CSS classes
- **Link Component**: Use `Link` from `@/components/common/Link` for styled links
- **Dropdown Components**: Use styled components from `@/components/common/DropdownMenu` which have styles applied directly in JSX

**Example:**

```typescript
// ✅ Good - Classes in React component JSX
import { ButtonPrimary } from '@/components/common/Button'

<ButtonPrimary className="w-full mt-4">
  Submit
</ButtonPrimary>

// ❌ Bad - Using @apply in CSS
// utilities.css
@layer components {
  .btn-primary {
    @apply bg-neutral-950 text-white px-5 py-2 rounded-md;
  }
}
```

### Custom Utilities (Limited Use)

- **Custom Utilities Only**: Use `@layer utilities {}` sparingly for truly utility-like classes that work with Tailwind modifiers
- **Avoid @apply**: Even for utilities, prefer defining styles directly in components when possible
- **Semantic Helpers**: Text color utilities (`.text-success`, `.text-error`) and background utilities (`.bg-success`, `.bg-error`) can remain as custom utilities in `utilities.css` within `@layer utilities {}` since they represent semantic meaning

**Example:**

```css
/* utilities.css - Only for semantic utilities */
@layer utilities {
  .text-success {
    @apply text-feedback-success-500;
  }
}
```

### Custom CSS

- Use CSS modules (`styles.modules.css`) only when absolutely necessary
- Prefer Tailwind utilities applied directly in JSX
- Avoid creating component classes with `@apply` - use React components instead
- Custom utility classes should be minimal and only for semantic purposes

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
- ✅ No explicit hex colors (use design system tokens)
- ✅ Design system tokens used for colors, spacing, typography
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
