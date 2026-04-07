"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { SizeSettingBoard } from "@/components/SizeSettingBoard";
import { usePuzzleImage } from "@/contexts/PuzzleImageContext";
import { usePuzzleData } from "@/contexts/PuzzleDataContext";

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
      // previewUrl(Object URL)から画像Blobを取得
      const res = await fetch(previewUrl);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append("image", blob, "puzzle.png");
      formData.append("verticalHintRegion", JSON.stringify({
        rows: maxVerticalHintRows,
        cols: gameCols,
        vertices: cropRegions[0],
      }));
      formData.append("horizontalHintRegion", JSON.stringify({
        rows: gameRows,
        cols: maxHorizontalHintCols,
        vertices: cropRegions[1],
      }));

      const apiRes = await fetch(`${API_BASE}/api/puzzles/crop`, {
        method: "POST",
        body: formData,
      });

      if (!apiRes.ok) throw new Error(`送信失敗 (${apiRes.status})`);

      const data = await apiRes.json();

      setSizeConfig({ gameRows, gameCols, maxVerticalHintRows, maxHorizontalHintCols });
      setOcrResult({
        verticalHint: data.vertical_hint,
        horizontalHint: data.horizontal_hint,
        verticalHintImage: data.vertical_hint_image,
        horizontalHintImage: data.horizontal_hint_image,
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
        <Heading size="2xl">盤面サイズの指定</Heading>
        <Text color="gray.500" mt={2} fontSize="md">
          盤面とヒント領域のサイズを指定してください
        </Text>
      </Box>

      {/* mainのmaxWidthを突き破って画面幅いっぱいに表示 */}
      <Box
        w="100vw"
        position="relative"
        left="50%"
        ml="-50vw"
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
      </Box>

      {/* ボタン */}
      <Box display="flex" justifyContent="space-evenly">
        <Button
          variant="outline"
          colorPalette="gray"
          w="120px"
          onClick={handleReset}
          disabled={submitting}
        >
          リセット
        </Button>
        <Button
          colorPalette="blue"
          fontWeight="bold"
          w="120px"
          onClick={handleSubmit}
          loading={submitting}
          disabled={submitting}
        >
          決定
        </Button>
      </Box>
    </Box>
  );
}
