import { getArticles } from '@/lib/articles';
import { ArticleList } from '@/components/blog/ArticleList';

export default async function BlogPage() {
    const articles = await getArticles();

    return (
        <div style={{ padding: '2rem 1rem' }}>
            <h1 style={{
                fontSize: '3rem',
                marginBottom: '3rem',
                textAlign: 'center',
                background: 'linear-gradient(to right, #c084fc, #6366f1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
            }}>
                Blog
            </h1>
            <ArticleList articles={articles} />
        </div>
    );
}
