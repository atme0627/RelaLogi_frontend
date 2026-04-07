"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { MswProvider } from "@/mocks/MswProvider";

// アプリ全体のProvider集約
export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <MswProvider>
      <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
    </MswProvider>
  );
}
