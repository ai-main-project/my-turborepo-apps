import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from './Hero.module.css';
import { Button } from '@/components/core/Button';

export const Hero = () => {
    const t = useTranslations('Hero');
    const tCommon = useTranslations('Common');

    return (
        <section className={styles.hero}>
            <div className={styles.glow} />

            <div className={styles.container}>
                <h1 className={styles.title}>
                    {t('title1')} <br />
                    <span className="text-gradient">{t('title2')}</span>
                </h1>

                <p className={styles.subtitle}>
                    {t('subtitle')}
                </p>

                <div className={styles.actions}>
                    <Link href="/blog">
                        <Button size="lg">{tCommon('readMore')}</Button>
                    </Link>
                    <Link href="/about">
                        <Button variant="secondary" size="lg">{tCommon('aboutMe')}</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};
