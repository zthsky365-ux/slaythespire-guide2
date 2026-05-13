# Slay Guide - Slay the Spire 2 Game Guide Website

A modern, responsive game guide website built with Next.js 14, featuring content management, Google AdSense integration, and analytics dashboard.

## Features

- **Content Management System**: Full CRUD operations for articles, categories, and tags
- **Google AdSense Ready**: Configurable ad placements throughout the site
- **Analytics Dashboard**: Track page views, popular content, and site performance
- **Responsive Design**: Mobile-first, dark theme optimized for gaming content
- **SEO Optimized**: Meta tags, Open Graph, and sitemap support
- **Markdown Support**: Write articles in Markdown with live preview

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Content**: JSON file-based storage (easily portable to any database)
- **Icons**: Lucide React
- **Markdown**: react-markdown with remark-gfm

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Deployment to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_GITHUB_REPO_URL)

### Option 2: Manual Deploy

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/slaythespire-guide.git
git push -u origin main
```

2. Go to [Vercel](https://vercel.com) and sign in

3. Click "New Project" and import your GitHub repository

4. Vercel will automatically detect Next.js and configure the build

5. Click "Deploy"

## Google AdSense Setup

1. Create a Google AdSense account at https://www.google.com/adsense

2. Get your AdSense code (looks like `<script async src="https://pagead2.googlesyndication.com/...`)

3. Go to `/admin/ads` in your deployed site

4. For each ad placement, paste your AdSense code in the "Google AdSense Code" field

5. Enable the placements you want to display

## Admin Panel

Access the admin panel at `/admin`:

- **Dashboard**: Overview of site statistics
- **Articles**: Create, edit, and manage articles
- **Categories**: Organize content into categories
- **Ads**: Manage Google AdSense placements
- **Statistics**: Detailed analytics

### Default Admin Login

- Email: `admin@example.com`
- Password: `admin123`

**Important**: Change these credentials after deployment!

## Project Structure

```
├── app/
│   ├── page.tsx                 # Homepage
│   ├── layout.tsx               # Root layout
│   ├── articles/[slug]/        # Article detail pages
│   ├── category/[slug]/        # Category pages
│   ├── search/                  # Search page
│   ├── admin/                   # Admin panel
│   │   ├── page.tsx            # Dashboard
│   │   ├── articles/          # Article management
│   │   ├── categories/       # Category management
│   │   ├── ads/               # Ad management
│   │   └── stats/             # Statistics
│   └── api/                    # API routes
│       ├── articles/          # Article CRUD
│       ├── categories/       # Category CRUD
│       ├── ads/              # Ad CRUD
│       └── stats/            # Statistics
├── components/
│   ├── ui/                     # UI components
│   ├── layout/                 # Layout components
│   ├── articles/              # Article components
│   ├── ads/                   # Ad components
│   └── admin/                # Admin components
├── lib/
│   ├── db.ts                 # Database operations
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Utility functions
└── data/                      # JSON data files (auto-created)
```

## Customization

### Changing Colors

Edit `app/globals.css` and modify the CSS variables:

```css
@theme {
  --color-primary: hsl(262, 83%, 66%);  /* Main purple */
  --color-accent: hsl(38, 92%, 50%);    /* Gold accent */
  --color-background: hsl(240, 20%, 5%); /* Dark background */
}
```

### Adding New Categories

1. Go to `/admin/categories`
2. Click "New Category"
3. Fill in name, description, choose icon and color

### Writing Articles

1. Go to `/admin/articles`
2. Click "New Article"
3. Fill in:
   - Title
   - Content (Markdown supported)
   - Excerpt (brief description)
   - Category
   - Tags (comma-separated)
   - Status (draft/published)
   - Cover image URL

## License

MIT License - feel free to use for personal or commercial projects.
