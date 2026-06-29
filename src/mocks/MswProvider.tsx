"use client";

// 開発環境でのみMSWを起動し、起動完了まで描画を待機するProvider
// 本番環境ではそのまま子コンポーネントを描画する
// NEXT_PUBLIC_API_MOCK=false の場合は開発環境でもMSWを起動せず実バックエンドへ通す
import { use, Suspense, type ReactNode } from "react";

// 開発環境かつモックが無効化されていない場合のみMSWを使う
const mockEnabled =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_API_MOCK !== "false";

// MSW起動完了を表すPromise（モジュール読み込み時に1度だけ生成）
const mswReady: Promise<void> =
  typeof window !== "undefined" && mockEnabled
    ? import("./browser")
        .then(({ worker }) => worker.start({ onUnhandledRequest: "warn" }))
        .then(() => undefined)
    : Promise.resolve();

// MSW起動完了までuse()で待機するゲートコンポーネント
function MswGate({ children }: { children: ReactNode }) {
  use(mswReady);
  return <>{children}</>;
}

export function MswProvider({ children }: { children: ReactNode }) {
  if (!mockEnabled) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={null}>
      <MswGate>{children}</MswGate>
    </Suspense>
  );
}
