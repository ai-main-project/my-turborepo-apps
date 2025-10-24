// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// 1. 定义哪些路由是公开的，不需要认证
const isPublicRoute = createRouteMatcher([
  '/', // 首页
  '/sign-in(.*)', // 登录页面及其所有子路由
  '/sign-up(.*)', // 注册页面及其所有子路由
  '/api/trpc/(.*)', // 你的 tRPC API 路由
  // 你可以添加其他公共页面，比如 '/about', '/pricing'
]);

// 2. 定义哪些路由是受保护的，必须登录
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', // 仪表盘
  '/settings(.*)', // 设置页面
  // 添加你需要保护的其他路由
]);

export default clerkMiddleware(async (auth, req) => {
  // 3. 如果路由是公共的，什么也不做，允许访问
  if (isPublicRoute(req)) {
    return; // 允许访问
  }

  // 4. 如果路由不是公共的，检查用户是否登录
  // auth().protect() 会自动：
  //    - 如果用户未登录，将他们重定向到登录页面 (在 publicRoutes 定义的 /sign-in)
  //    - 如果用户已登录，允许他们访问
  await auth.protect();
});

export const config = {
  // matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};