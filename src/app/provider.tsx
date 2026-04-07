"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { MswProvider } from "@/mocks/MswProvider";
import { PuzzleImageProvider } from "@/contexts/PuzzleImageContext";

// アプリ全体のProvider集約
export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <MswProvider>
      <ChakraProvider value={defaultSystem}>
        <PuzzleImageProvider>{children}</PuzzleImageProvider>
      </ChakraProvider>
    </MswProvider>
  );
}
