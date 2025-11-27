import { NextRequest, NextResponse } from 'next/server';
import { getArticleById } from '@/lib/articles';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug; // This is actually the ID now based on usage
  const article = await getArticleById(slug);
  
  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }
  
  return NextResponse.json(article);
}
