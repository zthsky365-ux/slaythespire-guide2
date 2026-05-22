import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 图片优化 - 允许外部图片域名
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    // 添加 WebP/AVIF 格式支持
    formats: ["image/avif", "image/webp"],
    // 设置最小缓存 TTL
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 天
  },

  // pg 模块需要在服务端运行，不需要打包到客户端
  serverExternalPackages: ["pg"],

  // SEO 友好的 headers（对所有路由应用）
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      // 静态资源缓存
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // 启用 gzip 压缩
  compress: true,

  // 生产环境移除 console
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },

  // 启用 React 严格模式
  reactStrictMode: true,
};

export default nextConfig;
