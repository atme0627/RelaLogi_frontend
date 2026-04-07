"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Box } from "@chakra-ui/react";
import { BoardGrid } from "./BoardGrid";
import { ColumnSetting } from "./ColumnSetting";
import { RowSetting } from "./RowSetting";
import { usePuzzleData } from "@/contexts/PuzzleDataContext";

type Props = {
  gameCols: number;
  setGameCols: (v: number) => void;
  gameRows: number;
  setGameRows: (v: number) => void;
  maxHorizontalHintCols: number;
  setMaxHorizontalHintCols: (v: number) => void;
  maxVerticalHintRows: number;
  setMaxVerticalHintRows: (v: number) => void;
};

// 設定UIの高さ/幅の概算（ColumnSetting/RowSettingが占める領域）
const SETTING_UI_SIZE = 60;
const MAX_CELL_SIZE = 20;
const MIN_CELL_SIZE = 6;

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
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerSizeRef = useRef({ w: 0, h: 0 });
  const valuesRef = useRef({ gameCols, gameRows, maxHorizontalHintCols, maxVerticalHintRows });
  valuesRef.current = { gameCols, gameRows, maxHorizontalHintCols, maxVerticalHintRows };
  const { setCellSize: setSharedCellSize } = usePuzzleData();
  const [cellSize, setCellSize] = useState(MAX_CELL_SIZE);

  const recalc = useCallback(() => {
    const { w, h } = containerSizeRef.current;
    if (w === 0 || h === 0) return;
    const v = valuesRef.current;
    const availW = w - SETTING_UI_SIZE * 2;
    const availH = h - SETTING_UI_SIZE * 2;
    const totalCols = v.gameCols + v.maxHorizontalHintCols;
    const totalRows = v.gameRows + v.maxVerticalHintRows;
    const fitW = availW / totalCols;
    const fitH = availH / totalRows;
    const size = Math.max(MIN_CELL_SIZE, Math.min(MAX_CELL_SIZE, Math.floor(Math.min(fitW, fitH))));
    setCellSize(size);
    setSharedCellSize(size);
  }, [setSharedCellSize]);

  // コンテナリサイズ時のみcellSizeを再計算
  useEffect(() => {
    if (!containerRef.current) return;

    const update = () => {
      const el = containerRef.current;
      if (!el) return;
      containerSizeRef.current = { w: el.clientWidth, h: el.clientHeight };
      recalc();
    };

    const observer = new ResizeObserver(update);
    observer.observe(containerRef.current);
    update();
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 値変更時はデバウンスして再計算（連打中のガタつき防止）
  useEffect(() => {
    const timer = setTimeout(recalc, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameCols, gameRows, maxHorizontalHintCols, maxVerticalHintRows]);

  return (
    <Box ref={containerRef} w="100%" h="100%" display="flex" alignItems="center" justifyContent="center">
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
        <Box overflow="visible">
          <BoardGrid
            rows={maxVerticalHintRows}
            cols={gameCols}
            cellSize={cellSize}
            variant="hint"
            borderRadius={{ topLeft: true, topRight: true }}
          />
        </Box>
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
        <Box overflow="visible">
          <BoardGrid
            rows={gameRows}
            cols={maxHorizontalHintCols}
            cellSize={cellSize}
            variant="hint"
            borderRadius={{ topLeft: true, bottomLeft: true }}
          />
        </Box>
        {/* Row 3, Col 3: ゲーム盤面 */}
        <Box overflow="visible">
          <BoardGrid
            rows={gameRows}
            cols={gameCols}
            cellSize={cellSize}
            variant="game"
            borderRadius={{ bottomRight: true }}
          />
        </Box>
        {/* Row 3, Col 4: 空 */}
        <Box />

        {/* Row 4 */}
        <Box />
        <Box />
        <Box />
        <Box />
      </Box>
    </Box>
  );
}
