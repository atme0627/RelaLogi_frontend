"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { Quad, SizeConfig, OcrResult } from "@/types/puzzle";

type PuzzleDataContextType = {
  cropRegions: [Quad, Quad] | null;
  setCropRegions: (regions: [Quad, Quad]) => void;
  sizeConfig: SizeConfig | null;
  setSizeConfig: (config: SizeConfig) => void;
  ocrResult: OcrResult | null;
  setOcrResult: (result: OcrResult) => void;
  cellSize: number;
  setCellSize: (size: number) => void;
  clear: () => void;
};

const PuzzleDataContext = createContext<PuzzleDataContextType | null>(null);

// crop領域・サイズ設定・OCR結果を画面間で共有するProvider
export function PuzzleDataProvider({ children }: { children: React.ReactNode }) {
  const [cropRegions, setCropRegions] = useState<[Quad, Quad] | null>(null);
  const [sizeConfig, setSizeConfig] = useState<SizeConfig | null>(null);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [cellSize, setCellSize] = useState(20);

  const clear = useCallback(() => {
    setCropRegions(null);
    setSizeConfig(null);
    setOcrResult(null);
    setCellSize(20);
  }, []);

  return (
    <PuzzleDataContext value={{
      cropRegions, setCropRegions,
      sizeConfig, setSizeConfig,
      ocrResult, setOcrResult,
      cellSize, setCellSize,
      clear,
    }}>
      {children}
    </PuzzleDataContext>
  );
}

export function usePuzzleData() {
  const ctx = useContext(PuzzleDataContext);
  if (!ctx) throw new Error("usePuzzleData must be used within PuzzleDataProvider");
  return ctx;
}
