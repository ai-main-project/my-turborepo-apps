import { getArticleById } from '@/lib/articles';
import { ArticleDetail } from '@/components/blog/ArticleDetail';
import { notFound } from 'next/navigation';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params; // This is the ID
    const article = await getArticleById(slug);

    if (!article) {
        notFound();
    }

    return (
        <div style={{ padding: '2rem 1rem' }}>
            <ArticleDetail article={article} />
        </div>
    );
}
