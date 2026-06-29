"use client";

import { useRouter } from "next/navigation";
import { Box, Text } from "@chakra-ui/react";
import { Tiny5 } from "next/font/google";
import { GridBackground } from "@/components/GridBackground";
import { DemoBoard } from "@/components/DemoBoard";
import { FaArrowRight } from "react-icons/fa";

const tiny5 = Tiny5({ weight: "400", subsets: ["latin"] });

const benefits = [
  "塗りつぶし作業で手が疲れない",
  "仮置き・やり直しが自由自在",
  "イラストの仕上がりが綺麗に",
];

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

          {/* メリット箇条書き */}
          <Box
            display="flex"
            flexDirection="column"
            gap={3}
            alignItems="center"
          >
            {benefits.map((text) => (
              <Box
                key={text}
                display="flex"
                alignItems="center"
                gap={3}
              >
                <Box
                  w="8px"
                  h="8px"
                  bg="blue.400"
                  borderRadius="sm"
                  flexShrink={0}
                />
                <Text textStyle="body" color="gray.600" fontSize="lg">
                  {text}
                </Text>
              </Box>
            ))}
          </Box>

          {/* 写真 → デジタル化 */}
          <Box
            bg="white"
            borderWidth="1px"
            borderColor="gray.300"
            borderRadius="2xl"
            boxShadow="md"
            px={6}
            py={5}
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={10}
          >
            {/* 左: パズル写真（プレースホルダー） */}
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <Box
                w="200px"
                h="200px"
                borderRadius="lg"
                overflow="hidden"
                borderWidth="1px"
                borderColor="gray.200"
                boxShadow="sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logic-puzzle-grid.png"
                  alt="雑誌のイラストロジック"
                  width={200}
                  height={200}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
              <Text textStyle="caption" color="gray.500" fontSize="xs">
                雑誌のイラストロジック
              </Text>
            </Box>

            {/* 矢印 */}
            <Box color="blue.400" fontSize="48px" mx={6}>
              <FaArrowRight />
            </Box>

            {/* 右: デジタル盤面 */}
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <DemoBoard cellSize={26} />
              <Text textStyle="caption" color="gray.500" fontSize="xs">
                デジタル化してブラウザ上で解く
              </Text>
            </Box>
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
