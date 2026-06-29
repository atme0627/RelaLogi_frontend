"use client";

import { useRouter } from "next/navigation";
import { Box, Text } from "@chakra-ui/react";
import { Tiny5 } from "next/font/google";
import { GridBackground } from "@/components/GridBackground";

const tiny5 = Tiny5({ weight: "400", subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  return (
    <Box h="100vh" display="flex" flexDirection="column" overflow="hidden">
      {/* ヘッダー */}
      <Box
        as="header"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={6}
        py={2}
        flexShrink={0}
        bg="gray.200"
        borderBottomWidth="1px"
        borderColor="gray.400"
        boxShadow="sm"
      >
        <Text
          className={tiny5.className}
          fontSize="32px"
          lineHeight="1"
          color="gray.600"
        >
          RELALOGI
        </Text>
        <Box />
      </Box>

      {/* メインエリア */}
      <Box
        flex={1}
        overflow="auto"
        bg="gray.100"
        position="relative"
      >
        <GridBackground />

        {/* コンテンツ */}
        <Box
          position="relative"
          zIndex={1}
          display="flex"
          flexDirection="column"
          alignItems="center"
          px={4}
          py={16}
          gap={12}
        >
          {/* ロゴ */}
          <Box textAlign="center">
            <Text
              className={tiny5.className}
              fontSize="120px"
              lineHeight="1"
              color="gray.700"
              letterSpacing="0.05em"
            >
              RELALOGI
            </Text>
            <Text
              mt={4}
              textStyle="body"
              color="gray.500"
              fontSize="md"
            >
              雑誌のイラストロジックを画像からデジタル化して、ブラウザ上で解く
            </Text>
          </Box>

          {/* はじめるボタン */}
          <Box
            as="button"
            onClick={() => router.push("/upload")}
            bg="blue.500"
            color="white"
            px={10}
            py={3}
            borderRadius="full"
            fontWeight="bold"
            fontSize="lg"
            boxShadow="md"
            cursor="pointer"
            _hover={{ bg: "blue.600" }}
            transition="background 0.2s"
          >
            はじめる
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
