"use client";

import { useCallback } from "react";
import { BoardGrid } from "./BoardGrid";

type Props = {
  rows: number;
  cols: number;
  cellSize: number;
  values: string[][];
  onChange: (row: number, col: number, value: string) => void;
  backgroundImage?: string;
  borderRadius?: {
    topLeft?: boolean;
    topRight?: boolean;
    bottomLeft?: boolean;
    bottomRight?: boolean;
  };
};

// ヒント盤面: 背景画像 + SVGグリッド線 + 編集可能な入力セルの3レイヤー構成
export function HintBoard({
  rows,
  cols,
  cellSize,
  values,
  onChange,
  backgroundImage,
  borderRadius,
}: Props) {
  const width = cellSize * cols;
  const height = cellSize * rows;

  const handleCellChange = useCallback(
    (row: number, col: number, raw: string) => {
      // 空文字 or 0〜99の数値のみ許可
      if (raw === "") {
        onChange(row, col, "");
        return;
      }
      const num = Number(raw);
      if (!Number.isNaN(num) && num >= 0 && num <= 99) {
        onChange(row, col, String(num));
      }
    },
    [onChange],
  );

  return (
    <div style={{ position: "relative", width, height }}>
      {/* Layer 1: 背景画像（切り抜き済みヒント画像） */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.5,
            objectFit: "fill",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Layer 2: SVGグリッド線（透過背景） */}
      <div style={{ position: "absolute", inset: 0 }}>
        <BoardGrid
          rows={rows}
          cols={cols}
          cellSize={cellSize}
          variant="hint"
          borderRadius={borderRadius}
          bgColor={backgroundImage ? "transparent" : undefined}
        />
      </div>

      {/* Layer 3: 編集可能な入力グリッド */}
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
          row.map((val, ci) => (
            <input
              key={`${ri}-${ci}`}
              type="text"
              inputMode="numeric"
              value={val}
              onChange={(e) => handleCellChange(ri, ci, e.target.value)}
              style={{
                width: cellSize,
                height: cellSize,
                border: "none",
                background: "transparent",
                textAlign: "center",
                color: "var(--chakra-colors-red-600)",
                fontWeight: "bold",
                fontSize: `${Math.max(cellSize * 0.6, 10)}px`,
                padding: 0,
                outline: "none",
                caretColor: "var(--chakra-colors-red-400)",
              }}
            />
          )),
        )}
      </div>
    </div>
  );
}
