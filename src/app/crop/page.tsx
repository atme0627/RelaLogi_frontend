"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Box, Button } from "@chakra-ui/react";
import { PageLayout } from "@/components/PageLayout";
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
    <PageLayout
      currentStep={1}
      title="ヒント領域の選択"
      description={"縦ヒント・横ヒントの領域を\nそれぞれ指定してください"}
      onPrev={() => router.push("/")}
      onNext={handleSubmit}
      sideActions={
        <Button
          variant="outline"
          colorPalette="gray"
          w="100%"
          onClick={() => setResetKey((k) => k + 1)}
        >
          リセット
        </Button>
      }
    >
      <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.300" boxShadow="md" p={4} h="100%" overflow="hidden">
        <CropEditor key={resetKey} onRegionsChange={handleRegionsChange} />
      </Box>
    </PageLayout>
  );
}
