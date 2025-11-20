'use client';

import { UserProfile } from '@clerk/nextjs';

const UserProfilePage = () => (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <UserProfile path="/user-profile" />
    </div>
);

export default UserProfilePage;
