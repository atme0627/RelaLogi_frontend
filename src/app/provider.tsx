"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/theme";
import { EmotionRegistry } from "./emotion-registry";
import { MswProvider } from "@/mocks/MswProvider";
import { PuzzleImageProvider } from "@/contexts/PuzzleImageContext";
import { PuzzleDataProvider } from "@/contexts/PuzzleDataContext";
import { NavigationProvider } from "@/contexts/NavigationContext";

// アプリ全体のProvider集約
export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <MswProvider>
      <EmotionRegistry>
        <ChakraProvider value={system}>
          <NavigationProvider>
            <PuzzleImageProvider>
              <PuzzleDataProvider>{children}</PuzzleDataProvider>
            </PuzzleImageProvider>
          </NavigationProvider>
        </ChakraProvider>
      </EmotionRegistry>
    </MswProvider>
  );
}
