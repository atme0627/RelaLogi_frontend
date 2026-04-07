"use client";

import { useState } from "react";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { SizeSettingBoard } from "@/components/SizeSettingBoard";

const DEFAULT_SIZE = 20;
const DEFAULT_HINT_SIZE = 6;

export default function SizePage() {
  const [gameRows, setGameRows] = useState(DEFAULT_SIZE);
  const [gameCols, setGameCols] = useState(DEFAULT_SIZE);
  const [maxVerticalHintRows, setMaxVerticalHintRows] = useState(DEFAULT_HINT_SIZE);
  const [maxHorizontalHintCols, setMaxHorizontalHintCols] = useState(DEFAULT_HINT_SIZE);

  const handleReset = () => {
    setGameRows(DEFAULT_SIZE);
    setGameCols(DEFAULT_SIZE);
    setMaxVerticalHintRows(DEFAULT_HINT_SIZE);
    setMaxHorizontalHintCols(DEFAULT_HINT_SIZE);
  };

  const handleSubmit = () => {
    // TODO: サイズ情報を次の画面に渡す
    console.log({
      gameRows,
      gameCols,
      maxVerticalHintRows,
      maxHorizontalHintCols,
    });
  };

  return (
    <Box
      w="100%"
      minH="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      gap={6}
      py={6}
    >
      <Box>
        <Heading size="2xl">盤面サイズの指定</Heading>
        <Text color="gray.500" mt={2} fontSize="md">
          盤面とヒント領域のサイズを指定してください
        </Text>
      </Box>

      {/* mainのmaxWidthを突き破って画面幅いっぱいに表示 */}
      <Box
        w="100vw"
        position="relative"
        left="50%"
        ml="-50vw"
      >
        <SizeSettingBoard
          gameCols={gameCols}
          setGameCols={setGameCols}
          gameRows={gameRows}
          setGameRows={setGameRows}
          maxHorizontalHintCols={maxHorizontalHintCols}
          setMaxHorizontalHintCols={setMaxHorizontalHintCols}
          maxVerticalHintRows={maxVerticalHintRows}
          setMaxVerticalHintRows={setMaxVerticalHintRows}
        />
      </Box>

      {/* ボタン */}
      <Box display="flex" justifyContent="space-evenly">
        <Button
          variant="outline"
          colorPalette="gray"
          w="120px"
          onClick={handleReset}
        >
          リセット
        </Button>
        <Button
          colorPalette="blue"
          fontWeight="bold"
          w="120px"
          onClick={handleSubmit}
        >
          決定
        </Button>
      </Box>
    </Box>
  );
}
