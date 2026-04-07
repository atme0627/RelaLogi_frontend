"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/PageLayout";
import { ConfirmBoard } from "@/components/ConfirmBoard";
import { usePuzzleData } from "@/contexts/PuzzleDataContext";
import type { SizeConfig, OcrResult } from "@/types/puzzle";
import sampleVerticalHint from "@/mocks/fixtures/sample_cropped_height_hint.png";
import sampleHorizontalHint from "@/mocks/fixtures/sample_cropped_width_hint.png";

// 開発用デフォルトデータ（/confirmに直接アクセスした場合に使用）
function createDevDefaults(): { sizeConfig: SizeConfig; ocrResult: OcrResult } {
  const config: SizeConfig = {
    gameCols: 25,
    gameRows: 25,
    maxVerticalHintRows: 7,
    maxHorizontalHintCols: 7,
  };

  const generateHints = (rows: number, cols: number): string[][] =>
    Array.from({ length: rows }, () => {
      const count = Math.floor(Math.random() * 3) + 1;
      const hints = Array.from({ length: count }, () =>
        String(Math.floor(Math.random() * 15) + 1),
      );
      const empties = Array.from({ length: cols - count }, () => "");
      return [...empties, ...hints];
    });

  return {
    sizeConfig: config,
    ocrResult: {
      verticalHint: generateHints(config.maxVerticalHintRows, config.gameCols),
      horizontalHint: generateHints(config.gameRows, config.maxHorizontalHintCols),
      verticalHintImage: (sampleVerticalHint as { src?: string }).src ?? (sampleVerticalHint as unknown as string),
      horizontalHintImage: (sampleHorizontalHint as { src?: string }).src ?? (sampleHorizontalHint as unknown as string),
    },
  };
}

export default function ConfirmPage() {
  const router = useRouter();
  const { sizeConfig: ctxSizeConfig, ocrResult: ctxOcrResult } = usePuzzleData();

  const isDev = process.env.NODE_ENV === "development";
  const [devDefaults] = useState(() =>
    (!ctxSizeConfig || !ctxOcrResult) && isDev ? createDevDefaults() : null,
  );
  const sizeConfig = ctxSizeConfig ?? devDefaults?.sizeConfig ?? null;
  const ocrResult = ctxOcrResult ?? devDefaults?.ocrResult ?? null;

  const [verticalHint, setVerticalHint] = useState<string[][]>([]);
  const [horizontalHint, setHorizontalHint] = useState<string[][]>([]);

  useEffect(() => {
    if (!sizeConfig || !ocrResult) {
      router.replace("/");
      return;
    }
    setVerticalHint(ocrResult.verticalHint.map((row) => [...row]));
    setHorizontalHint(ocrResult.horizontalHint.map((row) => [...row]));
  }, [sizeConfig, ocrResult, router]);

  const handleVerticalHintChange = useCallback(
    (row: number, col: number, value: string) => {
      setVerticalHint((prev) => {
        const next = prev.map((r) => [...r]);
        next[row][col] = value;
        return next;
      });
    },
    [],
  );

  const handleHorizontalHintChange = useCallback(
    (row: number, col: number, value: string) => {
      setHorizontalHint((prev) => {
        const next = prev.map((r) => [...r]);
        next[row][col] = value;
        return next;
      });
    },
    [],
  );

  if (!sizeConfig || !ocrResult) return null;

  return (
    <PageLayout
      currentStep={3}
      title="ヒントの確認・修正"
      description="OCR結果を確認し、必要に応じて修正してください"
      onPrev={() => router.push("/size")}
      onNext={() => router.push("/play")}
    >
      <ConfirmBoard
        gameCols={sizeConfig.gameCols}
        gameRows={sizeConfig.gameRows}
        maxHorizontalHintCols={sizeConfig.maxHorizontalHintCols}
        maxVerticalHintRows={sizeConfig.maxVerticalHintRows}
        verticalHint={verticalHint}
        horizontalHint={horizontalHint}
        onVerticalHintChange={handleVerticalHintChange}
        onHorizontalHintChange={handleHorizontalHintChange}
        verticalHintImage={ocrResult.verticalHintImage}
        horizontalHintImage={ocrResult.horizontalHintImage}
      />
    </PageLayout>
  );
}
