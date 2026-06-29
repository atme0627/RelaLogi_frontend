"use client";

import { BoardGrid } from "./BoardGrid";
import type { CellState } from "@/types/puzzle";

const DEMO_GAME_ROWS = 5;
const DEMO_GAME_COLS = 5;

// 解答済みセル
const DEMO_CELLS: CellState[][] = [
  ["empty", "filled", "empty", "filled", "empty"],
  ["empty", "filled", "empty", "filled", "empty"],
  ["empty", "empty", "empty", "empty", "empty"],
  ["filled", "empty", "empty", "empty", "filled"],
  ["empty", "filled", "filled", "filled", "empty"],
];

// 縦ヒント（上側）- 2行 x 5列
const DEMO_VERTICAL_HINT: string[][] = [
  ["", "2", "", "2", ""],
  ["1", "1", "1", "1", "1"],
];

// 横ヒント（左側）- 5行 x 2列
const DEMO_HORIZONTAL_HINT: string[][] = [
  ["1", "1"],
  ["1", "1"],
  ["", "0"],
  ["1", "1"],
  ["", "3"],
];

const MAX_V_HINT_ROWS = 2;
const MAX_H_HINT_COLS = 2;

type Props = {
  cellSize?: number;
};

/** ランディングページ用の静的デモ盤面 */
export function DemoBoard({ cellSize = 28 }: Props) {
  const hintCellSize = cellSize;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `${hintCellSize * MAX_H_HINT_COLS}px ${cellSize * DEMO_GAME_COLS}px`,
        gridTemplateRows: `${hintCellSize * MAX_V_HINT_ROWS}px ${cellSize * DEMO_GAME_ROWS}px`,
      }}
    >
      {/* 左上の空白 */}
      <div />

      {/* 縦ヒント（上側） */}
      <div style={{ position: "relative", width: cellSize * DEMO_GAME_COLS, height: hintCellSize * MAX_V_HINT_ROWS }}>
        <div style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <BoardGrid
            rows={MAX_V_HINT_ROWS}
            cols={DEMO_GAME_COLS}
            cellSize={hintCellSize}
            variant="hint"
            borderRadius={{ topLeft: true, topRight: true }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            gridTemplateColumns: `repeat(${DEMO_GAME_COLS}, ${hintCellSize}px)`,
            gridTemplateRows: `repeat(${MAX_V_HINT_ROWS}, ${hintCellSize}px)`,
          }}
        >
          {DEMO_VERTICAL_HINT.flatMap((row, ri) =>
            row.map((val, ci) => (
              <div
                key={`vh-${ri}-${ci}`}
                style={{
                  width: hintCellSize,
                  height: hintCellSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--chakra-colors-gray-800)",
                  fontWeight: "bold",
                  fontSize: `${Math.max(hintCellSize * 0.55, 10)}px`,
                }}
              >
                {val}
              </div>
            )),
          )}
        </div>
      </div>

      {/* 横ヒント（左側） */}
      <div style={{ position: "relative", width: hintCellSize * MAX_H_HINT_COLS, height: cellSize * DEMO_GAME_ROWS }}>
        <div style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <BoardGrid
            rows={DEMO_GAME_ROWS}
            cols={MAX_H_HINT_COLS}
            cellSize={hintCellSize}
            variant="hint"
            borderRadius={{ topLeft: true, bottomLeft: true }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            gridTemplateColumns: `repeat(${MAX_H_HINT_COLS}, ${hintCellSize}px)`,
            gridTemplateRows: `repeat(${DEMO_GAME_ROWS}, ${hintCellSize}px)`,
          }}
        >
          {DEMO_HORIZONTAL_HINT.flatMap((row, ri) =>
            row.map((val, ci) => (
              <div
                key={`hh-${ri}-${ci}`}
                style={{
                  width: hintCellSize,
                  height: hintCellSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--chakra-colors-gray-800)",
                  fontWeight: "bold",
                  fontSize: `${Math.max(hintCellSize * 0.55, 10)}px`,
                }}
              >
                {val}
              </div>
            )),
          )}
        </div>
      </div>

      {/* ゲーム盤面 */}
      <div style={{ position: "relative", width: cellSize * DEMO_GAME_COLS, height: cellSize * DEMO_GAME_ROWS }}>
        {/* セル描画 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            gridTemplateColumns: `repeat(${DEMO_GAME_COLS}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${DEMO_GAME_ROWS}, ${cellSize}px)`,
            pointerEvents: "none",
          }}
        >
          {DEMO_CELLS.flatMap((row, ri) =>
            row.map((state, ci) => (
              <div
                key={`c-${ri}-${ci}`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {state === "filled" && (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "var(--chakra-colors-gray-800)",
                    }}
                  />
                )}
              </div>
            )),
          )}
        </div>

        {/* グリッド線 */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}>
          <BoardGrid
            rows={DEMO_GAME_ROWS}
            cols={DEMO_GAME_COLS}
            cellSize={cellSize}
            variant="game"
            borderRadius={{ bottomRight: true }}
            bgColor="transparent"
          />
        </div>
      </div>
    </div>
  );
}
