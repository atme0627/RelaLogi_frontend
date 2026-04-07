"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/PageLayout";
import { PlayBoard } from "@/components/PlayBoard";
import { usePuzzleData } from "@/contexts/PuzzleDataContext";
import type { SizeConfig, OcrResult, CellState } from "@/types/puzzle";

// 開発用デフォルトデータ（/playに直接アクセスした場合に使用）
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
      verticalHintImage: "",
      horizontalHintImage: "",
    },
  };
}

// 2次元配列を指定サイズで初期化
function create2D<T>(rows: number, cols: number, value: T): T[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => value));
}

export default function PlayPage() {
  const router = useRouter();
  const { sizeConfig: ctxSizeConfig, ocrResult: ctxOcrResult } = usePuzzleData();

  const isDev = process.env.NODE_ENV === "development";
  const [devDefaults] = useState(() =>
    (!ctxSizeConfig || !ctxOcrResult) && isDev ? createDevDefaults() : null,
  );
  const sizeConfig = ctxSizeConfig ?? devDefaults?.sizeConfig ?? null;
  const ocrResult = ctxOcrResult ?? devDefaults?.ocrResult ?? null;

  const [cells, setCells] = useState<CellState[][]>([]);
  const [verticalGrayedOut, setVerticalGrayedOut] = useState<boolean[][]>([]);
  const [horizontalGrayedOut, setHorizontalGrayedOut] = useState<boolean[][]>([]);

  useEffect(() => {
    if (!sizeConfig || !ocrResult) {
      router.replace("/");
      return;
    }
    setCells(create2D(sizeConfig.gameRows, sizeConfig.gameCols, "empty" as CellState));
    setVerticalGrayedOut(create2D(sizeConfig.maxVerticalHintRows, sizeConfig.gameCols, false));
    setHorizontalGrayedOut(create2D(sizeConfig.gameRows, sizeConfig.maxHorizontalHintCols, false));
  }, [sizeConfig, ocrResult, router]);

  const handleCellChange = useCallback(
    (row: number, col: number, state: CellState) => {
      setCells((prev) => {
        const next = prev.map((r) => [...r]);
        next[row][col] = state;
        return next;
      });
    },
    [],
  );

  const handleToggleVerticalGray = useCallback(
    (row: number, col: number) => {
      setVerticalGrayedOut((prev) => {
        const next = prev.map((r) => [...r]);
        next[row][col] = !next[row][col];
        return next;
      });
    },
    [],
  );

  const handleToggleHorizontalGray = useCallback(
    (row: number, col: number) => {
      setHorizontalGrayedOut((prev) => {
        const next = prev.map((r) => [...r]);
        next[row][col] = !next[row][col];
        return next;
      });
    },
    [],
  );

  if (!sizeConfig || !ocrResult || cells.length === 0) return null;

  return (
    <PageLayout
      title="パズルを解く"
      description="クリックで塗りつぶし / Shift+クリックで× / Cmd+クリックで◇"
      onPrev={() => router.push("/confirm")}
    >
      <PlayBoard
        gameCols={sizeConfig.gameCols}
        gameRows={sizeConfig.gameRows}
        maxHorizontalHintCols={sizeConfig.maxHorizontalHintCols}
        maxVerticalHintRows={sizeConfig.maxVerticalHintRows}
        verticalHint={ocrResult.verticalHint}
        horizontalHint={ocrResult.horizontalHint}
        cells={cells}
        onCellChange={handleCellChange}
        verticalGrayedOut={verticalGrayedOut}
        horizontalGrayedOut={horizontalGrayedOut}
        onToggleVerticalGray={handleToggleVerticalGray}
        onToggleHorizontalGray={handleToggleHorizontalGray}
      />
    </PageLayout>
  );
}
