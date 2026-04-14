"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Text } from "@chakra-ui/react";
import { PageLayout } from "@/components/PageLayout";
import { PlayBoard } from "@/components/PlayBoard";
import { usePuzzleData } from "@/contexts/PuzzleDataContext";
import type { PaintMode } from "@/components/PlayableGameBoard";
import type { SizeConfig, OcrResult, CellState } from "@/types/puzzle";

const PAINT_MODES: { mode: PaintMode; symbol: string; label: string; color: string; bgActive: string; shortcutKey?: string; shortcutLabel?: string }[] = [
  { mode: "filled", symbol: "■", label: "FILL", color: "gray.500", bgActive: "gray.100" },
  { mode: "cross", symbol: "×", label: "BLANK", color: "orange.400", bgActive: "orange.50", shortcutKey: "Shift", shortcutLabel: "⇧" },
  { mode: "diamond", symbol: "◇", label: "UNSURE", color: "blue.400", bgActive: "blue.50", shortcutKey: "Meta", shortcutLabel: "⌘" },
];

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

  const [paintMode, setPaintMode] = useState<PaintMode>("filled");
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

  // Shift/Cmd 押下中だけ一時的にモードを切り替え、離したら戻す
  const [tempMode, setTempMode] = useState<PaintMode | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") setTempMode("cross");
      else if (e.key === "Meta") setTempMode("diamond");
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift" || e.key === "Meta") setTempMode(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const effectiveMode = tempMode ?? paintMode;

  if (!sizeConfig || !ocrResult || cells.length === 0) return null;

  return (
    <PageLayout
      title="パズルを解く"
      onPrev={() => router.push("/confirm")}
      sideActions={
        <Box display="flex" gap={2}>
          {PAINT_MODES.map(({ mode, symbol, label, color, bgActive, shortcutLabel }) => {
            const isActive = effectiveMode === mode;
            return (
              <Box
                key={mode}
                as="button"
                flex="1"
                display="flex"
                alignItems="center"
                gap={1.5}
                px={2.5}
                py={1.5}
                borderRadius="md"
                borderWidth="1px"
                borderColor={isActive ? color : "gray.200"}
                bg={isActive ? bgActive : "transparent"}
                cursor="pointer"
                transition="all 0.15s"
                _hover={{ borderColor: color, bg: bgActive }}
                onClick={() => setPaintMode(mode)}
              >
                <Text fontSize="md" color={color} lineHeight="1">{symbol}</Text>
                <Text fontSize="xs" color={isActive ? "gray.600" : "gray.400"} lineHeight="1" fontWeight={isActive ? "bold" : "normal"}>{label}</Text>
                <Box flex="1" />
                {shortcutLabel && (
                  <Text fontSize="xs" color="gray.300" lineHeight="1">{shortcutLabel}</Text>
                )}
              </Box>
            );
          })}
        </Box>
      }
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
        paintMode={effectiveMode}
      />
    </PageLayout>
  );
}
