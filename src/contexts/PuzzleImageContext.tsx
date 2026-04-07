"use client";

import { createContext, useContext, useState, useCallback } from "react";

type PuzzleImageContextType = {
  previewUrl: string;
  setPreviewUrl: (url: string) => void;
  clear: () => void;
};

const PuzzleImageContext = createContext<PuzzleImageContextType | null>(null);

// アップロード画像のpreviewUrlを画面間で共有するProvider
export function PuzzleImageProvider({ children }: { children: React.ReactNode }) {
  const [previewUrl, setPreviewUrl] = useState("");

  const clear = useCallback(() => setPreviewUrl(""), []);

  return (
    <PuzzleImageContext value={{ previewUrl, setPreviewUrl, clear }}>
      {children}
    </PuzzleImageContext>
  );
}

export function usePuzzleImage() {
  const ctx = useContext(PuzzleImageContext);
  if (!ctx) throw new Error("usePuzzleImage must be used within PuzzleImageProvider");
  return ctx;
}
