import React from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Article } from '@/lib/articles';
import styles from './ArticleList.module.css';

interface ArticleListProps {
    articles: Article[];
}

export const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
    const locale = useLocale();

    return (
        <div className={styles.container}>
            {articles.map((article) => (
                <article key={article.id} className={styles.card}>
                    <Link href={`/blog/${article.id}`} className={styles.link}>
                        <h2 className={styles.title}>{article.title}</h2>
                        <p className={styles.excerpt}>{article.excerpt}</p>
                        <div className={styles.meta}>
                            <time className={styles.date}>
                                {new Date(article.createdAt).toLocaleDateString(locale)}
                            </time>
                            <div className={styles.tags}>
                                {article.tags.map(tag => (
                                    <span key={tag} className={styles.tag}>#{tag}</span>
                                ))}
                            </div>
                        </div>
                    </Link>
                </article>
            ))}
        </div>
    );
};
