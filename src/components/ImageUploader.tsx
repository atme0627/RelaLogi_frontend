"use client";

import { useState, useCallback, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import Image from "next/image";
import { ImageDropZone } from "@/components/ImageDropZone";
import { usePuzzleImage } from "@/contexts/PuzzleImageContext";
import { mockPreviewUrl, mockFile } from "@/mocks/dev-defaults";

// 画像選択 → プレビュー表示を管理
export function ImageUploader() {
  const { setPreviewUrl: sharePuzzleImage } = usePuzzleImage();

  const [file, setFile] = useState<File | null>(mockFile);
  const [previewUrl, setPreviewUrl] = useState(mockPreviewUrl);

  // mock初期値をcontextに共有
  useEffect(() => {
    if (mockPreviewUrl) sharePuzzleImage(mockPreviewUrl);
  }, [sharePuzzleImage]);

  const handleSelect = useCallback((selected: File) => {
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    sharePuzzleImage(url);
  }, [sharePuzzleImage]);

  const handleReset = useCallback(() => {
    setFile(null);
    setPreviewUrl("");
    sharePuzzleImage("");
  }, [sharePuzzleImage]);

  if (!file) {
    return (
      <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.300" boxShadow="md" p={4}>
        <ImageDropZone onSelect={handleSelect} />
      </Box>
    );
  }

  const fileSize = (file.size / 1024).toFixed(1);

  return (
    <Box position="relative">
      <Box
        as="button"
        position="absolute"
        top={-3}
        right={-3}
        zIndex={1}
        bg="gray.500"
        color="white"
        borderRadius="full"
        w="28px"
        h="28px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        onClick={handleReset}
        _hover={{ bg: "gray.700" }}
        fontSize="14px"
      >
        <FiX />
      </Box>
      <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.300" boxShadow="md" p={4} display="flex" flexDirection="column" alignItems="center" gap={3}>
        <Box borderRadius="lg" overflow="hidden">
          <Image
            src={previewUrl}
            alt="プレビュー"
            width={240}
            height={240}
            style={{ width: "240px", height: "auto", display: "block", objectFit: "contain" }}
          />
        </Box>
        <Box textAlign="center">
          <Text fontWeight="bold" fontSize="sm" truncate>{file.name}</Text>
          <Text textStyle="caption" color="gray.500">{fileSize} KB</Text>
        </Box>
      </Box>
    </Box>
  );
}
