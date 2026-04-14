"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/theme";
import { MswProvider } from "@/mocks/MswProvider";
import { PuzzleImageProvider } from "@/contexts/PuzzleImageContext";
import { PuzzleDataProvider } from "@/contexts/PuzzleDataContext";

// アプリ全体のProvider集約
export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <MswProvider>
      <ChakraProvider value={system}>
        <PuzzleImageProvider>
          <PuzzleDataProvider>{children}</PuzzleDataProvider>
        </PuzzleImageProvider>
      </ChakraProvider>
    </MswProvider>
  );
}
