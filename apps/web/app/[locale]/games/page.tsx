import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card } from '@/components/core/Card';
import styles from './page.module.css';

export default function GamesPage() {
    const t = useTranslations('Games');

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t('title')}</h1>
            <div className={styles.grid}>
                <Link href="/games/dino" className={styles.link}>
                    <Card hoverable className={styles.cardContent}>
                        <h3>Dino Game</h3>
                        <p>A clone of the classic Chrome Dino game. Jump over obstacles and score points!</p>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
