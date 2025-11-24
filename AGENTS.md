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

1. **Named Exports**: Components use named exports (not default exports) to ensure component names stay consistent and make refactoring easier
2. **Functional Components**: Use function components (not class components)
3. **PropsWithChildren**: Extend `PropsWithChildren` when components accept children
4. **Barrel Files**: Use `export * from './Component'` in barrel files (index.tsx) to export both components and types

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

export { Card }
```

**Barrel File (index.tsx):**

```typescript
// ✅ Good - Using export * to export component and types
export * from './Card'

// ❌ Bad - Using default export with re-export
export { default as Card } from './Card'
```

### Client Components

- **Only use `'use client'` when necessary**: Add `'use client'` directive at the top of files that use:
  - React hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`, etc.)
  - Browser APIs (`window`, `localStorage`, `sessionStorage`, `document`, etc.)
  - Event handlers (`onClick`, `onChange`, `onSubmit`, `onBlur`, etc.)
  - Client-side routing hooks (`useRouter`, `useSearchParams` from `next/navigation`)
  - Third-party client libraries that require browser APIs
- **Do NOT use `'use client'` for**:
  - Components that only render JSX without hooks or event handlers
  - Components that only use `useTranslations` from `next-intl` (works server-side)
  - Simple presentational components that don't manage state or handle events
  - Components that only wrap Next.js components like `Link` or `Image` without additional client-side logic

**Example - Needs `'use client'`:**

```typescript
'use client'

import { useState } from 'react'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  // ...
}
```

**Example - Does NOT need `'use client'`:**

```typescript
import Link from 'next/link'
import { cn } from '@/utils/cn'

const CustomLink = ({ href, children, className }) => (
  <Link href={href} className={cn('text-primary-600', className)}>
    {children}
  </Link>
)
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

### Using Existing Generic Components

- **Always Check First**: Before building new UI elements, check if a generic-purpose component already exists in `components/common/`
- **Reuse Over Rebuild**: Use existing components instead of creating new ones with similar functionality
- **Component Discovery**: Browse `components/common/` directory to familiarize yourself with available components

**Available Generic Components:**

- **Buttons**: `Button` with variants (`variant="primary"`, `variant="secondary"`, `variant="tertiary"`, `variant="outline"`) from `@/components/common/Button`
- **Links**: `Link` from `@/components/common/Link`
- **Forms**: `Input` from `@/components/common/Input`, `Select` from `@/components/common/Select`
- **Layout**: `Card` from `@/components/common/Card`, `Header` from `@/components/common/Header`, `Footer` from `@/components/common/Footer`
- **Navigation**: `DropdownMenu` components from `@/components/common/DropdownMenu`
- **Feedback**: `Toast` from `@/components/common/Toast`, `Spinner` from `@/components/common/Spinner`
- **Content**: `Carousel` from `@/components/common/Carousel`, `ProductCard` from `@/components/common/ProductCard`, `CategoryCard` from `@/components/common/CategoryCard`
- **Utilities**: `LocaleWrapper` from `@/components/common/LocaleWrapper`, `ListNextButton` from `@/components/common/ListNextButton`

**Example:**

```typescript
// ✅ Good - Using existing components with variants
import { Button } from '@/components/common/Button'
import { Link } from '@/components/common/Link'
import Card from '@/components/common/Card'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/common/DropdownMenu'

const MyPage = () => (
  <Card>
    <Button variant="primary" onClick={handleSubmit}>Submit</Button>
    <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
    <Link href="/products">View Products</Link>
    <DropdownMenu>
      <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
      <DropdownMenuContent>...</DropdownMenuContent>
    </DropdownMenu>
  </Card>
)

// ❌ Bad - Creating new components when existing ones work
const MyPage = () => (
  <div className="bg-white p-8 rounded-lg">
    <button className="bg-black text-white px-5 py-2">Submit</button>
    <a href="/products" className="text-blue-600">View Products</a>
  </div>
)
```

**When to Create New Components:**

- Only create new components when existing ones don't meet your needs
- If you need to extend functionality, consider wrapping existing components first
- If creating a new component, follow the existing patterns and place it in the appropriate directory (`components/common/` for generic components, or feature-specific directories for domain-specific components)

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
- **Avoid Arbitrary Values**: Always prefer Tailwind's default utility classes over arbitrary values (e.g., `h-10` instead of `h-[40px]`, `w-6` instead of `w-[24px]`). Use arbitrary values only when there's no Tailwind equivalent and the value is design-specific
- **Prefer Tailwind Utilities Over JavaScript**: Always prefer Tailwind utilities and pseudo-classes over JavaScript conditionals for styling. Use Tailwind's built-in pseudo-classes (e.g., `:placeholder-shown`, `:hover`, `:focus`, `:disabled`) instead of JavaScript state checks when possible

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

**Example - Tailwind Utilities Over JavaScript:**

```typescript
// ✅ Good - Using Tailwind pseudo-classes
<input
  className="text-secondary-950 placeholder-shown:text-neutral-800"
  placeholder="Enter text"
/>

// ❌ Bad - Using JavaScript conditionals for styling
const isFilled = Boolean(value)
<input
  className={isFilled ? 'text-secondary-950' : 'text-neutral-800'}
  placeholder="Enter text"
/>
```

**Example - Conditional Classes with `cn`:**

```typescript
// ✅ Good - Using cn with conditional object syntax
import { cn } from '@/utils/cn'

<div
  className={cn(
    'base-classes',
    { 'border-secondary-900': error },
    { 'cursor-not-allowed': disabled }
  )}
/>

// ✅ Good - Using Tailwind's disabled: variant
<input
  className={cn(
    'base-classes',
    'disabled:cursor-not-allowed'
  )}
  disabled={disabled}
/>

// ❌ Bad - Using JavaScript conditionals in className
<div
  className={cn(
    'base-classes',
    error && 'border-secondary-900',
    disabled && 'cursor-not-allowed'
  )}
/>
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
- **Avoid Arbitrary Values**: Always prefer Tailwind's default spacing values over arbitrary values (e.g., `h-10` instead of `h-[40px]`, `h-11` instead of `h-[44px]`, `h-px` instead of `h-[1px]`)
- **Use Closest Match**: When an exact match doesn't exist, use the closest Tailwind value (e.g., `p-3` for `10px` instead of `p-[10px]`)

**Example:**

```typescript
// ✅ Good - Using Tailwind default spacing
<div className="p-4 gap-6 m-8">
<div className="px-5 py-2">
<div className="h-10 w-6">  // h-10 = 40px, w-6 = 24px

// ❌ Bad - Arbitrary spacing values
<div className="p-[13px]" style={{ gap: '17px' }}>
<div className="h-[40px] w-[24px]">  // Use h-10 w-6 instead
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
- **Check Existing Components First**: Always check `components/common/` for existing components before creating new ones (see [Using Existing Generic Components](#using-existing-generic-components))
- **Use Variants Over Separate Components**: Prefer using a single component with variants (e.g., `Button` with `variant="primary"`) rather than creating separate components for each variant. This scales better and maintains consistency.
- **Available Components**: `Button` with variants from `@/components/common/Button`, `Link` from `@/components/common/Link`
- **Semantic Text Utilities**: `.text-default`, `.text-secondary`, `.text-invert`, `.text-success`, `.text-error`, `.text-warning`, `.text-info` (defined in `utilities.css`)
- **Other Utilities**: `.surface-default`, `.surface-secondary`, `.border-default`, `.elevation-sm`, etc.

**Example:**

```typescript
// ✅ Good - Using React components with variants
import { Button } from '@/components/common/Button'
import { Link } from '@/components/common/Link'

<Button variant="primary" className="w-full">
  Submit
</Button>
<Button variant="secondary">Cancel</Button>
<Link href="/products">View Products</Link>
<div className="elevation-md">

// ❌ Bad - Recreating styles manually
<div className="bg-white text-black">
```

### Class Merging

- **Use `cn` utility**: Always use the `cn` utility from `@/utils/cn` which combines `clsx` and `tailwind-merge` for intelligent class merging
- **Avoid `!important`**: Never use Tailwind's `!` modifier (e.g., `text-red-500!`) or CSS `!important`. Use `tailwind-merge` to resolve class conflicts intelligently
- **Intelligent Merging**: `tailwind-merge` automatically resolves conflicts between Tailwind classes (e.g., `p-4 p-6` becomes just `p-6`)
- Combine Tailwind classes with custom classes when needed

**Example:**

```typescript
import { cn } from '@/utils/cn'

// ✅ Good - tailwind-merge resolves conflicts automatically
<div className={cn('p-4 p-6', className, { 'opacity-50': disabled })}>
// Result: 'p-6' (conflict resolved, no !important needed)

// ❌ Bad - Using !important
<div className="p-4! p-6">  // Don't do this
```

### Component-Based Styling

- **Components Over CSS Classes**: Create React components for reusable UI elements (Button, DropdownMenu, Link) and put Tailwind classes directly in JSX
- **No @apply Directive**: Avoid using `@apply` to create custom CSS classes - this defeats the purpose of using Tailwind CSS
- **Component Location**: Place component classes in React components located in `components/common/` directory
- **Variants Over Separate Components**: Use a single component with variants (e.g., `Button` with `variant` prop) rather than creating separate components for each variant. This approach scales better and is easier to maintain.
- **Button Component**: Use `Button` with `variant="primary"`, `variant="secondary"`, `variant="tertiary"`, or `variant="outline"` from `@/components/common/Button` instead of CSS classes
- **Link Component**: Use `Link` from `@/components/common/Link` for styled links
- **Dropdown Components**: Use styled components from `@/components/common/DropdownMenu` which have styles applied directly in JSX

**Example:**

```typescript
// ✅ Good - Classes in React component JSX with variants
import { Button } from '@/components/common/Button'

<Button variant="primary" className="w-full mt-4">
  Submit
</Button>
<Button variant="secondary">Cancel</Button>

// ❌ Bad - Using @apply in CSS
// utilities.css
@layer components {
  .btn-primary {
    @apply bg-neutral-950 text-white px-5 py-2 rounded-md;
  }
}
```

### Custom Utilities (Limited Use)

- **Use `@utility` Directive**: In Tailwind v4, use the `@utility` directive to define custom utilities. This automatically inserts them into the utilities layer and works with all Tailwind variants (`hover:`, `lg:`, etc.)
- **Custom Utilities Only**: Use `@utility` sparingly for truly utility-like classes that work with Tailwind modifiers
- **Semantic Helpers**: Text color utilities (`.text-success`, `.text-error`), typography utilities (`.heading-h1`, `.text-body-m`), and other semantic utilities should be defined in `utilities.css` using `@utility` since they represent semantic meaning
- **Complex Utilities**: For utilities with nested selectors or media queries, use nesting within the `@utility` block

**Example:**

```css
/* utilities.css - Using @utility directive (Tailwind v4) */
@utility text-success {
  @apply text-feedback-success-500;
}

@utility heading-h1 {
  font-family: var(--font-sans);
  font-size: 3rem;
  line-height: 3.75rem;
  font-weight: 700;

  @media (width >= 375px) and (width <= 600px) {
    font-size: 2.5rem;
    line-height: 3rem;
  }
}

@utility elevation-sm {
  box-shadow: 0 1px 2px 0 var(--elevation-primary);
}
```

**Reference**: See [Tailwind v4 Custom Utilities Documentation](https://tailwindcss.com/docs/adding-custom-styles#adding-custom-utilities)

### Custom CSS

- Use CSS modules (`styles.modules.css`) only when absolutely necessary
- Prefer Tailwind utilities applied directly in JSX
- Avoid creating component classes with `@apply` - use React components instead
- **Custom Utilities**: Use `@utility` directive in `utilities.css` for semantic utility classes (typography, semantic colors, etc.)
- Custom utility classes should be minimal and only for semantic purposes

### Icon Usage

- **TSX Icons for Colorable Icons**: For icons that need to be colored dynamically (using `currentColor` or Tailwind color classes), use TSX icon components from `components/common/Icon/`
- **Icon Location**:
  - TSX icons: `components/common/Icon/` (e.g., `CheckIcon`, `ChevronIcon`, `DecrementIcon`, `IncrementIcon`)
- **Import Pattern**: Import TSX icons from `@/components/common/Icon`
- **Check Existing Icons First**: Before creating a new icon, check if it already exists in either location

**Example - TSX Icons (Colorable):**

```typescript
// ✅ Good - Using TSX icon component for colorable icons
import { CheckIcon, ChevronIcon } from '@/components/common/Icon'

<CheckIcon className="size-6 text-feedback-success-500" />
<ChevronIcon direction="down" className="size-6 text-primary-600" />

// ✅ Good - TSX icons use currentColor, so they inherit text color
<CheckIcon className="text-primary-600" />
```

**Available TSX Icons:**

TSX icon components available in `components/common/Icon/` include:

- `CheckIcon` - Checkmark icon (uses `currentColor`)
- `ChevronIcon` - Chevron icon with direction prop (uses `currentColor`)
- `DecrementIcon` - Left arrow icon (uses `currentColor`)
- `IncrementIcon` - Right arrow icon (uses `currentColor`)

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

// Internal (@/)
import { cn } from '@/utils/cn'

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

### Avoid Nested Ternary Operators

- **Use Helper Functions**: Extract complex conditional logic into helper functions instead of using nested ternary operators
- **Improved Readability**: Helper functions make the code more readable and easier to maintain
- **Location**: Place helper functions in the same file or a shared utility file (e.g., `components/common/Input/index.tsx` for input-related helpers)

**Example:**

```typescript
// ❌ Bad - Nested ternary operators
const displayState = disabled
  ? 'default'
  : isOpen
    ? 'open'
    : selectedOption
      ? 'filled'
      : state || 'default'

// ✅ Good - Using helper function
import { getInputDropdownDisplayState } from '@/components/common/Input'

const displayState = getInputDropdownDisplayState(
  disabled,
  isOpen,
  Boolean(selectedOption),
  state
)
```

**Helper Function Example:**

```typescript
// components/common/Input/index.tsx
import { InputDropdownState } from '@/types/enums/constants'

export const getInputDropdownDisplayState = (
  disabled: boolean | undefined,
  isOpen: boolean,
  hasSelectedOption: boolean,
  state?: InputDropdownState | null
): InputDropdownState => {
  if (disabled) {
    return InputDropdownState.Default
  }
  if (isOpen) {
    return InputDropdownState.Open
  }
  if (hasSelectedOption) {
    return InputDropdownState.Filled
  }
  return state || InputDropdownState.Default
}
```

### Avoid Anonymous Functions in JSX

- **Use Named Handler Functions**: Extract event handlers to named functions instead of using anonymous functions in JSX
- **Performance**: Named functions with `useCallback` avoid re-creating functions on every render
- **Readability**: Named functions make the code more readable and easier to test
- **Location**: Define handler functions within the component, using `useCallback` when the function depends on props or state

**Example:**

```typescript
// ❌ Bad - Anonymous function in JSX
<button onClick={() => !disabled && setIsOpen(!isOpen)}>
  Toggle
</button>

// ✅ Good - Named handler function
const handleToggle = useCallback(() => {
  if (!disabled) {
    setIsOpen(!isOpen)
  }
}, [disabled, isOpen])

<button onClick={handleToggle}>
  Toggle
</button>
```

**When to Use `useCallback`:**

- Use `useCallback` when the handler function depends on props or state
- Use `useCallback` when passing the handler as a prop to child components
- For simple handlers that don't depend on changing values, a regular function is acceptable

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
- ✅ **Checked for existing generic components** in `components/common/` before creating new ones
- ✅ Files are named after exported components
- ✅ No hardcoded text (use translations)
- ✅ No explicit hex colors (use design system tokens)
- ✅ Design system tokens used for colors, spacing, typography
- ✅ No unnecessary type assertions
- ✅ Tailwind variants used instead of extra classes
- ✅ **No `!important` usage** - use `cn` from `@/utils/cn` with tailwind-merge to resolve conflicts
- ✅ **No arbitrary values** - prefer Tailwind default utilities (e.g., `h-10` not `h-[40px]`)
- ✅ **Prefer Tailwind utilities over JavaScript** - use pseudo-classes (e.g., `:placeholder-shown`, `:hover`) instead of JS conditionals for styling
- ✅ **Use icons from icon pack** - always use icons from `public/icons/` instead of downloading from Figma or creating inline SVGs
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
