'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import styles from './Navbar.module.css';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/core/Button';
import { ThemeToggle } from '@/components/core/ThemeToggle';
import { LanguageSwitcher } from '@/components/core/LanguageSwitcher';

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const t = useTranslations('Common');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { label: t('home'), href: '/' },
        { label: t('posts'), href: '/posts' },
        { label: t('about'), href: '/about' },
    ];

    return (
        <nav className={cn(styles.navbar, scrolled && styles.scrolled)}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    Vist<span className="text-gradient">.Blog</span>
                </Link>

                <div className={styles.navLinks}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                styles.link,
                                pathname === item.href && styles.active
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <div className={styles.mobileMenuBtn}>
                        <Button variant="ghost" size="sm">{t('menu')}</Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
