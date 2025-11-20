// 在你的 Header.tsx (客户端组件)
'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import LocalSwitcher from './LocalSwitcher';

export function Header() {
  const { isSignedIn } = useUser(); // 检查用户是否登录

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
      <Link href="/">首页</Link>
      <LocalSwitcher />
      <div>
        {isSignedIn ? (
          <UserButton /> // 登录后显示用户按钮
        ) : (
          <Link href="/sign-in">登录</Link> // 未登录显示登录链接
        )}
      </div>
    </header>
  );
}