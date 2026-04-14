import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: isProd
      ? { "@/mocks/dev-defaults": "@/mocks/dev-defaults.prod" }
      : {},
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
