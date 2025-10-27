# RS Blackmarket - Shopify E-commerce Case Study

A modern, full-featured e-commerce application built with Next.js 16, TypeScript, and Shopify's Storefront API. This project demonstrates best practices for building scalable e-commerce applications with internationalization, modern UI components, and comprehensive cart management.

## 🚀 Features

### Core E-commerce Functionality

- **Product Catalog**: Browse products with advanced filtering and search
- **Shopping Cart**: Full cart management with quantity updates and item removal
- **Product Details**: Detailed product pages with image galleries and descriptions
- **User Authentication**: Sign up and sign in functionality
- **Order Management**: View order history and track purchases
- **User Profile**: Manage user account information

### Technical Features

- **Internationalization (i18n)**: Support for English and Spanish languages
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **GraphQL Integration**: Shopify Storefront API with code generation
- **State Management**: React Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Modern UI**: Custom components with Radix UI primitives

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Custom Components
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Internationalization**: next-intl

### Backend Integration

- **E-commerce**: Shopify Storefront API
- **GraphQL**: GraphQL Code Generator
- **Authentication**: Shopify Customer API

### Development Tools

- **Linting**: ESLint with TypeScript support
- **Code Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged
- **Package Manager**: Yarn

## 📁 Project Structure

```
├── app/                          # Next.js App Router pages
│   └── [locale]/                 # Internationalized routes
│       ├── (shop)/               # Main shop pages
│       │   ├── cart/             # Shopping cart
│       │   ├── detail/[handle]/  # Product detail pages
│       │   ├── orders/           # Order history
│       │   ├── products/         # Product catalog
│       │   └── profile/          # User profile
│       └── auth/                 # Authentication pages
├── components/                   # Reusable UI components
│   ├── auth/                     # Authentication components
│   ├── cart/                     # Cart-related components
│   ├── common/                   # Shared components
│   ├── detail/                   # Product detail components
│   ├── home/                     # Homepage components
│   ├── orders/                   # Order management components
│   └── products/                 # Product listing components
├── hooks/                        # Custom React hooks
├── messages/                     # Internationalization files
├── shopify/                      # Shopify integration
│   ├── graphql/                  # GraphQL queries and mutations
│   └── generated/                # Auto-generated GraphQL types
├── types/                        # TypeScript type definitions
└── utils/                        # Utility functions and providers
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager
- Shopify store with Storefront API access

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Shopify Configuration
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_API_VERSION=latest_api_version (currently 2025-10)
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
NEXT_PUBLIC_LATEST_PRODUCTS_HANDLE=your_collection_handle
```

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd shopify-case-study
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Generate GraphQL types**

   ```bash
   yarn generate
   ```

4. **Start the development server**

   ```bash
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

- `yarn dev` - Start development server with GraphQL code generation
- `yarn build` - Build the application for production
- `yarn start` - Start the production server
- `yarn lint` - Run ESLint and fix issues
- `yarn lint:i18n` - Lint internationalization files
- `yarn generate` - Generate GraphQL types from schema
- `yarn prettier` - Format code with Prettier

## 🌍 Internationalization

The application supports multiple languages through next-intl:

- **English (en)** - Default language
- **Spanish (es)** - Secondary language

Language files are located in the `messages/` directory. To add a new language:

1. Add the locale to the `Locale` enum in `i18n.ts`
2. Create a new JSON file in `messages/` directory
3. Update the routing configuration

## 🎨 Styling

The project uses Tailwind CSS with a custom design system:

- **Custom Colors**: Brand-specific color palette
- **Typography**: DM Sans font family
- **Components**: Reusable component library
- **Responsive**: Mobile-first design approach

## 🔧 GraphQL Integration

The project uses GraphQL Code Generator to create type-safe GraphQL operations:

- **Queries**: Product fetching, cart operations, user data
- **Mutations**: Cart updates, user authentication, order creation
- **Types**: Auto-generated TypeScript types from Shopify schema

## 🧪 Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow ESLint configuration
- Use Prettier for code formatting
- Write descriptive commit messages

### Component Structure

- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow the established folder structure
- Use Tailwind CSS for styling

### Git Workflow

- Use feature branches for new development
- Run linting before committing (enforced by Husky)
- Write meaningful commit messages

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile**: Optimized for touch interactions
- **Tablet**: Enhanced layout for medium screens
- **Desktop**: Full-featured experience for large screens

## 🔐 Authentication

User authentication is handled through Shopify's Customer API:

- **Sign Up**: Create new customer accounts
- **Sign In**: Authenticate existing users
- **Session Management**: Secure token handling
- **Profile Management**: Update user information

## 🛒 Cart Management

Comprehensive shopping cart functionality:

- **Add/Remove Items**: Full cart manipulation
- **Quantity Updates**: Adjust item quantities
- **Persistent Cart**: Cart state maintained across sessions
- **Checkout Integration**: Ready for Shopify checkout

## 📦 Deployment

The application is ready for deployment on platforms like Vercel:

1. **Build the application**

   ```bash
   yarn build
   ```

2. **Deploy to your platform**
   - Configure environment variables
   - Set up domain and SSL
   - Configure Shopify webhooks if needed

## 🔗 Related Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [next-intl](https://next-intl-docs.vercel.app/)
