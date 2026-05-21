import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
      {
        protocol: "http",
        hostname: "*",
      },
    ],
  },
  // pg 模块需要在服务端运行，不需要打包到客户端
  serverExternalPackages: ["pg"],
};

export default nextConfig;
