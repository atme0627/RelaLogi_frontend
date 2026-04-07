"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { StepIndicator } from "@/components/StepIndicator";
import { CropEditor } from "@/components/CropEditor";
import type { Quad } from "@/types/puzzle";
import { usePuzzleImage } from "@/contexts/PuzzleImageContext";
import { usePuzzleData } from "@/contexts/PuzzleDataContext";

export default function CropPage() {
  const router = useRouter();
  const { previewUrl } = usePuzzleImage();
  const { setCropRegions } = usePuzzleData();
  const [resetKey, setResetKey] = useState(0);
  const regionsRef = useRef<[Quad, Quad] | null>(null);

  const handleRegionsChange = useCallback((regions: [Quad, Quad]) => {
    regionsRef.current = regions;
  }, []);

  const handleSubmit = useCallback(() => {
    if (!regionsRef.current || !previewUrl) return;
    setCropRegions(regionsRef.current);
    router.push("/size");
  }, [previewUrl, setCropRegions, router]);

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
          <StepIndicator totalSteps={4} currentStep={1} />
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
        >
          リセット
        </Button>
        <Button
          colorPalette="blue"
          fontWeight="bold"
          w="120px"
          onClick={handleSubmit}
        >
          決定
        </Button>
      </Box>
    </Box>
  );
}
