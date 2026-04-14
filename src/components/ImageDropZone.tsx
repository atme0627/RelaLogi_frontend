"use client";

import { useRef, useState, useCallback } from "react";
import type { DragEvent, ChangeEvent } from "react";
import { Box, Text } from "@chakra-ui/react";
import { FiUpload } from "react-icons/fi";

type Props = {
  onSelect: (file: File) => void;
};

// 画像ファイルを選択・ドロップするためのゾーン
export function ImageDropZone({ onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith("image/")) {
        onSelect(file);
      }
    },
    [onSelect],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onSelect(file);
    },
    [onSelect],
  );

  return (
    <Box
      border="3px dashed"
      borderColor={isDragging ? "blue.400" : "gray.500"}
      borderRadius="xl"
      w="100%"
      px={12}
      py={12}
      textAlign="center"
      cursor="pointer"
      bg={isDragging ? "blue.50" : "transparent"}
      transition="all 0.2s"
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Box display="flex" justifyContent="center" mb={4} color="gray.400" fontSize="48px">
        <FiUpload />
      </Box>
      <Text color="gray.500" fontSize="lg">
        イラストロジックの画像をアップロード
      </Text>
      <Text color="gray.400" fontSize="sm" mt={2}>
        クリックまたはドラッグ＆ドロップ
      </Text>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleChange}
      />
    </Box>
  );
}
