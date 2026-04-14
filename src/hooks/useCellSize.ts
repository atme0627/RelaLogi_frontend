"use client";

import { useRef, useState, useEffect, useCallback, type RefObject } from "react";
import { usePuzzleData } from "@/contexts/PuzzleDataContext";

const MAX_CELL_SIZE = 20;
const MIN_CELL_SIZE = 6;

type Params = {
  gameCols: number;
  gameRows: number;
  maxHorizontalHintCols: number;
  maxVerticalHintRows: number;
  /** 設定UIなど盤面以外が占める幅・高さの概算（px） */
  uiOffset?: number;
};

export function useCellSize({
  gameCols,
  gameRows,
  maxHorizontalHintCols,
  maxVerticalHintRows,
  uiOffset = 0,
}: Params): { containerRef: RefObject<HTMLDivElement | null>; cellSize: number } {
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
    const availW = w - uiOffset * 2;
    const availH = h - uiOffset * 2;
    const totalCols = v.gameCols + v.maxHorizontalHintCols;
    const totalRows = v.gameRows + v.maxVerticalHintRows;
    const fitW = availW / totalCols;
    const fitH = availH / totalRows;
    const size = Math.max(MIN_CELL_SIZE, Math.min(MAX_CELL_SIZE, Math.floor(Math.min(fitW, fitH))));
    setCellSize(size);
    setSharedCellSize(size);
  }, [setSharedCellSize, uiOffset]);

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

  useEffect(() => {
    const timer = setTimeout(recalc, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameCols, gameRows, maxHorizontalHintCols, maxVerticalHintRows]);

  return { containerRef, cellSize };
}
