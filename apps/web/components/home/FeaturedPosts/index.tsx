import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from './FeaturedPosts.module.css';
import { Card } from '@/components/core/Card';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';

// Mock data for now
const POSTS = [
    {
        id: 1,
        title: 'Building a Modern Blog with Next.js 15',
        excerpt: 'Explore the new features of Next.js 15 including partial prerendering and server actions.',
        date: 'Nov 20, 2025',
        readTime: '5 min read',
        tags: ['Next.js', 'React'],
        slug: 'building-modern-blog'
    },
    {
        id: 2,
        title: 'The Art of Glassmorphism in UI Design',
        excerpt: 'How to effectively use blur and transparency to create depth and hierarchy in your interfaces.',
        date: 'Nov 18, 2025',
        readTime: '8 min read',
        tags: ['Design', 'CSS'],
        slug: 'glassmorphism-ui-design'
    },
    {
        id: 3,
        title: 'Mastering TypeScript Generics',
        excerpt: 'A deep dive into advanced TypeScript patterns to make your code more reusable and type-safe.',
        date: 'Nov 15, 2025',
        readTime: '12 min read',
        tags: ['TypeScript', 'Engineering'],
        slug: 'mastering-typescript-generics'
    }
];

export const FeaturedPosts = () => {
    const t = useTranslations('Common');

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h2>{t('latestArticles')}</h2>
                        <p>{t('latestSubtitle')}</p>
                    </div>
                    <Link href="/posts">
                        <Button variant="ghost">{t('viewAll')}</Button>
                    </Link>
                </div>

                <div className={styles.grid}>
                    {POSTS.map((post) => (
                        <Link key={post.id} href={`/posts/${post.slug}`}>
                            <Card hoverable className={styles.postCard}>
                                <div className={styles.imageWrapper}>
                                    {/* Placeholder for image */}
                                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #2a8af6, #a853ba)' }} />
                                </div>
                                <div className={styles.content}>
                                    <div className={styles.meta}>
                                        {post.tags.map(tag => (
                                            <Badge key={tag}>{tag}</Badge>
                                        ))}
                                    </div>
                                    <h3 className={styles.title}>{post.title}</h3>
                                    <p className={styles.excerpt}>{post.excerpt}</p>
                                    <div className={styles.footer}>
                                        <span>{post.date}</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
