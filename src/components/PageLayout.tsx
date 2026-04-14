"use client";

import { ReactNode } from "react";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { Tiny5 } from "next/font/google";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { motion } from "framer-motion";
import { StepIndicator } from "./StepIndicator";
import { GridBackground } from "./GridBackground";
import { useNavigationDirection } from "@/contexts/NavigationContext";

const tiny5 = Tiny5({ weight: "400", subsets: ["latin"] });

type Props = {
  currentStep?: number;
  title: string;
  description?: string;
  onPrev?: () => void;
  onNext?: () => void;
  nextLoading?: boolean;
  nextDisabled?: boolean;
  sideActions?: ReactNode;
  children: ReactNode;
};

export function PageLayout({
  currentStep,
  title,
  description,
  onPrev,
  onNext,
  nextLoading,
  nextDisabled,
  sideActions,
  children,
}: Props) {
  const direction = useNavigationDirection();
  const xOffset =
    direction === "forward" ? 60 : direction === "backward" ? -60 : 0;

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
        {/* ログイン（将来実装） */}
        <Box />
      </Box>

      {/* メインエリア: 全体に均等パディング */}
      <Box flex={1} h={0} display="flex" overflow="hidden" p={4} gap={4} bg="gray.100" position="relative">
        <GridBackground />
        {/* 左サイドバー */}
        <Box
          w="25%"
          flexShrink={0}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          gap={4}
          p={8}
          bg="white"
          borderRadius="2xl"
          borderWidth="1px"
          borderColor="gray.300"
          boxShadow="md"
          position="relative"
          zIndex={1}
        >
          {currentStep !== undefined && (
            <Box mb={4}>
              <StepIndicator totalSteps={4} currentStep={currentStep} />
            </Box>
          )}
          <Text textStyle="heading">
            {title}
          </Text>
          {description && (
            <Text textStyle="caption" whiteSpace="pre-line">
              {description}
            </Text>
          )}
          {sideActions && <Box mt={2}>{sideActions}</Box>}
        </Box>

        {/* メインコンテンツ + 矢印 */}
        <Box
          flex={4}
          h="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={8}
          py={12}
          px={4}
          position="relative"
          zIndex={1}
        >
          {/* 戻るボタン */}
          <Box flexShrink={0}>
            {onPrev ? (
              <IconButton
                aria-label="前へ"
                variant="solid"
                bg="white"
                color="gray.600"
                _hover={{ bg: "gray.50" }}
                size="lg"
                rounded="full"
                boxShadow="md"
                onClick={onPrev}
              >
                <LuChevronLeft />
              </IconButton>
            ) : (
              <Box w="40px" />
            )}
          </Box>

          {/* コンテンツ（遷移アニメーション付き） */}
          <motion.div
            initial={{ opacity: 0, x: xOffset }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              flex: 1,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {children}
          </motion.div>

          {/* 次へボタン */}
          <Box flexShrink={0}>
            {onNext ? (
              <IconButton
                aria-label="次へ"
                size="lg"
                rounded="full"
                onClick={onNext}
                loading={nextLoading}
                disabled={nextDisabled}
                boxShadow={nextDisabled ? "none" : "md"}
                {...(nextDisabled
                  ? { variant: "ghost" }
                  : { bg: "blue.500", color: "white", _hover: { bg: "blue.600" } }
                )}
              >
                <LuChevronRight />
              </IconButton>
            ) : (
              <Box w="40px" />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
