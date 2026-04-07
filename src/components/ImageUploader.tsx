"use client";

import { useState, useCallback } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import Image from "next/image";
import { ImageDropZone } from "@/components/ImageDropZone";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

type UploadStatus = "idle" | "uploading" | "success" | "error";

// 画像選択 → プレビュー → アップロードの一連のフローを管理
export function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [previewUrl, setPreviewUrl] = useState("");

  const handleSelect = useCallback((selected: File) => {
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setStatus("idle");
    setErrorMessage("");
  }, []);

  const handleReset = useCallback(() => {
    setFile(null);
    setStatus("idle");
    setErrorMessage("");
  }, []);

  const handleUpload = useCallback(async () => {
    if (!file) return;

    setStatus("uploading");
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${API_BASE}/api/puzzles/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`アップロード失敗 (${res.status})`);

      setStatus("success");
    } catch (e) {
      setStatus("error");
      setErrorMessage(e instanceof Error ? e.message : "不明なエラー");
    }
  }, [file]);

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

      {/* アップロードボタン */}
      <Box display="flex" justifyContent="center">
        <Button
          colorPalette="blue"
          fontWeight="bold"
          onClick={handleUpload}
          loading={status === "uploading"}
          disabled={status === "uploading"}
        >
          アップロード
        </Button>
      </Box>

      {status === "success" && (
        <Text color="green.500" textAlign="center">アップロードが完了しました</Text>
      )}
      {status === "error" && (
        <Text color="red.500" textAlign="center">{errorMessage}</Text>
      )}
    </Box>
  );
}
