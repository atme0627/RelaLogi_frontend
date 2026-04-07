"use client";

import { Box, IconButton, Text } from "@chakra-ui/react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { NumberInput } from "./NumberInput";

type Props = {
  value: number;
  onChange: (v: number) => void;
  label: string;
  cellSize?: number;
  min?: number;
  max?: number;
  reverse?: boolean; // true: ブラケットが上側（横ヒント幅用）
};

// 列数を +/- で調整するUI（横方向レイアウト）
export function ColumnSetting({
  value,
  onChange,
  label,
  cellSize = 20,
  min = 2,
  max = 30,
  reverse = false,
}: Props) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));

  // ブラケット線（コの字型）
  const bracket = (
    <Box display="flex" alignItems="stretch" w={`calc(100% - ${cellSize}px)`} h="7px">
      <Box w="1px" bg="gray.400" />
      <Box flex={1} borderTop={reverse ? undefined : "1px solid"} borderBottom={reverse ? "1px solid" : undefined} borderColor="gray.400" />
      <Box w="1px" bg="gray.400" />
    </Box>
  );

  const controls = (
    <Box display="flex" alignItems="center" justifyContent="center" gap={0}>
      <IconButton
        aria-label="減らす"
        size="2xs"
        variant="ghost"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
      >
        <FiMinus />
      </IconButton>
      <NumberInput value={value} onChange={onChange} min={min} max={max} />
      <IconButton
        aria-label="増やす"
        size="2xs"
        variant="ghost"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
      >
        <FiPlus />
      </IconButton>
    </Box>
  );

  return (
    <Box
      display="flex"
      flexDirection={reverse ? "column-reverse" : "column"}
      alignItems="center"
      justifyContent="flex-end"
      pb={1}
    >
      <Text fontSize="2xs" color="gray.500" lineHeight="1">
        {label}
      </Text>
      {controls}
      {bracket}
    </Box>
  );
}
