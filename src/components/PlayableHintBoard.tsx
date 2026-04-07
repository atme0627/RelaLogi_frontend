"use client";

import { useCallback } from "react";
import { BoardGrid } from "./BoardGrid";

type Props = {
  rows: number;
  cols: number;
  cellSize: number;
  values: string[][];
  grayedOut: boolean[][];
  onToggleGray: (row: number, col: number) => void;
  borderRadius?: {
    topLeft?: boolean;
    topRight?: boolean;
    bottomLeft?: boolean;
    bottomRight?: boolean;
  };
};

// プレイ画面用ヒント盤面: 表示専用 + クリックでグレーアウトトグル
export function PlayableHintBoard({
  rows,
  cols,
  cellSize,
  values,
  grayedOut,
  onToggleGray,
  borderRadius,
}: Props) {
  const width = cellSize * cols;
  const height = cellSize * rows;

  const handleClick = useCallback(
    (row: number, col: number) => {
      if (values[row][col] !== "") {
        onToggleGray(row, col);
      }
    },
    [values, onToggleGray],
  );

  return (
    <div style={{ position: "relative", width, height, userSelect: "none" }}>
      {/* ホバー用スタイル */}
      <style>{`
        .hint-cell-clickable:hover {
          background-color: var(--chakra-colors-blue-100);
        }
      `}</style>

      {/* Layer 1: SVGグリッド */}
      <div style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <BoardGrid
          rows={rows}
          cols={cols}
          cellSize={cellSize}
          variant="hint"
          borderRadius={borderRadius}

        />
      </div>

      {/* Layer 2: ヒント値表示グリッド */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        }}
      >
        {values.flatMap((row, ri) =>
          row.map((val, ci) => {
            const isGrayed = grayedOut[ri]?.[ci] ?? false;
            return (
              <div
                key={`${ri}-${ci}`}
                className={val ? "hint-cell-clickable" : undefined}
                onClick={() => handleClick(ri, ci)}
                style={{
                  width: cellSize,
                  height: cellSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: val ? "pointer" : "default",
                  color: isGrayed
                    ? "var(--chakra-colors-gray-300)"
                    : "var(--chakra-colors-gray-800)",
                  fontWeight: "bold",
                  fontSize: `${Math.max(cellSize * 0.6, 10)}px`,
                  textDecoration: isGrayed ? "line-through" : "none",
                  transition: "background-color 0.1s, color 0.15s",
                }}
              >
                {val}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
