import React from 'react';
import DinoGame from '@/components/games/DinoGame';

export default function DinoGamePage() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)', padding: '2rem' }}>
            <DinoGame />
        </div>
    );
}
