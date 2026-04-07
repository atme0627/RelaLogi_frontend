"use client";

import { Box } from "@chakra-ui/react";
import { BoardGrid } from "./BoardGrid";
import { HintBoard } from "./HintBoard";

type Props = {
  gameCols: number;
  gameRows: number;
  maxHorizontalHintCols: number;
  maxVerticalHintRows: number;
  verticalHint: string[][];
  horizontalHint: string[][];
  onVerticalHintChange: (row: number, col: number, value: string) => void;
  onHorizontalHintChange: (row: number, col: number, value: string) => void;
  verticalHintImage?: string;
  horizontalHintImage?: string;
  cellSize?: number;
};

// 確認画面用の盤面レイアウト（SizeSettingBoardと同じ配置、設定UIの代わりにHintBoard）
export function ConfirmBoard({
  gameCols,
  gameRows,
  maxHorizontalHintCols,
  maxVerticalHintRows,
  verticalHint,
  horizontalHint,
  onVerticalHintChange,
  onHorizontalHintChange,
  verticalHintImage,
  horizontalHintImage,
  cellSize = 20,
}: Props) {
  return (
    <Box display="flex" justifyContent="center">
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
        <HintBoard
          rows={maxVerticalHintRows}
          cols={gameCols}
          cellSize={cellSize}
          values={verticalHint}
          onChange={onVerticalHintChange}
          backgroundImage={verticalHintImage}
          borderRadius={{ topLeft: true, topRight: true }}
        />

        {/* Row 2, Col 1: 横ヒント盤面（左側） */}
        <HintBoard
          rows={gameRows}
          cols={maxHorizontalHintCols}
          cellSize={cellSize}
          values={horizontalHint}
          onChange={onHorizontalHintChange}
          backgroundImage={horizontalHintImage}
          borderRadius={{ topLeft: true, bottomLeft: true }}
        />

        {/* Row 2, Col 2: ゲーム盤面（右下） */}
        <BoardGrid
          rows={gameRows}
          cols={gameCols}
          cellSize={cellSize}
          variant="game"
          borderRadius={{ bottomRight: true }}
        />
      </Box>
    </Box>
  );
}
