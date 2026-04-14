"use client";

import { useMemo } from "react";

// 疑似乱数生成（シード固定でSSR/CSRの不一致を防ぐ）
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

type CellDecoration = "filled" | "cross" | "diamond" | null;

const CELL_SIZE = 40;
const GRID_SEED = 42;
// セルが装飾される確率
const FILL_CHANCE = 0.08;

export function GridBackground() {
  // 十分な範囲をカバーする固定グリッドを生成
  const cols = 80;
  const rows = 50;

  const decorations = useMemo(() => {
    const rand = seededRandom(GRID_SEED);
    const result: CellDecoration[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: CellDecoration[] = [];
      for (let c = 0; c < cols; c++) {
        const v = rand();
        if (v < FILL_CHANCE) {
          const kind = rand();
          if (kind < 0.4) row.push("filled");
          else if (kind < 0.7) row.push("cross");
          else row.push("diamond");
        } else {
          row.push(null);
        }
      }
      result.push(row);
    }
    return result;
  }, []);

  const width = cols * CELL_SIZE;
  const height = rows * CELL_SIZE;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* 点線グリッド */}
        {Array.from({ length: rows + 1 }, (_, r) => (
          <line
            key={`h${r}`}
            x1={0}
            y1={r * CELL_SIZE}
            x2={width}
            y2={r * CELL_SIZE}
            stroke="#c8c8c8"
            strokeWidth={1}
            strokeDasharray="2 6"
          />
        ))}
        {Array.from({ length: cols + 1 }, (_, c) => (
          <line
            key={`v${c}`}
            x1={c * CELL_SIZE}
            y1={0}
            x2={c * CELL_SIZE}
            y2={height}
            stroke="#c8c8c8"
            strokeWidth={1}
            strokeDasharray="2 6"
          />
        ))}

        {/* ランダムなセル装飾 */}
        {decorations.flatMap((row, ri) =>
          row.map((dec, ci) => {
            if (!dec) return null;
            const x = ci * CELL_SIZE;
            const y = ri * CELL_SIZE;
            const margin = CELL_SIZE * 0.2;
            const inner = CELL_SIZE - margin * 2;

            switch (dec) {
              case "filled":
                return (
                  <rect
                    key={`d${ri}-${ci}`}
                    x={x}
                    y={y}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    fill="#d4d4d4"
                  />
                );
              case "cross":
                return (
                  <g key={`d${ri}-${ci}`} opacity={0.35}>
                    <line
                      x1={x + margin}
                      y1={y + margin}
                      x2={x + margin + inner}
                      y2={y + margin + inner}
                      stroke="#fb923c"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                    <line
                      x1={x + margin + inner}
                      y1={y + margin}
                      x2={x + margin}
                      y2={y + margin + inner}
                      stroke="#fb923c"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                  </g>
                );
              case "diamond":
                return (
                  <polygon
                    key={`d${ri}-${ci}`}
                    points={`${x + CELL_SIZE / 2},${y + margin} ${x + margin + inner},${y + CELL_SIZE / 2} ${x + CELL_SIZE / 2},${y + margin + inner} ${x + margin},${y + CELL_SIZE / 2}`}
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth={1.5}
                    strokeLinejoin="round"
                    opacity={0.3}
                  />
                );
              default:
                return null;
            }
          }),
        )}
      </svg>
    </div>
  );
}
