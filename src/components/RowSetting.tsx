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
  reverse?: boolean; // true: ブラケットが左側（縦ヒント高さ用）
};

// 行数を +/- で調整するUI（縦方向レイアウト）
export function RowSetting({
  value,
  onChange,
  label,
  cellSize = 20,
  min = 2,
  max = 30,
  reverse = false,
}: Props) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));

  // ブラケット線（コの字型、縦版）
  const bracket = (
    <Box display="flex" flexDirection="column" alignItems="stretch" h={`calc(100% - ${cellSize}px)`} w="7px">
      <Box h="1px" bg="gray.400" />
      <Box flex={1} borderLeft={reverse ? undefined : "1px solid"} borderRight={reverse ? "1px solid" : undefined} borderColor="gray.400" />
      <Box h="1px" bg="gray.400" />
    </Box>
  );

  const controls = (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={0}>
      <IconButton
        aria-label="増やす"
        size="2xs"
        variant="ghost"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
      >
        <FiPlus />
      </IconButton>
      <NumberInput value={value} onChange={onChange} min={min} max={max} />
      <IconButton
        aria-label="減らす"
        size="2xs"
        variant="ghost"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
      >
        <FiMinus />
      </IconButton>
    </Box>
  );

  return (
    <Box
      display="flex"
      flexDirection={reverse ? "row-reverse" : "row"}
      alignItems="center"
      justifyContent="flex-end"
      pr={reverse ? 0 : 1}
      pl={reverse ? 1 : 0}
    >
      <Text
        fontSize="2xs"
        color="gray.500"
        lineHeight="1"
        style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
        whiteSpace="nowrap"
        mr={reverse ? 0 : 0.5}
        ml={reverse ? 0.5 : 0}
      >
        {label}
      </Text>
      {controls}
      {bracket}
    </Box>
  );
}
