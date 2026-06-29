"use client";

// Emotion（Chakra UIが内部利用）のスタイルをSSR時に正しく差し込むためのレジストリ。
// これが無いと、サーバーとクライアントでスタイルの挿入位置がズレてハイドレーション不一致になる。
// useServerInsertedHTMLでサーバー描画時に挿入済みスタイルを<style>として吐き出す。
import { useState, type ReactNode } from "react";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

export function EmotionRegistry({ children }: { children: ReactNode }) {
  const [cache] = useState(() => {
    const c = createCache({ key: "css" });
    // compat=trueでGlobalスタイル等も挿入記録の対象にする
    c.compat = true;
    return c;
  });

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: Object.values(cache.inserted).join(" ") }}
    />
  ));

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
