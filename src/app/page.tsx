"use client";

import { Box, Text } from "@chakra-ui/react";
import { Tiny5 } from "next/font/google";
import { ImageUploader } from "@/components/ImageUploader";
import { StepIndicator } from "@/components/StepIndicator";

const tiny5 = Tiny5({ weight: "400", subsets: ["latin"] });

// トップページ（ロゴ + アップロード機能）
export default function Home() {
  return (
    <Box
      w="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      pt={12}
      pb={8}
    >
      {/* ロゴ */}
      <Text
        className={tiny5.className}
        fontSize="48px"
        lineHeight="1.2"
        color="gray.600"
      >
        RELALOGI
      </Text>

      {/* 説明文 */}
      <Text color="gray.400" mt={3} mb={8} fontSize="sm" textAlign="center">
        写真を撮るだけでイラストロジックを電子化。
        <br />
        いつでもどこでもブラウザで楽しめます。
      </Text>

      {/* ステップインジケーター */}
      <Box mb={8}>
        <StepIndicator totalSteps={4} currentStep={0} />
      </Box>

      {/* 見出し */}
      <Box w="100%" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          画像アップロード
        </Text>
        <Text color="gray.500" mt={2} fontSize="md">
          イラストロジックの画像を選択してください
        </Text>
      </Box>

      {/* ドロップゾーン / プレビュー */}
      <Box w="100%">
        <ImageUploader />
      </Box>
    </Box>
  );
}
