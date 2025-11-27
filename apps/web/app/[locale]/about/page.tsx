import React from 'react';
import { Profile } from '@/components/about/Profile';
import { Contact } from '@/components/about/Contact';
import { Newsletter } from '@/components/about/Newsletter';
import { Resume } from '@/components/about/Resume';

export default function AboutPage() {
    return (
        <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
        }}>
            <Profile />
            <Resume />

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
            }}>
                <Contact />
                <Newsletter />
            </div>
        </div>
    );
}
