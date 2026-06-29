"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@chakra-ui/react";
import { PageLayout } from "@/components/PageLayout";
import { SizeSettingBoard } from "@/components/SizeSettingBoard";
import { usePuzzleImage } from "@/contexts/PuzzleImageContext";
import { usePuzzleData } from "@/contexts/PuzzleDataContext";
import type { HintParameter, RecognizeResponse } from "@/types/puzzle";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

const DEFAULT_SIZE = 20;
const DEFAULT_HINT_SIZE = 6;

export default function SizePage() {
  const router = useRouter();
  const { previewUrl } = usePuzzleImage();
  const { cropRegions, setSizeConfig, setOcrResult } = usePuzzleData();

  const [gameRows, setGameRows] = useState(DEFAULT_SIZE);
  const [gameCols, setGameCols] = useState(DEFAULT_SIZE);
  const [maxVerticalHintRows, setMaxVerticalHintRows] = useState(DEFAULT_HINT_SIZE);
  const [maxHorizontalHintCols, setMaxHorizontalHintCols] = useState(DEFAULT_HINT_SIZE);
  const [submitting, setSubmitting] = useState(false);

  const handleReset = () => {
    setGameRows(DEFAULT_SIZE);
    setGameCols(DEFAULT_SIZE);
    setMaxVerticalHintRows(DEFAULT_HINT_SIZE);
    setMaxHorizontalHintCols(DEFAULT_HINT_SIZE);
  };

  const handleSubmit = useCallback(async () => {
    if (!cropRegions || !previewUrl) return;

    setSubmitting(true);
    try {
      const res = await fetch(previewUrl);
      const blob = await res.blob();

      const hintParameter: HintParameter = {
        verticalHintSize: { rows: maxVerticalHintRows, cols: gameCols },
        horizontalHintSize: { rows: gameRows, cols: maxHorizontalHintCols },
        verticalHintRegion: cropRegions[0],
        horizontalHintRegion: cropRegions[1],
      };

      const formData = new FormData();
      formData.append("puzzleImage", blob, "puzzle.png");
      formData.append("hintParameter", JSON.stringify(hintParameter));

      const apiRes = await fetch(`${API_BASE}/api/puzzles/recognize`, {
        method: "POST",
        body: formData,
      });

      if (!apiRes.ok) throw new Error(`送信失敗 (${apiRes.status})`);

      const data: RecognizeResponse = await apiRes.json();

      setSizeConfig({ gameRows, gameCols, maxVerticalHintRows, maxHorizontalHintCols });
      setOcrResult({
        verticalHint: data.verticalHintGrid.values,
        horizontalHint: data.horizontalHintGrid.values,
        verticalHintImage: data.verticalHintImage,
        horizontalHintImage: data.horizontalHintImage,
      });

      router.push("/confirm");
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }, [
    cropRegions, previewUrl, gameRows, gameCols,
    maxVerticalHintRows, maxHorizontalHintCols,
    setSizeConfig, setOcrResult, router,
  ]);

  return (
    <PageLayout
      currentStep={2}
      title="盤面サイズの指定"
      description={"盤面とヒント領域のサイズを\n指定してください"}
      onPrev={() => router.push("/crop")}
      onNext={handleSubmit}
      nextLoading={submitting}
      nextDisabled={submitting}
      sideActions={
        <Button
          variant="outline"
          colorPalette="gray"
          w="100%"
          onClick={handleReset}
          disabled={submitting}
        >
          リセット
        </Button>
      }
    >
      <SizeSettingBoard
        gameCols={gameCols}
        setGameCols={setGameCols}
        gameRows={gameRows}
        setGameRows={setGameRows}
        maxHorizontalHintCols={maxHorizontalHintCols}
        setMaxHorizontalHintCols={setMaxHorizontalHintCols}
        maxVerticalHintRows={maxVerticalHintRows}
        setMaxVerticalHintRows={setMaxVerticalHintRows}
      />
    </PageLayout>
  );
}
