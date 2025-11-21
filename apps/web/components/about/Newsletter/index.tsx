'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './Newsletter.module.css';
import { Card } from '@/components/core/Card';
import { Button } from '@/components/core/Button';

export const Newsletter = () => {
    const t = useTranslations('About');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        // Simulate API call
        setTimeout(() => {
            if (email.includes('error')) {
                setStatus('error');
            } else {
                setStatus('success');
                setEmail('');
            }
        }, 1500);
    };

    return (
        <Card className={styles.newsletter}>
            <div>
                <h2 className={styles.title}>{t('newsletterTitle')}</h2>
                <p className={styles.description}>{t('newsletterDesc')}</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading' || status === 'success'}
                    required
                />
                <Button
                    type="submit"
                    fullWidth
                    disabled={status === 'loading' || status === 'success'}
                >
                    {status === 'loading' ? t('subscribing') : t('subscribe')}
                </Button>
            </form>

            {status === 'success' && (
                <p className={`${styles.message} ${styles.success}`}>{t('success')}</p>
            )}
            {status === 'error' && (
                <p className={`${styles.message} ${styles.error}`}>{t('error')}</p>
            )}
        </Card>
    );
};
