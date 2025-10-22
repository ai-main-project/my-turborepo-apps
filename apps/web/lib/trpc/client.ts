// src/lib/trpc/client.ts
import { createTRPCReact } from '@trpc/react-query';

// 🔥 魔法关键点：从后端导入 AppRouter 类型
import type { AppRouter } from '@/server/routers'; 
// import type { inferRouterProxyClient } from '@trpc/client';

// 创建一个带类型的 tRPC 客户端
// 显式声明 trpc 的类型，避免推断时依赖内部模块路径
export const trpc: ReturnType<typeof createTRPCReact<AppRouter>> = createTRPCReact<AppRouter>({});
