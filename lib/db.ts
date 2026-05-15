import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_5Mv9ATlzSxQP@ep-calm-scene-aqizdx4s.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false },
});

// For serverless functions, always close the pool after queries
async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}

async function queryOne<T>(text: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}

// Article type mapping (DB -> API)
interface DbArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string | null;
  category_id: string;
  author_id: string;
  status: 'draft' | 'published' | 'archived';
  view_count: number;
  featured: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

function mapArticle(row: DbArticle) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    excerpt: row.excerpt,
    coverImage: row.cover_image,
    categoryId: row.category_id,
    authorId: row.author_id,
    status: row.status,
    viewCount: row.view_count,
    featured: row.featured,
    tags: row.tags || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
  };
}

// Categories
export async function getCategories() {
  const rows = await query<{ id: string; name: string; slug: string; description: string; icon: string; color: string }>(
    'SELECT * FROM categories ORDER BY name'
  );
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    icon: r.icon,
    color: r.color,
  }));
}

export async function getCategoryById(id: string) {
  return queryOne<{ id: string; name: string; slug: string; description: string; icon: string; color: string }>(
    'SELECT * FROM categories WHERE id = $1', [id]
  );
}

export async function getCategoryBySlug(slug: string) {
  return queryOne<{ id: string; name: string; slug: string; description: string; icon: string; color: string }>(
    'SELECT * FROM categories WHERE slug = $1', [slug]
  );
}

export async function createCategory(data: { name: string; slug: string; description?: string; icon?: string; color?: string }) {
  const id = `cat-${Date.now()}`;
  await query(
    'INSERT INTO categories (id, name, slug, description, icon, color) VALUES ($1, $2, $3, $4, $5, $6)',
    [id, data.name, data.slug, data.description || '', data.icon || '', data.color || '#6366f1']
  );
  return getCategoryById(id);
}

export async function updateCategory(id: string, data: Partial<{ name: string; slug: string; description: string; icon: string; color: string }>) {
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  if (data.name) { fields.push(`name = $${i++}`); values.push(data.name); }
  if (data.slug) { fields.push(`slug = $${i++}`); values.push(data.slug); }
  if (data.description !== undefined) { fields.push(`description = $${i++}`); values.push(data.description); }
  if (data.icon !== undefined) { fields.push(`icon = $${i++}`); values.push(data.icon); }
  if (data.color !== undefined) { fields.push(`color = $${i++}`); values.push(data.color); }
  
  if (fields.length > 0) {
    values.push(id);
    await query(`UPDATE categories SET ${fields.join(', ')} WHERE id = $${i}`, values);
  }
  return getCategoryById(id);
}

export async function deleteCategory(id: string) {
  await query('DELETE FROM categories WHERE id = $1', [id]);
}

// Tags
export async function getTags() {
  return query<{ id: string; name: string; slug: string; color: string; article_count: number }>(
    'SELECT * FROM tags ORDER BY name'
  );
}

export async function createTag(data: { name: string; slug: string; color?: string }) {
  const id = `tag-${Date.now()}`;
  await query(
    'INSERT INTO tags (id, name, slug, color) VALUES ($1, $2, $3, $4)',
    [id, data.name, data.slug, data.color || '#6366f1']
  );
  return queryOne<{ id: string; name: string; slug: string; color: string }>('SELECT * FROM tags WHERE id = $1', [id]);
}

export async function deleteTag(id: string) {
  await query('DELETE FROM tags WHERE id = $1', [id]);
}

// Articles
export async function getArticles() {
  const rows = await query<DbArticle>('SELECT * FROM articles ORDER BY created_at DESC');
  return rows.map(mapArticle);
}

export async function getArticleById(id: string) {
  const row = await queryOne<DbArticle>('SELECT * FROM articles WHERE id = $1', [id]);
  return row ? mapArticle(row) : null;
}

export async function getArticleBySlug(slug: string) {
  const row = await queryOne<DbArticle>('SELECT * FROM articles WHERE slug = $1', [slug]);
  return row ? mapArticle(row) : null;
}

export async function getPublishedArticles() {
  const rows = await query<DbArticle>(
    "SELECT * FROM articles WHERE status = 'published' ORDER BY COALESCE(published_at, created_at) DESC"
  );
  return rows.map(mapArticle);
}

export async function createArticle(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  categoryId: string;
  authorId?: string;
  coverImage?: string | null;
  tags?: string[];
  status?: string;
  publishedAt?: string | null;
}) {
  const id = `art-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  await query(
    `INSERT INTO articles (id, title, slug, content, excerpt, cover_image, category_id, author_id, status, tags, published_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
      id,
      data.title,
      data.slug,
      data.content,
      data.excerpt || '',
      data.coverImage || null,
      data.categoryId,
      data.authorId || 'user-1',
      data.status || 'draft',
      data.tags || [],
      data.publishedAt || null,
    ]
  );
  return getArticleById(id);
}

export async function updateArticle(id: string, data: Partial<{
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  categoryId: string;
  coverImage: string | null;
  tags: string[];
  status: string;
  featured: boolean;
  publishedAt: string | null;
}>) {
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  if (data.title !== undefined) { fields.push(`title = $${i++}`); values.push(data.title); }
  if (data.slug !== undefined) { fields.push(`slug = $${i++}`); values.push(data.slug); }
  if (data.content !== undefined) { fields.push(`content = $${i++}`); values.push(data.content); }
  if (data.excerpt !== undefined) { fields.push(`excerpt = $${i++}`); values.push(data.excerpt); }
  if (data.categoryId !== undefined) { fields.push(`category_id = $${i++}`); values.push(data.categoryId); }
  if (data.coverImage !== undefined) { fields.push(`cover_image = $${i++}`); values.push(data.coverImage); }
  if (data.tags !== undefined) { fields.push(`tags = $${i++}`); values.push(data.tags); }
  if (data.status !== undefined) { fields.push(`status = $${i++}`); values.push(data.status); }
  if (data.featured !== undefined) { fields.push(`featured = $${i++}`); values.push(data.featured); }
  if (data.publishedAt !== undefined) { fields.push(`published_at = $${i++}`); values.push(data.publishedAt); }
  
  fields.push(`updated_at = $${i++}`);
  values.push(new Date().toISOString());
  
  if (fields.length > 1) {
    values.push(id);
    await query(`UPDATE articles SET ${fields.join(', ')} WHERE id = $${i}`, values);
  }
  return getArticleById(id);
}

export async function deleteArticle(id: string) {
  await query('DELETE FROM articles WHERE id = $1', [id]);
}

export async function incrementViewCount(articleId: string) {
  await query('UPDATE articles SET view_count = view_count + 1 WHERE id = $1', [articleId]);
}

// Users
export async function getUsers() {
  return query<{ id: string; email: string; name: string; role: string; created_at: string }>(
    'SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC'
  );
}

export async function getUserById(id: string) {
  return queryOne<{ id: string; email: string; name: string; role: string; created_at: string }>(
    'SELECT id, email, name, role, created_at FROM users WHERE id = $1', [id]
  );
}

export async function getUserByEmail(email: string) {
  return queryOne<{ id: string; email: string; password: string; name: string; role: string; created_at: string }>(
    'SELECT * FROM users WHERE email = $1', [email]
  );
}

// Stats
export async function getSiteStats() {
  const totalViews = await queryOne<{ count: string }>('SELECT SUM(view_count) as count FROM articles');
  const totalArticles = await queryOne<{ count: string }>("SELECT COUNT(*) as count FROM articles WHERE status = 'published'");
  const totalCategories = await queryOne<{ count: string }>('SELECT COUNT(*) as count FROM categories');
  const popularArticles = await query<{ id: string; title: string; view_count: number }>(
    'SELECT id, title, view_count FROM articles WHERE status = $1 ORDER BY view_count DESC LIMIT 5',
    ['published']
  );

  return {
    totalViews: parseInt(totalViews?.count || '0'),
    totalArticles: parseInt(totalArticles?.count || '0'),
    totalCategories: parseInt(totalCategories?.count || '0'),
    popularArticles: popularArticles.map(a => ({ id: a.id, title: a.title, views: a.view_count })),
  };
}

// Ads
export async function getAds() {
  return query<{ id: string; name: string; position: string; size: string; enabled: boolean; code: string }>(
    'SELECT * FROM ads ORDER BY name'
  );
}

export async function updateAd(id: string, data: Partial<{ name: string; position: string; size: string; enabled: boolean; code: string }>) {
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  
  if (data.name !== undefined) { fields.push(`name = $${i++}`); values.push(data.name); }
  if (data.position !== undefined) { fields.push(`position = $${i++}`); values.push(data.position); }
  if (data.size !== undefined) { fields.push(`size = $${i++}`); values.push(data.size); }
  if (data.enabled !== undefined) { fields.push(`enabled = $${i++}`); values.push(data.enabled); }
  if (data.code !== undefined) { fields.push(`code = $${i++}`); values.push(data.code); }
  
  if (fields.length > 0) {
    fields.push(`updated_at = $${i++}`);
    values.push(new Date().toISOString());
    values.push(id);
    await query(`UPDATE ads SET ${fields.join(', ')} WHERE id = $${i}`, values);
  }
}
