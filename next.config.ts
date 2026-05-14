import type { NextConfig } from "next";

const isIosBuild = process.env.NEXT_OUTPUT === 'export'

const nextConfig: NextConfig = {
  ...(isIosBuild ? { output: 'export' } : {}),
  images: {
    // 静的エクスポート時は画像最適化サーバー不要
    unoptimized: isIosBuild,
  },
  trailingSlash: isIosBuild,
};

export default nextConfig;
