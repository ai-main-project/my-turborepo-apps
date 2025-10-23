'use client';

import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';

export default function Home() {
  
  // 1. 查询 (Query) - 使用 useQuery
  // 🔥 注意看：
  // - trpc.post.getAll... 路径是完全类型安全的，VSCode 会自动补全
  // - 'data' 的类型被自动推断为 { id: string, title: string, ... }[]
  const { data: posts, isLoading, error } = trpc.post.getAll.useQuery();

  // 2. 带输入的查询
  const { data: singlePost } = trpc.post.getById.useQuery({ id: '1' });

  // 3. 变更 (Mutation) - 使用 useMutation
  const createPostMutation = trpc.post.create.useMutation({
    onSuccess: () => {
      // 成功后可以做一些事情，比如刷新列表
      // (tRPC 提供了更高级的 'utils.invalidate()' 方法)
      alert('文章创建成功!');
    },
    onError: (err) => {
      // 🔥 类型安全：Zod 验证错误会在这里被捕获
      alert(`创建失败: ${err.message}`);
    }
  });

  const handleSubmit = () => {
    createPostMutation.mutate({
      title: '我的新文章' + new Date().getTime(),
      content: 'tRPC 真是太棒了！',
      
      // 🔥 类型安全：如果你在这里添加一个后端 .input() 中没有的字段
      // e.g. author: 'me'
      // TypeScript 会立刻报错！
    });
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }
  
  if (error) {
    return <div>错误: {error.message}</div>;
  }

  return (
    <div>
      <h1>文章列表</h1>
      <ul>
        {posts?.map((post) => (
          <li key={post.id}>{post.title}--------------{post.content}</li>
        ))}
      </ul>
      
      <button onClick={handleSubmit} disabled={createPostMutation.isPending}>
        {createPostMutation.isPending ? '创建中...' : '创建新文章'}
      </button>
    </div>
  );
}