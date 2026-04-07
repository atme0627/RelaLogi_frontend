"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { MswProvider } from "@/mocks/MswProvider";
import { PuzzleImageProvider } from "@/contexts/PuzzleImageContext";
import { PuzzleDataProvider } from "@/contexts/PuzzleDataContext";

// アプリ全体のProvider集約
export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <MswProvider>
      <ChakraProvider value={defaultSystem}>
        <PuzzleImageProvider>
          <PuzzleDataProvider>{children}</PuzzleDataProvider>
        </PuzzleImageProvider>
      </ChakraProvider>
    </MswProvider>
  );
}
