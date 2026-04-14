import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "var(--font-noto-sans-jp), sans-serif" },
        body: { value: "var(--font-noto-sans-jp), sans-serif" },
      },
    },
    textStyles: {
      heading: {
        value: {
          fontSize: "xl",
          fontWeight: "bold",
          lineHeight: "1.4",
        },
      },
      body: {
        value: {
          fontSize: "md",
          fontWeight: "normal",
          lineHeight: "1.6",
        },
      },
      label: {
        value: {
          fontSize: "sm",
          fontWeight: "medium",
          lineHeight: "1.4",
        },
      },
      caption: {
        value: {
          fontSize: "sm",
          fontWeight: "normal",
          lineHeight: "1.6",
          color: "gray.500",
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
