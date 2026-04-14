"use client";

import { ReactNode } from "react";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { Tiny5 } from "next/font/google";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { StepIndicator } from "./StepIndicator";

const tiny5 = Tiny5({ weight: "400", subsets: ["latin"] });

type Props = {
  currentStep?: number;
  title: string;
  description: string;
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
      <Box flex={1} h={0} display="flex" overflow="hidden" p={4} gap={4}>
        {/* 左サイドバー */}
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          gap={4}
          p={4}
        >
          {currentStep !== undefined && (
            <Box mb={4}>
              <StepIndicator totalSteps={4} currentStep={currentStep} />
            </Box>
          )}
          <Text fontSize="xl" fontWeight="bold">
            {title}
          </Text>
          <Text color="gray.500" fontSize="sm">
            {description}
          </Text>
          {sideActions && <Box mt={2}>{sideActions}</Box>}
        </Box>

        {/* メインコンテンツ + 矢印 */}
        <Box
          flex={2}
          h="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          {/* 戻るボタン */}
          <Box flexShrink={0}>
            {onPrev ? (
              <IconButton
                aria-label="前へ"
                variant="ghost"
                size="lg"
                rounded="full"
                onClick={onPrev}
              >
                <LuChevronLeft />
              </IconButton>
            ) : (
              <Box w="40px" />
            )}
          </Box>

          <Box flex={1} h="100%" overflow="hidden" borderRadius="xl" display="flex" alignItems="center" justifyContent="center" p={4}>
            {children}
          </Box>

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
