"use client";

import { Box } from "@chakra-ui/react";
import { BoardGrid } from "./BoardGrid";
import { ColumnSetting } from "./ColumnSetting";
import { RowSetting } from "./RowSetting";

type Props = {
  gameCols: number;
  setGameCols: (v: number) => void;
  gameRows: number;
  setGameRows: (v: number) => void;
  maxHorizontalHintCols: number;
  setMaxHorizontalHintCols: (v: number) => void;
  maxVerticalHintRows: number;
  setMaxVerticalHintRows: (v: number) => void;
  cellSize?: number;
};

// 4×4グリッドで盤面とサイズ設定UIを配置するコンポーネント
export function SizeSettingBoard({
  gameCols,
  setGameCols,
  gameRows,
  setGameRows,
  maxHorizontalHintCols,
  setMaxHorizontalHintCols,
  maxVerticalHintRows,
  setMaxVerticalHintRows,
  cellSize = 20,
}: Props) {
  return (
    <Box display="flex" justifyContent="center">
      <Box
        display="grid"
        style={{
          gridTemplateColumns: `auto ${cellSize * maxHorizontalHintCols}px ${cellSize * gameCols}px auto`,
          gridTemplateRows: `auto ${cellSize * maxVerticalHintRows}px ${cellSize * gameRows}px auto`,
        }}
      >
        {/* Row 1, Col 1: 空 */}
        <Box />
        {/* Row 1, Col 2: 空 */}
        <Box />
        {/* Row 1, Col 3: パズル幅設定 */}
        <ColumnSetting
          value={gameCols}
          onChange={setGameCols}
          label="パズルの幅"
          cellSize={cellSize}
        />
        {/* Row 1, Col 4: 空 */}
        <Box />

        {/* Row 2, Col 1: 空 */}
        <Box />
        {/* Row 2, Col 2: 横ヒント幅設定 */}
        <ColumnSetting
          value={maxHorizontalHintCols}
          onChange={setMaxHorizontalHintCols}
          label="横ヒントの幅"
          cellSize={cellSize}
        />
        {/* Row 2, Col 3: 縦ヒント盤面 */}
        <BoardGrid
          rows={maxVerticalHintRows}
          cols={gameCols}
          cellSize={cellSize}
          variant="hint"
          borderRadius={{ topLeft: true, topRight: true }}
        />
        {/* Row 2, Col 4: 縦ヒント高さ設定 */}
        <RowSetting
          value={maxVerticalHintRows}
          onChange={setMaxVerticalHintRows}
          label="縦ヒントの高さ"
          cellSize={cellSize}
          reverse
        />

        {/* Row 3, Col 1: パズル高さ設定 */}
        <RowSetting
          value={gameRows}
          onChange={setGameRows}
          label="パズルの高さ"
          cellSize={cellSize}
        />
        {/* Row 3, Col 2: 横ヒント盤面 */}
        <BoardGrid
          rows={gameRows}
          cols={maxHorizontalHintCols}
          cellSize={cellSize}
          variant="hint"
          borderRadius={{ topLeft: true, bottomLeft: true }}
        />
        {/* Row 3, Col 3: ゲーム盤面 */}
        <BoardGrid
          rows={gameRows}
          cols={gameCols}
          cellSize={cellSize}
          variant="game"
          borderRadius={{ bottomRight: true }}
        />
        {/* Row 3, Col 4: 空 */}
        <Box />

        {/* Row 4, Col 1: 空 */}
        <Box />
        {/* Row 4, Col 2: 空 */}
        <Box />
        {/* Row 4, Col 3: 空 */}
        <Box />
        {/* Row 4, Col 4: 空 */}
        <Box />
      </Box>
    </Box>
  );
}
