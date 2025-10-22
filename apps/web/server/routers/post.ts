// src/server/routers/post.ts
import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

// 模拟一个数据库
const posts = [
  { id: '1', title: 'Hello tRPC', content: 'This is awesome.' },
];

export const postRouter = router({
  // 1. 查询 (Query): 获取所有文章
  getAll: publicProcedure.query(async ({ ctx }) => {
    // ctx.prisma... 在真实项目中你会用这个
    return posts;
  }),

  // 2. 带输入的查询: 按 ID 获取文章
  getById: publicProcedure
    .input(z.object({ id: z.string() })) // 使用 Zod 验证输入
    .query(async ({ input, ctx }) => {
      const post = posts.find((p) => p.id === input.id);
      if (!post) {
        throw new Error('Post not found');
      }
      return post;
    }),

  // 3. 变更 (Mutation): 创建文章
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(3),
        content: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const newPost = { id: String(posts.length + 1), ...input };
      posts.push(newPost);
      return newPost;
    }),
});