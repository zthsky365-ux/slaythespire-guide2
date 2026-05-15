import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_5Mv9ATlzSxQP@ep-calm-scene-aqizdx4s.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require',
});

async function setup() {
  try {
    await client.connect();
    console.log('Connected to Neon PostgreSQL');

    // Create tables
    await client.query(`
      -- Categories table
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT DEFAULT '',
        icon TEXT DEFAULT '',
        color TEXT DEFAULT '#6366f1'
      );

      -- Tags table
      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        color TEXT DEFAULT '#6366f1',
        article_count INTEGER DEFAULT 0
      );

      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- Articles table
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT DEFAULT '',
        cover_image TEXT,
        category_id TEXT REFERENCES categories(id),
        author_id TEXT REFERENCES users(id),
        status TEXT DEFAULT 'draft',
        view_count INTEGER DEFAULT 0,
        featured BOOLEAN DEFAULT FALSE,
        tags TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        published_at TIMESTAMP
      );

      -- Ads table
      CREATE TABLE IF NOT EXISTS ads (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        position TEXT DEFAULT 'sidebar',
        size TEXT DEFAULT '300x250',
        enabled BOOLEAN DEFAULT TRUE,
        code TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Page views table
      CREATE TABLE IF NOT EXISTS page_views (
        id TEXT PRIMARY KEY,
        article_id TEXT,
        path TEXT NOT NULL,
        visited_at TIMESTAMP DEFAULT NOW(),
        user_agent TEXT DEFAULT '',
        referrer TEXT DEFAULT ''
      );

      -- Insert default categories
      INSERT INTO categories (id, name, slug, description, icon, color) VALUES
        ('cat-1', 'Defect', 'defect', 'Defect character guides and strategies', 'cpu', '#8b5cf6'),
        ('cat-2', 'Character Builds', 'character-builds', 'Character-specific builds and guides', 'user', '#f59e0b'),
        ('cat-3', 'Bosses', 'bosses', 'Boss fight strategies', 'skull', '#ef4444'),
        ('cat-4', 'Combos', 'combos', 'Card combos and synergies', 'zap', '#22c55e'),
        ('cat-5', 'General', 'general', 'General tips and guides', 'book', '#3b82f6')
      ON CONFLICT (id) DO NOTHING;

      -- Insert default tags
      INSERT INTO tags (id, name, slug, color) VALUES
        ('tag-1', 'Ironclad', 'ironclad', '#ef4444'),
        ('tag-2', 'Silent', 'silent', '#22c55e'),
        ('tag-3', 'Defect', 'defect', '#8b5cf6'),
        ('tag-4', 'Beginner', 'beginner', '#3b82f6'),
        ('tag-5', 'Advanced', 'advanced', '#f59e0b')
      ON CONFLICT (id) DO NOTHING;

      -- Insert default admin user
      INSERT INTO users (id, email, password, name, role) VALUES
        ('user-1', 'zthsky365@gmail.com', 'wwy_20130202', 'Admin', 'admin')
      ON CONFLICT (id) DO NOTHING;

      -- Insert sample articles
      INSERT INTO articles (id, title, slug, content, excerpt, cover_image, category_id, author_id, status, view_count, tags, published_at) VALUES
        ('art-1', 'Ironclad Complete Guide: Best Cards and Synergies', 'ironclad-complete-guide', 
         '# Ironclad Complete Guide\n\nThe Ironclad is the first playable character in Slay the Spire 2. This guide covers everything you need to know about mastering this powerful warrior.\n\n## Getting Started\n\nThe Ironclad starts with a focus on Strength and Block mechanics. Understanding these two systems is crucial for success.\n\n## Best Starting Cards\n\n- **Bash** - Essential for applying Vulnerable\n- **Strike** - Your basic attack\n- **Defend** - Basic block card\n- **Cleave** - AoE damage for hallway fights', 
         'Master the Ironclad with our comprehensive guide covering best cards, synergies, and winning strategies.', 
         'ironclad.jpg', 'cat-2', 'user-1', 'published', 1549, ARRAY['Ironclad', 'Builds', 'Beginner'], NOW()),

        ('art-2', 'Silent Decks: Poison and Shiv Strategies', 'silent-decks-guide',
         '# Silent Decks: Poison and Shiv Strategies\n\nThe Silent excels at poison mechanics and quick, precise attacks. This guide explores both main archetypes.\n\n## Understanding Poison\n\nPoison is a powerful status effect that deals damage at the end of each turn.',
         'Explore poison and shiv strategies for the Silent character in Slay the Spire 2.',
         'silent.jpg', 'cat-2', 'user-1', 'published', 894, ARRAY['Silent', 'Poison', 'Shivs'], NOW()),

        ('art-3', 'How to Beat the Act 3 Boss: The Collector', 'beat-the-collector',
         '# How to Beat the Collector\n\nThe Collector is one of the most challenging bosses in Act 3.',
         'Complete strategy guide for defeating The Collector boss in Act 3.',
         'collector.jpg', 'cat-3', 'user-1', 'published', 2105, ARRAY['Boss', 'Act 3', 'Strategy'], NOW()),

        ('art-4', 'Defect Power Cards: Ultimate Guide', 'defect-power-cards',
         '# Defect Power Cards Guide\n\nThe Defect revolves around orb management and power cards.',
         'Master the Defect power cards with this comprehensive guide.',
         'defect.jpg', 'cat-1', 'user-1', 'published', 758, ARRAY['Defect', 'Cards', 'Powers'], NOW()),

        ('art-5', 'Top 10 Tips for New Players', 'top-10-tips-new-players',
         '# Top 10 Tips for New Players\n\nStarting out in Slay the Spire 2? Here are the essential tips you need to know.',
         'Essential tips for new players starting their Slay the Spire 2 journey.',
         'tips.jpg', 'cat-5', 'user-1', 'published', 3210, ARRAY['Beginner', 'Tips', 'General'], NOW()),

        ('art-6', 'Card Synergy Combinations Guide', 'card-synergy-combinations',
         '# Card Synergy Combinations Guide\n\nUnderstanding card synergies is crucial for building powerful decks.',
         'Discover the best card synergies and combinations for dominant gameplay.',
         'synergy.jpg', 'cat-4', 'user-1', 'published', 1880, ARRAY['Synergy', 'Combos', 'Advanced'], NOW())
      ON CONFLICT (id) DO NOTHING;

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
      CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
      CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
      CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at);
      CREATE INDEX IF NOT EXISTS idx_page_views_article ON page_views(article_id);
    `);

    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await client.end();
  }
}

setup();
