"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/PageLayout";
import { ConfirmBoard } from "@/components/ConfirmBoard";
import { usePuzzleData } from "@/contexts/PuzzleDataContext";
import { createMockConfirmDefaults } from "@/mocks/dev-defaults";

export default function ConfirmPage() {
  const router = useRouter();
  const { sizeConfig: ctxSizeConfig, ocrResult: ctxOcrResult } = usePuzzleData();

  const [devDefaults] = useState(() =>
    (!ctxSizeConfig || !ctxOcrResult) ? createMockConfirmDefaults() : null,
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
      title="認識結果の確認・修正"
      description="結果を確認し、誤りがあれば手動で修正してください。"
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
