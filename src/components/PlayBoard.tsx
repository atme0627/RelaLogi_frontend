"use client";

import { Box } from "@chakra-ui/react";
import { PlayableGameBoard } from "./PlayableGameBoard";
import { PlayableHintBoard } from "./PlayableHintBoard";
import { useCellSize } from "@/hooks/useCellSize";
import type { CellState } from "@/types/puzzle";

type Props = {
  gameCols: number;
  gameRows: number;
  maxHorizontalHintCols: number;
  maxVerticalHintRows: number;
  verticalHint: string[][];
  horizontalHint: string[][];
  cells: CellState[][];
  onCellChange: (row: number, col: number, state: CellState) => void;
  verticalGrayedOut: boolean[][];
  horizontalGrayedOut: boolean[][];
  onToggleVerticalGray: (row: number, col: number) => void;
  onToggleHorizontalGray: (row: number, col: number) => void;
};

// プレイ画面用の盤面レイアウト（ConfirmBoardと同じ配置構成）
export function PlayBoard({
  gameCols,
  gameRows,
  maxHorizontalHintCols,
  maxVerticalHintRows,
  verticalHint,
  horizontalHint,
  cells,
  onCellChange,
  verticalGrayedOut,
  horizontalGrayedOut,
  onToggleVerticalGray,
  onToggleHorizontalGray,
}: Props) {
  const { containerRef, cellSize } = useCellSize({
    gameCols,
    gameRows,
    maxHorizontalHintCols,
    maxVerticalHintRows,
  });

  return (
    <Box ref={containerRef} w="100%" h="100%" display="flex" alignItems="center" justifyContent="center">
      <Box bg="white" borderRadius="xl" boxShadow="md" p={4}>
      <Box
        display="grid"
        style={{
          gridTemplateColumns: `${cellSize * maxHorizontalHintCols}px ${cellSize * gameCols}px`,
          gridTemplateRows: `${cellSize * maxVerticalHintRows}px ${cellSize * gameRows}px`,
        }}
      >
        {/* Row 1, Col 1: 空（左上の角） */}
        <Box />

        {/* Row 1, Col 2: 縦ヒント盤面（上側） */}
        <PlayableHintBoard
          rows={maxVerticalHintRows}
          cols={gameCols}
          cellSize={cellSize}
          values={verticalHint}
          grayedOut={verticalGrayedOut}
          onToggleGray={onToggleVerticalGray}
          borderRadius={{ topLeft: true, topRight: true }}
        />

        {/* Row 2, Col 1: 横ヒント盤面（左側） */}
        <PlayableHintBoard
          rows={gameRows}
          cols={maxHorizontalHintCols}
          cellSize={cellSize}
          values={horizontalHint}
          grayedOut={horizontalGrayedOut}
          onToggleGray={onToggleHorizontalGray}
          borderRadius={{ topLeft: true, bottomLeft: true }}
        />

        {/* Row 2, Col 2: ゲーム盤面（右下） */}
        <PlayableGameBoard
          rows={gameRows}
          cols={gameCols}
          cellSize={cellSize}
          cells={cells}
          onCellChange={onCellChange}
        />
      </Box>
      </Box>
    </Box>
  );
}
