"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Text } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import Image from "next/image";
import { ImageDropZone } from "@/components/ImageDropZone";
import { usePuzzleImage } from "@/contexts/PuzzleImageContext";
import { mockPreviewUrl, mockFile } from "@/mocks/dev-defaults";

// 画像選択 → プレビュー → 次画面への遷移を管理
export function ImageUploader() {
  const router = useRouter();
  const { setPreviewUrl: sharePuzzleImage } = usePuzzleImage();

  const [file, setFile] = useState<File | null>(mockFile);
  const [previewUrl, setPreviewUrl] = useState(mockPreviewUrl);

  const handleSelect = useCallback((selected: File) => {
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }, []);

  const handleReset = useCallback(() => {
    setFile(null);
    setPreviewUrl("");
  }, []);

  const handleNext = useCallback(() => {
    if (!previewUrl) return;
    sharePuzzleImage(previewUrl);
    router.push("/crop");
  }, [previewUrl, sharePuzzleImage, router]);

  // 未選択時：ドロップゾーン、選択後：ファイル情報 — 同じ点線枠内で切り替え
  if (!file) {
    return <ImageDropZone onSelect={handleSelect} />;
  }

  const fileSize = (file.size / 1024).toFixed(1);

  return (
    <Box w="100%" display="flex" flexDirection="column" gap={4}>
      {/* ファイル情報カード */}
      <Box
        display="flex"
        alignItems="center"
        gap={3}
        p={4}
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        bg="gray.50"
      >
        <Box
          w="48px"
          h="48px"
          borderRadius="md"
          overflow="hidden"
          flexShrink={0}
        >
          <Image
            src={previewUrl}
            alt="サムネイル"
            width={48}
            height={48}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
        <Box flex={1} overflow="hidden">
          <Text fontWeight="bold" truncate>{file.name}</Text>
          <Text fontSize="sm" color="gray.500">{fileSize} KB</Text>
        </Box>
        <Box
          as="button"
          color="gray.400"
          fontSize="20px"
          cursor="pointer"
          onClick={handleReset}
          _hover={{ color: "gray.600" }}
        >
          <FiX />
        </Box>
      </Box>

      {/* 次へボタン */}
      <Box display="flex" justifyContent="center">
        <Button
          colorPalette="blue"
          fontWeight="bold"
          onClick={handleNext}
        >
          次へ
        </Button>
      </Box>
    </Box>
  );
}
