import fs from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'data');
const articlesFilePath = path.join(dataDirectory, 'articles.json');

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

function ensureDataDirectory() {
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }
  if (!fs.existsSync(articlesFilePath)) {
    fs.writeFileSync(articlesFilePath, '[]', 'utf8');
  }
}

export async function getArticles(): Promise<Article[]> {
  ensureDataDirectory();
  const fileContent = fs.readFileSync(articlesFilePath, 'utf8');
  try {
    const articles = JSON.parse(fileContent) as Article[];
    return articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles();
  return articles.find((article) => article.slug === slug) || null;
}

export async function getArticleById(id: string): Promise<Article | null> {
  const articles = await getArticles();
  return articles.find((article) => article.id === id) || null;
}

export async function createArticle(article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article> {
  const articles = await getArticles();
  
  // Check for duplicate slug
  if (articles.some(a => a.slug === article.slug)) {
    throw new Error('Slug already exists');
  }

  const newArticle: Article = {
    ...article,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  articles.push(newArticle);
  fs.writeFileSync(articlesFilePath, JSON.stringify(articles, null, 2), 'utf8');
  return newArticle;
}

export async function updateArticle(slug: string, updates: Partial<Omit<Article, 'id' | 'createdAt'>>): Promise<Article | null> {
  const articles = await getArticles();
  const index = articles.findIndex((a) => a.slug === slug);
  
  if (index === -1) return null;

  const updatedArticle = {
    ...articles[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  } as Article;

  articles[index] = updatedArticle;
  fs.writeFileSync(articlesFilePath, JSON.stringify(articles, null, 2), 'utf8');
  return updatedArticle;
}
