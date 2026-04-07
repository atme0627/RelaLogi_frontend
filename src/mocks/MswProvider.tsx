"use client";

// 開発環境でのみMSWを起動し、起動完了まで描画を待機するProvider
// 本番環境ではそのまま子コンポーネントを描画する
import { use, Suspense, type ReactNode } from "react";

// MSW起動完了を表すPromise（モジュール読み込み時に1度だけ生成）
const mswReady: Promise<void> =
  typeof window !== "undefined" && process.env.NODE_ENV === "development"
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
  if (process.env.NODE_ENV !== "development") {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={null}>
      <MswGate>{children}</MswGate>
    </Suspense>
  );
}
