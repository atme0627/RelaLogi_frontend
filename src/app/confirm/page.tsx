"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
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

  // Context未設定時は開発用デフォルトを使用
  const isDev = process.env.NODE_ENV === "development";
  const [devDefaults] = useState(() =>
    (!ctxSizeConfig || !ctxOcrResult) && isDev ? createDevDefaults() : null,
  );
  const sizeConfig = ctxSizeConfig ?? devDefaults?.sizeConfig ?? null;
  const ocrResult = ctxOcrResult ?? devDefaults?.ocrResult ?? null;

  // OCR結果をローカルstateにコピーして編集可能にする
  const [verticalHint, setVerticalHint] = useState<string[][]>([]);
  const [horizontalHint, setHorizontalHint] = useState<string[][]>([]);

  useEffect(() => {
    if (!sizeConfig || !ocrResult) {
      router.replace("/upload");
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

  const handleBack = useCallback(() => {
    router.push("/size");
  }, [router]);

  const handleConfirm = useCallback(() => {
    router.push("/play");
  }, [router]);

  if (!sizeConfig || !ocrResult) return null;

  return (
    <Box
      w="100%"
      minH="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      gap={6}
      py={6}
    >
      <Box>
        <Heading size="2xl">ヒントの確認・修正</Heading>
        <Text color="gray.500" mt={2} fontSize="md">
          OCR結果を確認し、必要に応じて修正してください
        </Text>
      </Box>

      {/* mainのmaxWidthを突き破って画面幅いっぱいに表示 */}
      <Box
        w="100vw"
        position="relative"
        left="50%"
        ml="-50vw"
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
      </Box>

      {/* ボタン */}
      <Box display="flex" justifyContent="space-evenly">
        <Button
          variant="outline"
          colorPalette="gray"
          w="120px"
          onClick={handleBack}
        >
          戻る
        </Button>
        <Button
          colorPalette="blue"
          fontWeight="bold"
          w="120px"
          onClick={handleConfirm}
        >
          確定
        </Button>
      </Box>
    </Box>
  );
}
