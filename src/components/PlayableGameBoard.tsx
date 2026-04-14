"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { BoardGrid } from "./BoardGrid";
import type { CellState } from "@/types/puzzle";

type DragMode =
  | "fill" | "erase"
  | "crossSet" | "crossErase"
  | "diamondSet" | "diamondErase"
  | null;

export type PaintMode = "filled" | "cross" | "diamond";

type Props = {
  rows: number;
  cols: number;
  cellSize: number;
  cells: CellState[][];
  onCellChange: (row: number, col: number, state: CellState) => void;
  paintMode?: PaintMode;
};

// 2点間のセルをBresenhamアルゴリズムで補間
function interpolateCells(
  r0: number, c0: number, r1: number, c1: number,
): [number, number][] {
  const result: [number, number][] = [];
  let dr = Math.abs(r1 - r0);
  let dc = Math.abs(c1 - c0);
  const sr = r0 < r1 ? 1 : -1;
  const sc = c0 < c1 ? 1 : -1;
  let err = dr - dc;
  let r = r0;
  let c = c0;

  while (true) {
    result.push([r, c]);
    if (r === r1 && c === c1) break;
    const e2 = 2 * err;
    if (e2 > -dc) { err -= dc; r += sr; }
    if (e2 < dr) { err += dr; c += sc; }
  }
  return result;
}

// ドラッグモードに応じてセルに適用する状態を返す（該当しなければnull）
function stateForDragMode(mode: DragMode): CellState | null {
  switch (mode) {
    case "fill": return "filled";
    case "erase": return "empty";
    case "crossSet": return "cross";
    case "crossErase": return "empty";
    case "diamondSet": return "diamond";
    case "diamondErase": return "empty";
    default: return null;
  }
}

// ゲーム盤面: BoardGridの上にインタラクティブなセルオーバーレイを配置
export function PlayableGameBoard({
  rows,
  cols,
  cellSize,
  cells,
  onCellChange,
  paintMode = "filled",
}: Props) {
  const width = cellSize * cols;
  const height = cellSize * rows;
  const dragModeRef = useRef<DragMode>(null);
  const lastCellRef = useRef<[number, number] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverCell, setHoverCell] = useState<[number, number] | null>(null);

  // マウス座標からセルの行・列を計算
  const cellFromEvent = useCallback(
    (e: MouseEvent | React.MouseEvent): [number, number] | null => {
      const el = containerRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const col = Math.floor(x / cellSize);
      const row = Math.floor(y / cellSize);
      if (row < 0 || row >= rows || col < 0 || col >= cols) return null;
      return [row, col];
    },
    [cellSize, rows, cols],
  );

  // mouseDown時にセル状態とキーから操作モードを決定
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const cell = cellFromEvent(e);
      if (!cell) return;
      const [row, col] = cell;
      const current = cells[row][col];

      // 修飾キーで一時的にモード切替、なければ paintMode を使用
      const effectiveMode: PaintMode = e.shiftKey
        ? "cross"
        : e.metaKey
          ? "diamond"
          : paintMode;

      if (effectiveMode === "cross") {
        const dm = current === "cross" ? "crossErase" : "crossSet";
        dragModeRef.current = dm;
        onCellChange(row, col, dm === "crossSet" ? "cross" : "empty");
      } else if (effectiveMode === "diamond") {
        const dm = current === "diamond" ? "diamondErase" : "diamondSet";
        dragModeRef.current = dm;
        onCellChange(row, col, dm === "diamondSet" ? "diamond" : "empty");
      } else {
        const dm = current === "filled" ? "erase" : "fill";
        dragModeRef.current = dm;
        onCellChange(row, col, dm === "fill" ? "filled" : "empty");
      }
      lastCellRef.current = cell;
    },
    [cells, onCellChange, cellFromEvent],
  );

  // mouseMoveで座標からセルを計算し、前回セルとの間を補間して適用 + ホバー追跡
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const cell = cellFromEvent(e);
      setHoverCell(cell);

      const mode = dragModeRef.current;
      if (!mode || !cell) return;

      const [row, col] = cell;
      const last = lastCellRef.current;

      if (last && last[0] === row && last[1] === col) return;

      const newState = stateForDragMode(mode);
      if (newState === null) return;

      const points = last
        ? interpolateCells(last[0], last[1], row, col)
        : [[row, col] as [number, number]];

      for (let i = last ? 1 : 0; i < points.length; i++) {
        const [r, c] = points[i];
        onCellChange(r, c, newState);
      }

      lastCellRef.current = cell;
    },
    [cellFromEvent, onCellChange],
  );

  const handleMouseLeave = useCallback(() => {
    setHoverCell(null);
  }, []);

  // mouseUpでドラッグ終了（window全体で監視）
  useEffect(() => {
    const handleMouseUp = () => {
      dragModeRef.current = null;
      lastCellRef.current = null;
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative", width, height, userSelect: "none", cursor: "pointer" }}
    >
      {/* Layer 1: セル状態の描画（操作はコンテナのmouseDown/Moveで処理） */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          pointerEvents: "none",
          cursor: "pointer",
        }}
      >
        {cells.flatMap((row, ri) =>
          row.map((state, ci) => {
            const isHovered = hoverCell !== null && hoverCell[0] === ri && hoverCell[1] === ci;
            return (
              <div
                key={`${ri}-${ci}`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isHovered && state === "empty"
                    ? "var(--chakra-colors-gray-200)"
                    : undefined,
                }}
              >
                <CellContent state={state} cellSize={cellSize} />
              </div>
            );
          }),
        )}
      </div>

      {/* Layer 2: SVGグリッド（セルの上に描画して塗りつぶし時も線が見える） */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}>
        <BoardGrid
          rows={rows}
          cols={cols}
          cellSize={cellSize}
          variant="game"
          borderRadius={{ bottomRight: true }}
          bgColor="transparent"
        />
      </div>
    </div>
  );
}

// セル状態に応じた描画
function CellContent({ state, cellSize }: { state: CellState; cellSize: number }) {
  const margin = cellSize * 0.15;
  const iconSize = cellSize - margin * 2;

  switch (state) {
    case "filled":
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "var(--chakra-colors-gray-800)",
          }}
        />
      );
    case "cross":
      return (
        <svg width={iconSize} height={iconSize} viewBox={`0 0 ${iconSize} ${iconSize}`}>
          <line
            x1={0} y1={0} x2={iconSize} y2={iconSize}
            stroke="var(--chakra-colors-orange-400)"
            strokeWidth={2}
            strokeLinecap="round"
          />
          <line
            x1={iconSize} y1={0} x2={0} y2={iconSize}
            stroke="var(--chakra-colors-orange-400)"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </svg>
      );
    case "diamond":
      return (
        <svg width={iconSize} height={iconSize} viewBox={`0 0 ${iconSize} ${iconSize}`}>
          <polygon
            points={`${iconSize / 2},0 ${iconSize},${iconSize / 2} ${iconSize / 2},${iconSize} 0,${iconSize / 2}`}
            fill="none"
            stroke="var(--chakra-colors-blue-400)"
            strokeWidth={2}
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}
