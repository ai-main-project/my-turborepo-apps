'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import styles from './FeaturedPosts.module.css';
import { Card } from '@/components/core/Card';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { Article } from '@/lib/articles';

export const FeaturedPosts = () => {
    const t = useTranslations('Common');
    const locale = useLocale();
    const [posts, setPosts] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/articles');
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data.slice(0, 3)); // Only show top 3
                }
            } catch (error) {
                console.error('Failed to fetch posts', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return null; // Or a loading skeleton
    }

    if (posts.length === 0) {
        return null;
    }

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h2>{t('latestArticles')}</h2>
                        <p>{t('latestSubtitle')}</p>
                    </div>
                    <Link href="/blog">
                        <Button variant="ghost">{t('viewAll')}</Button>
                    </Link>
                </div>

                <div className={styles.grid}>
                    {posts.map((post) => (
                        <Link key={post.id} href={`/blog/${post.id}`}>
                            <Card hoverable className={styles.postCard}>
                                <div className={styles.imageWrapper}>
                                    {post.coverImage ? (
                                        <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #2a8af6, #a853ba)' }} />
                                    )}
                                </div>
                                <div className={styles.content}>
                                    <div className={styles.meta}>
                                        {post.tags.slice(0, 2).map(tag => (
                                            <Badge key={tag}>{tag}</Badge>
                                        ))}
                                    </div>
                                    <h3 className={styles.title}>{post.title}</h3>
                                    <p className={styles.excerpt}>{post.excerpt}</p>
                                    <div className={styles.footer}>
                                        <span>
                                            {new Date(post.createdAt).toLocaleDateString(locale, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
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
