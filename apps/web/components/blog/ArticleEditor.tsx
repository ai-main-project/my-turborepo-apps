'use client';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import styles from './ArticleEditor.module.css';
import 'highlight.js/styles/github-dark.css';

export const ArticleEditor = () => {
    const t = useTranslations('Blog');
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [tags, setTags] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!title || !slug || !content) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSaving(true);
        try {
            const article = {
                title,
                slug,
                content,
                excerpt,
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            };

            const res = await fetch('/api/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(article),
            });

            if (res.ok) {
                const savedArticle = await res.json();
                alert('Saved successfully!');
                router.push(`/blog/${savedArticle.id}`);
            } else {
                const error = await res.json();
                alert(`Error saving: ${error.error || 'Unknown error'}`);
            }
        } catch (error) {
            alert('Error saving article');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.editor}>
                <h2 className={styles.heading}>{t('create')}</h2>
                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('form.title')}</label>
                    <input
                        className={styles.input}
                        placeholder={t('placeholders.title')}
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('form.slug')}</label>
                    <input
                        className={styles.input}
                        placeholder={t('placeholders.slug')}
                        value={slug}
                        onChange={e => setSlug(e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('form.excerpt')}</label>
                    <textarea
                        className={styles.textareaSmall}
                        placeholder={t('placeholders.excerpt')}
                        value={excerpt}
                        onChange={e => setExcerpt(e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('form.tags')}</label>
                    <input
                        className={styles.input}
                        placeholder={t('placeholders.tags')}
                        value={tags}
                        onChange={e => setTags(e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('form.content')}</label>
                    <textarea
                        className={styles.textarea}
                        placeholder={t('placeholders.content')}
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                </div>
                <button
                    className={styles.button}
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? t('saving') : t('save')}
                </button>
            </div>

            <div className={styles.previewContainer}>
                <h2 className={styles.heading}>{t('form.preview')}</h2>
                <div className={styles.preview}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
};
