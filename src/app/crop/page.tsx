"use client";

import { useState, useCallback, useRef } from "react";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { StepIndicator } from "@/components/StepIndicator";
import { CropEditor } from "@/components/CropEditor";
import type { Quad } from "@/components/CropEditor";
import { usePuzzleImage } from "@/contexts/PuzzleImageContext";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

export default function CropPage() {
  const { previewUrl } = usePuzzleImage();
  const [resetKey, setResetKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const regionsRef = useRef<[Quad, Quad] | null>(null);

  const handleRegionsChange = useCallback((regions: [Quad, Quad]) => {
    regionsRef.current = regions;
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!regionsRef.current || !previewUrl) return;

    setSubmitting(true);
    try {
      // previewUrl(Object URL)から画像Blobを取得
      const res = await fetch(previewUrl);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append("image", blob, "puzzle.png");
      formData.append("verticalHintRegion", JSON.stringify(regionsRef.current[0]));
      formData.append("horizontalHintRegion", JSON.stringify(regionsRef.current[1]));

      const apiRes = await fetch(`${API_BASE}/api/puzzles/crop`, {
        method: "POST",
        body: formData,
      });

      if (!apiRes.ok) throw new Error(`送信失敗 (${apiRes.status})`);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }, [previewUrl]);

  return (
    <Box
      w="100%"
      h="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      gap={6}
    >
      {/* インジケーター + テキスト */}
      <Box>
        <Box display="flex" justifyContent="center" mb={4}>
          <StepIndicator totalSteps={3} currentStep={1} />
        </Box>
        <Heading size="2xl">ヒント領域の選択</Heading>
        <Text color="gray.500" mt={2} fontSize="md">
          縦ヒント・横ヒントの領域をそれぞれ指定してください
        </Text>
      </Box>

      {/* 切り抜きエディタ */}
      <CropEditor key={resetKey} onRegionsChange={handleRegionsChange} />

      {/* ボタン */}
      <Box display="flex" justifyContent="space-evenly">
        <Button
          variant="outline"
          colorPalette="gray"
          w="120px"
          onClick={() => setResetKey((k) => k + 1)}
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
