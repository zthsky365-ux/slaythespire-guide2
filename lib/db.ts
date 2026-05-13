import { promises as fs } from "fs";
import path from "path";
import { Article, Category, Tag, User, AdPlacement, PageView } from "./types";
import { generateId } from "./utils";

const DATA_DIR = path.join(process.cwd(), "data");
const ARTICLES_FILE = path.join(DATA_DIR, "articles.json");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");
const TAGS_FILE = path.join(DATA_DIR, "tags.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const ADS_FILE = path.join(DATA_DIR, "ads.json");
const VIEWS_FILE = path.join(DATA_DIR, "views.json");

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Articles
export async function getArticles(): Promise<Article[]> {
  return readJsonFile<Article[]>(ARTICLES_FILE, []);
}

export async function getArticleById(id: string): Promise<Article | null> {
  const articles = await getArticles();
  return articles.find((a) => a.id === id) || null;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug) || null;
}

export async function getPublishedArticles(): Promise<Article[]> {
  const articles = await getArticles();
  return articles
    .filter((a) => a.status === "published")
    .sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt) : new Date(a.createdAt);
      const dateB = b.publishedAt ? new Date(b.publishedAt) : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
}

export async function createArticle(data: Omit<Article, "id" | "createdAt" | "updatedAt" | "viewCount">): Promise<Article> {
  const articles = await getArticles();
  const now = new Date().toISOString();
  const newArticle: Article = {
    ...data,
    id: generateId(),
    viewCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  articles.push(newArticle);
  await writeJsonFile(ARTICLES_FILE, articles);
  return newArticle;
}

export async function updateArticle(id: string, data: Partial<Article>): Promise<Article | null> {
  const articles = await getArticles();
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) return null;
  
  articles[index] = {
    ...articles[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  await writeJsonFile(ARTICLES_FILE, articles);
  return articles[index];
}

export async function deleteArticle(id: string): Promise<boolean> {
  const articles = await getArticles();
  const filtered = articles.filter((a) => a.id !== id);
  if (filtered.length === articles.length) return false;
  await writeJsonFile(ARTICLES_FILE, filtered);
  return true;
}

export async function incrementViewCount(id: string): Promise<void> {
  const articles = await getArticles();
  const index = articles.findIndex((a) => a.id === id);
  if (index !== -1) {
    articles[index].viewCount += 1;
    await writeJsonFile(ARTICLES_FILE, articles);
  }
}

// Categories
export async function getCategories(): Promise<Category[]> {
  return readJsonFile<Category[]>(CATEGORIES_FILE, []);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) || null;
}

export async function createCategory(data: Omit<Category, "id">): Promise<Category> {
  const categories = await getCategories();
  const newCategory: Category = {
    ...data,
    id: generateId(),
  };
  categories.push(newCategory);
  await writeJsonFile(CATEGORIES_FILE, categories);
  return newCategory;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category | null> {
  const categories = await getCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return null;
  categories[index] = { ...categories[index], ...data };
  await writeJsonFile(CATEGORIES_FILE, categories);
  return categories[index];
}

export async function deleteCategory(id: string): Promise<boolean> {
  const categories = await getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length === categories.length) return false;
  await writeJsonFile(CATEGORIES_FILE, filtered);
  return true;
}

// Tags
export async function getTags(): Promise<Tag[]> {
  return readJsonFile<Tag[]>(TAGS_FILE, []);
}

export async function createTag(data: Omit<Tag, "id">): Promise<Tag> {
  const tags = await getTags();
  const newTag: Tag = { ...data, id: generateId() };
  tags.push(newTag);
  await writeJsonFile(TAGS_FILE, tags);
  return newTag;
}

export async function deleteTag(id: string): Promise<boolean> {
  const tags = await getTags();
  const filtered = tags.filter((t) => t.id !== id);
  if (filtered.length === tags.length) return false;
  await writeJsonFile(TAGS_FILE, filtered);
  return true;
}

// Users
export async function getUsers(): Promise<User[]> {
  return readJsonFile<User[]>(USERS_FILE, []);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.email === email) || null;
}

export async function createUser(data: Omit<User, "id" | "createdAt">): Promise<User> {
  const users = await getUsers();
  const newUser: User = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  await writeJsonFile(USERS_FILE, users);
  return newUser;
}

export async function verifyUser(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email);
  if (!user || user.password !== password) return null;
  return user;
}

// Ad Placements
export async function getAdPlacements(): Promise<AdPlacement[]> {
  return readJsonFile<AdPlacement[]>(ADS_FILE, []);
}

export async function getEnabledAds(): Promise<AdPlacement[]> {
  const ads = await getAdPlacements();
  return ads.filter((ad) => ad.enabled);
}

export async function createAdPlacement(data: Omit<AdPlacement, "id" | "createdAt" | "updatedAt">): Promise<AdPlacement> {
  const ads = await getAdPlacements();
  const now = new Date().toISOString();
  const newAd: AdPlacement = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  ads.push(newAd);
  await writeJsonFile(ADS_FILE, ads);
  return newAd;
}

export async function updateAdPlacement(id: string, data: Partial<AdPlacement>): Promise<AdPlacement | null> {
  const ads = await getAdPlacements();
  const index = ads.findIndex((a) => a.id === id);
  if (index === -1) return null;
  ads[index] = { ...ads[index], ...data, updatedAt: new Date().toISOString() };
  await writeJsonFile(ADS_FILE, ads);
  return ads[index];
}

export async function deleteAdPlacement(id: string): Promise<boolean> {
  const ads = await getAdPlacements();
  const filtered = ads.filter((a) => a.id !== id);
  if (filtered.length === ads.length) return false;
  await writeJsonFile(ADS_FILE, filtered);
  return true;
}

// Page Views
export async function recordPageView(data: Omit<PageView, "id">): Promise<void> {
  const views = await readJsonFile<PageView[]>(VIEWS_FILE, []);
  views.push({ ...data, id: generateId() });
  await writeJsonFile(VIEWS_FILE, views);
}

export async function getPageViews(): Promise<PageView[]> {
  return readJsonFile<PageView[]>(VIEWS_FILE, []);
}

// Stats
export async function getSiteStats(): Promise<{
  totalViews: number;
  totalArticles: number;
  totalCategories: number;
  popularArticles: { id: string; title: string; views: number }[];
  recentViews: { date: string; views: number }[];
}> {
  const articles = await getArticles();
  const categories = await getCategories();
  const views = await getPageViews();
  
  const publishedArticles = articles.filter((a) => a.status === "published");
  const popularArticles = [...publishedArticles]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5)
    .map((a) => ({ id: a.id, title: a.title, views: a.viewCount }));
  
  // Calculate recent views (last 7 days)
  const today = new Date();
  const recentViews: { date: string; views: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayViews = views.filter((v) => v.visitedAt.startsWith(dateStr)).length;
    recentViews.push({ date: dateStr, views: dayViews });
  }
  
  return {
    totalViews: views.length,
    totalArticles: publishedArticles.length,
    totalCategories: categories.length,
    popularArticles,
    recentViews,
  };
}

// Initialize with default data
export async function initializeDefaultData(): Promise<void> {
  await ensureDataDir();
  
  // Default categories
  const categories = await getCategories();
  if (categories.length === 0) {
    await writeJsonFile(CATEGORIES_FILE, [
      { id: "cat-1", name: "Card Guides", slug: "card-guides", description: "Detailed guides for all cards", icon: "layers", color: "#8B5CF6" },
      { id: "cat-2", name: "Character Builds", slug: "character-builds", description: "Character strategies and builds", icon: "user", color: "#F59E0B" },
      { id: "cat-3", name: "Boss Strategies", slug: "boss-strategies", description: "How to defeat bosses", icon: "shield", color: "#EF4444" },
      { id: "cat-4", name: "Combos & Synergies", slug: "combos", description: "Card combinations and synergies", icon: "zap", color: "#10B981" },
      { id: "cat-5", name: "Tips & Tricks", slug: "tips", description: "General tips and tricks", icon: "lightbulb", color: "#3B82F6" },
    ]);
  }
  
  // Default admin user
  const users = await getUsers();
  if (users.length === 0) {
    await writeJsonFile(USERS_FILE, [
      { id: "user-1", email: "admin@example.com", password: "admin123", name: "Admin", role: "admin", createdAt: new Date().toISOString() },
    ]);
  }
  
  // Default ad placements
  const ads = await getAdPlacements();
  if (ads.length === 0) {
    const now = new Date().toISOString();
    await writeJsonFile(ADS_FILE, [
      { id: "ad-1", name: "Header Banner", position: "header", size: "728x90", enabled: true, code: "", createdAt: now, updatedAt: now },
      { id: "ad-2", name: "Sidebar Ad", position: "sidebar", size: "300x250", enabled: true, code: "", createdAt: now, updatedAt: now },
      { id: "ad-3", name: "In-Content Ad", position: "content", size: "300x250", enabled: true, code: "", createdAt: now, updatedAt: now },
      { id: "ad-4", name: "Footer Banner", position: "footer", size: "728x90", enabled: true, code: "", createdAt: now, updatedAt: now },
    ]);
  }
  
  // Sample articles
  const articles = await getArticles();
  if (articles.length === 0) {
    const sampleArticles: Article[] = [
      {
        id: "art-1",
        title: "Ironclad Complete Guide: Best Cards and Synergies",
        slug: "ironclad-complete-guide",
        content: `# Ironclad Complete Guide

The Ironclad is the first playable character in Slay the Spire 2. This guide covers everything you need to know about mastering this powerful warrior.

## Getting Started

The Ironclad starts with a focus on Strength and Block mechanics. Understanding these two systems is crucial for success.

## Best Starting Cards

- **Bash** - Essential for applying Vulnerable
- **Strike** - Your basic attack
- **Defend** - Basic block card
- **Cleave** - AoE damage for hallway fights

## Recommended Early Picks

1. Inflame - Strong开局
2. Shrug It Off - Good block
3. Pommel Strike - Card draw
4. Iron Wave - Hybrid offense/defense

## Strength Build Guide

A Strength build focuses on maximizing damage through Strength stacking. Key cards include:

- **Demon Form** - Core engine
- **Spot Weakness** - Free strength
- **Inflame** - Weakness synergy
- **Bloodletting** - Energy generation

## Block Build Guide

For a more defensive approach:

- **Feel No Pain** - Thorns synergy
- **Metallicize** - Passive block
- **Shockwave** - Mass weak/vulnerable
- **Entrench** - Double your block

## Tips for Success

1. Don't neglect card draw
2. Balance offense and defense
3. Save potions for bosses
4. Know when to skip
5. Position matters in multi-enemy fights`,
        excerpt: "Master the Ironclad with our comprehensive guide covering best cards, synergies, and winning strategies.",
        coverImage: "ironclad.jpg",
        categoryId: "cat-2",
        authorId: "user-1",
        status: "published",
        viewCount: 1542,
        tags: ["Ironclad", "Builds", "Beginner"],
        createdAt: "2026-01-15T10:00:00Z",
        updatedAt: "2026-01-15T10:00:00Z",
        publishedAt: "2026-01-15T10:00:00Z",
      },
      {
        id: "art-2",
        title: "Silent Decks: Poison and Shiv Strategies",
        slug: "silent-decks-guide",
        content: `# Silent Decks: Poison and Shiv Strategies

The Silent excels at poison mechanics and quick, precise attacks. This guide explores both main archetypes.

## Understanding Poison

Poison is a powerful status effect that deals damage at the end of each turn. Stacking poison can eliminate even the toughest enemies.

## Poison Deck Core Cards

- **Cilent's Poison** - Free poison
- **Catalyst** - Multiplies poison
- **Bouncing Flask** - AoE poison
- **Deadly Poison** - Stacking poison

## Shiv Strategy

Shivs excel at triggering effects that activate on card play.

## Key Shiv Cards

- **Blade Dance** - Generate shivs
- **Accuracy** - Shiv power
- **Terror** - Instant kill potential
- **Noxious Fumes** - Passive poison`,
        excerpt: "Explore poison and shiv strategies for the Silent character in Slay the Spire 2.",
        coverImage: "silent.jpg",
        categoryId: "cat-2",
        authorId: "user-1",
        status: "published",
        viewCount: 892,
        tags: ["Silent", "Poison", "Shivs"],
        createdAt: "2026-01-20T14:30:00Z",
        updatedAt: "2026-01-20T14:30:00Z",
        publishedAt: "2026-01-20T14:30:00Z",
      },
      {
        id: "art-3",
        title: "How to Beat the Act 3 Boss: The Collector",
        slug: "beat-the-collector",
        content: `# How to Beat the Collector

The Collector is one of the most challenging bosses in Act 3. This guide will help you prepare.

## Boss Overview

The Collector has three phases and summons minions. Here's what to expect:

- Phase 1: Moderate damage, healing
- Phase 2: Summons enemies
- Phase 3: Heavy damage burst

## Recommended Preparations

Before the fight, ensure you have:
- Artifact potions
- Strong frontloaded damage
- Sustained damage capability
- Good block options

## Key Cards for This Fight

1. **Glass Knife** - Burst damage
2. **Shatter** - Destroy his shields
3. **Blizzard** - Passive AoE
4. **Storm** - Power card

## Strategy Tips

The key to this fight is speed. Don't let the Collector heal or summon too many minions. Focus fire on priority targets.`,
        excerpt: "Complete strategy guide for defeating The Collector boss in Act 3.",
        coverImage: "collector.jpg",
        categoryId: "cat-3",
        authorId: "user-1",
        status: "published",
        viewCount: 2103,
        tags: ["Boss", "Act 3", "Strategy"],
        createdAt: "2026-02-01T09:00:00Z",
        updatedAt: "2026-02-01T09:00:00Z",
        publishedAt: "2026-02-01T09:00:00Z",
      },
      {
        id: "art-4",
        title: "Defect Power Cards: Ultimate Guide",
        slug: "defect-power-cards",
        content: `# Defect Power Cards Guide

The Defect revolves around orb management and power cards. This guide covers all essential power cards.

## Core Powers

**Darkness** - Your primary damage source
**Lightning** - Frontloaded damage
**Frost** - Defense through orbs
**Plasma** - Energy generation

## Essential Power Cards

1. **Dualcast** - Evoke twice
2. **Multicast** - Evoke multiple
3. **Recycle** - Card draw
4. **Cold Snap** - Frost generation

## Energy Management

Learn to maximize your orb slots and energy efficiency.`,
        excerpt: "Master the Defect's power cards with this comprehensive guide.",
        coverImage: "defect.jpg",
        categoryId: "cat-1",
        authorId: "user-1",
        status: "published",
        viewCount: 756,
        tags: ["Defect", "Cards", "Powers"],
        createdAt: "2026-02-10T11:00:00Z",
        updatedAt: "2026-02-10T11:00:00Z",
        publishedAt: "2026-02-10T11:00:00Z",
      },
      {
        id: "art-5",
        title: "Top 10 Tips for New Players",
        slug: "top-10-tips-new-players",
        content: `# Top 10 Tips for New Players

Starting out in Slay the Spire 2? Here are the essential tips you need to know.

## 1. Don't Always Take Damage

Sometimes taking damage is unavoidable, but often you can play smarter to minimize it.

## 2. Card Rarity Isn't Everything

Common cards can be incredibly powerful. Don't dismiss them.

## 3. Skip When Unsure

If you don't need a card, skip. A smaller deck is often better.

## 4. Save Potions for Emergencies

Potions can be life-saving. Don't waste them on easy fights.

## 5. Learn Enemy Intentions

Understanding enemy patterns is key to victory.

## 6. Balance Offense and Defense

You need both damage and block to succeed.

## 7. Know Your Character

Each character has unique strengths. Play to them.

## 8. Don't Fear the Neow Bonus

Early game bonuses can set you up for success.

## 9. Practice Makes Perfect

Every run teaches you something new.

## 10. Have Fun!

There's no single "right" way to play.`,
        excerpt: "Essential tips for new players starting their Slay the Spire 2 journey.",
        coverImage: "tips.jpg",
        categoryId: "cat-5",
        authorId: "user-1",
        status: "published",
        viewCount: 3201,
        tags: ["Beginner", "Tips", "General"],
        createdAt: "2026-02-15T16:00:00Z",
        updatedAt: "2026-02-15T16:00:00Z",
        publishedAt: "2026-02-15T16:00:00Z",
      },
      {
        id: "art-6",
        title: "Card Synergy Combinations Guide",
        slug: "card-synergy-combinations",
        content: `# Card Synergy Combinations Guide

Understanding card synergies is crucial for building powerful decks. Here are the best combinations.

## Ironclad Synergies

**Strength + Vulnerable** - Devastating damage
**Block + Thorns** - Offensive defense
**Bleed + Drawing** - Sustained damage

## Silent Synergies

**Poison + Catalyst** - Explosive damage
**Shiv + Dexterity** - Quick damage
**Weak + Low Cost** - Efficient fights

## Defect Synergies

**Orb Generation + Evoke** - Consistent damage
**Frost + Focus** - Massive block
**Darkness + Evil** - Lategame power

## Universal Synergies

- Card draw + Energy management
- Artifact + Status prevention
- Weak + Damage cards`,
        excerpt: "Discover the best card synergies and combinations for dominant gameplay.",
        coverImage: "synergy.jpg",
        categoryId: "cat-4",
        authorId: "user-1",
        status: "published",
        viewCount: 1876,
        tags: ["Synergy", "Combos", "Advanced"],
        createdAt: "2026-02-20T13:00:00Z",
        updatedAt: "2026-02-20T13:00:00Z",
        publishedAt: "2026-02-20T13:00:00Z",
      },
    ];
    await writeJsonFile(ARTICLES_FILE, sampleArticles);
  }
}
