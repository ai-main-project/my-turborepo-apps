import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from './Footer.module.css';

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    const t = useTranslations('Common');

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.brand}>
                        <h3>Vist<span className="text-gradient">.Blog</span></h3>
                        <p>{t('footerBrand')}</p>
                    </div>

                    <div className={styles.links}>
                        <div className={styles.column}>
                            <h4>{t('navigation')}</h4>
                            <ul>
                                <li><Link href="/">{t('home')}</Link></li>
                                <li><Link href="/blog">{t('posts')}</Link></li>
                                <li><Link href="/about">{t('about')}</Link></li>
                            </ul>
                        </div>
                        <div className={styles.column}>
                            <h4>{t('social')}</h4>
                            <ul>
                                <li><a href="#" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                                <li><a href="#" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                                <li><a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.copyright}>
                    &copy; {currentYear} Vist.Blog. {t('rights')}
                </div>
            </div>
        </footer>
    );
};
