# Contentful Migration Script

This directory contains migration scripts for setting up Contentful content models.

## Prerequisites

1. Install Contentful CLI:
```bash
npm install -g contentful-cli
```

2. Authenticate with Contentful:
```bash
contentful login
```

3. Set up environment variables in `.env.local`:
```
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token
```

## Running the Migration

To create the Author and BlogPost content types, run:

```bash
contentful space migration --space-id YOUR_SPACE_ID scripts/contentful/migration.js
```

Replace `YOUR_SPACE_ID` with your actual Contentful space ID.

## Content Models

### Author
- **name** (Symbol, required): Author's full name
- **title** (Symbol, required): Author's professional title
- **profilePicture** (Asset): Author's profile photo

### BlogPost
- **title** (Symbol, required): Blog post title
- **subtitle** (Symbol): Blog post subtitle
- **slug** (Symbol, required, unique): URL-friendly identifier
- **author** (Link to Author): Reference to Author entry
- **content** (RichText): Main blog post content

## Creating Content

After running the migration:

1. Go to your Contentful space
2. Create Author entries first
3. Create BlogPost entries and link them to Authors
4. The blog posts will be available at `/blog/[slug]`
