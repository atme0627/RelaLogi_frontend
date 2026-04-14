"use client";

import { Box } from "@chakra-ui/react";

type Props = {
  totalSteps: number;
  currentStep: number;
};

// 現在のステップを視覚的に示すインジケーター
export function StepIndicator({ totalSteps, currentStep }: Props) {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" gap={0}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const isActive = i === currentStep;
        const isCompleted = i < currentStep;

        return (
          <Box key={i} display="flex" alignItems="center" flex={i > 0 ? 1 : undefined}>
            {i > 0 && (
              <Box
                flex={1}
                h="2px"
                bg={isCompleted || isActive ? "blue.400" : "gray.200"}
              />
            )}
            <Box
              w="28px"
              h="28px"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={isCompleted || isActive ? "blue.500" : "gray.200"}
              color="white"
              fontSize="xs"
              fontWeight="bold"
            >
              {isCompleted ? "✓" : i + 1}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
