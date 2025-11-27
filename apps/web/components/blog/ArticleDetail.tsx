import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Article } from '@/lib/articles';
import styles from './ArticleDetail.module.css';
import { Button } from '@/components/core/Button';
import 'highlight.js/styles/github-dark.css';

interface ArticleDetailProps {
    article: Article;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({ article }) => {
    const locale = useLocale();
    const t = useTranslations('Blog');

    return (
        <article className={styles.article}>
            <div className={styles.actions}>
                <Link href="/blog">
                    <Button variant="ghost" size="sm">← {t('backToBlog')}</Button>
                </Link>
            </div>
            <header className={styles.header}>
                {article.coverImage && (
                    <div className={styles.coverImageContainer}>
                        <img src={article.coverImage} alt={article.title} className={styles.coverImage} />
                    </div>
                )}
                <h1 className={styles.title}>{article.title}</h1>
                <div className={styles.meta}>
                    <time className={styles.date}>
                        {new Date(article.createdAt).toLocaleDateString(locale, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </time>
                    <div className={styles.tags}>
                        {article.tags.map(tag => (
                            <span key={tag} className={styles.tag}>#{tag}</span>
                        ))}
                    </div>
                </div>
            </header>
            <div className={styles.content}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                        // Custom components can be added here if needed
                    }}
                >
                    {article.content}
                </ReactMarkdown>
            </div>
        </article>
    );
};
