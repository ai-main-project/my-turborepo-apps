'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './Profile.module.css';
import { Card } from '@/components/core/Card';

export const Profile = () => {
    const t = useTranslations('About');

    return (
        <Card className={styles.profile}>
            <div className={styles.avatar} />
            <h1 className={styles.name}>Vist</h1>
            <p className={styles.bio}>{t('bio')}</p>
        </Card>
    );
};
