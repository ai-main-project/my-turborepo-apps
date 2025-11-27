import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './Resume.module.css';

export const Resume = () => {
    const t = useTranslations('Resume');

    return (
        <section className={styles.resume}>
            <div className={styles.section}>
                <h2 className={styles.title}>{t('experience')}</h2>
                <div className={styles.item}>
                    <div className={styles.header}>
                        <h3 className={styles.role}>{t('roles.senior')}</h3>
                        <span className={styles.period}>2020 - {t('present')}</span>
                    </div>
                    <p className={styles.company}>{t('companies.techCorp')}</p>
                    <p className={styles.description}>
                        {t('descriptions.senior')}
                    </p>
                </div>
                <div className={styles.item}>
                    <div className={styles.header}>
                        <h3 className={styles.role}>{t('roles.developer')}</h3>
                        <span className={styles.period}>2018 - 2020</span>
                    </div>
                    <p className={styles.company}>{t('companies.startup')}</p>
                    <p className={styles.description}>
                        {t('descriptions.developer')}
                    </p>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.title}>{t('skills')}</h2>
                <div className={styles.skills}>
                    {['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Design Systems', 'GraphQL', 'PostgreSQL'].map(skill => (
                        <span key={skill} className={styles.skill}>{skill}</span>
                    ))}
                </div>
            </div>
        </section>
    );
};
