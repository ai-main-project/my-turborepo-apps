import { initTRPC } from '@trpc/server';

// 创建 context
export const createContext = async () => ({});

// 初始化 tRPC
const t = initTRPC.context<typeof createContext>().create();

// 导出可复用的 router 和 procedure
export const router = t.router;
export const publicProcedure = t.procedure;