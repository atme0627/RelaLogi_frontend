import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: isProd
      ? { "@/mocks/dev-defaults": "@/mocks/dev-defaults.prod" }
      : {},
  },
  // devプロキシ(rewrites)経由のリクエストボディ上限。既定10MBではパズル写真(PNG)が
  // 途中で切られて壊れたmultipartになるため引き上げる。
  experimental: {
    proxyClientMaxBodySize: "50mb",
  },
  // 開発時、同一オリジン(/api)へのリクエストを実バックエンドへプロキシしてCORSを回避する。
  // 送信先は API_PROXY_TARGET で上書き可能（既定 http://localhost:8080）。
  async rewrites() {
    if (isProd) return [];
    const target = process.env.API_PROXY_TARGET ?? "http://localhost:8080";
    return [{ source: "/api/:path*", destination: `${target}/api/:path*` }];
  },
  webpack: (config, { dev, webpack }) => {
    if (!dev) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /mocks\/dev-defaults\.ts$/,
          "./dev-defaults.prod.ts",
        ),
      );
    }
    return config;
  },
};

export default nextConfig;
