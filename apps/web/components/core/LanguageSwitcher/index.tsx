'use client';

import React, { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import styles from './LanguageSwitcher.module.css';
import { cn } from '@/lib/utils/cn';

export const LanguageSwitcher = () => {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const switchLocale = (nextLocale: string) => {
        startTransition(() => {
            // Simple replacement for now, ideally use next-intl navigation APIs
            const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
            router.replace(newPath);
        });
    };

    return (
        <div className={styles.switcher}>
            <button
                className={cn(styles.button, locale === 'en' && styles.active)}
                onClick={() => switchLocale('en')}
                disabled={isPending}
            >
                EN
            </button>
            <span style={{ color: 'var(--border-glass-strong)' }}>/</span>
            <button
                className={cn(styles.button, locale === 'zh' && styles.active)}
                onClick={() => switchLocale('zh')}
                disabled={isPending}
            >
                中文
            </button>
        </div>
    );
};
