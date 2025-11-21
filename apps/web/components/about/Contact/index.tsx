'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './Contact.module.css';
import { Card } from '@/components/core/Card';

export const Contact = () => {
    const t = useTranslations('About');

    const links = [
        { label: 'GitHub', href: 'https://github.com', icon: 'Github' },
        { label: 'Twitter', href: 'https://twitter.com', icon: 'Twitter' },
        { label: 'Email', href: 'mailto:hello@example.com', icon: 'Mail' },
    ];

    return (
        <Card className={styles.contact}>
            <h2 className={styles.title}>{t('connect')}</h2>
            <div className={styles.list}>
                {links.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.item}
                    >
                        <span>{link.label}</span>
                    </a>
                ))}
            </div>
        </Card>
    );
};
