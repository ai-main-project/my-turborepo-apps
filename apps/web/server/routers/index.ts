import { router } from '../trpc';
import { postRouter } from './post';

export const appRouter = router({
  post: postRouter,
});

// 导出类型
export type AppRouter = typeof appRouter;