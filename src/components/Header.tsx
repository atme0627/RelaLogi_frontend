"use client";

import Link from "next/link";
import { Box, Text } from "@chakra-ui/react";
import { Tiny5 } from "next/font/google";

const tiny5 = Tiny5({ weight: "400", subsets: ["latin"] });

// アプリ共通ヘッダー（左上にロゴ）
export function Header() {
  return (
    <Box
      as="header"
      w="100%"
      bg="gray.700"
      px={6}
      py={3}
      display="flex"
      alignItems="center"
    >
      <Link href="/">
        <Text className={tiny5.className} fontSize="44px" lineHeight="1.2" color="gray.100">
          RELALOGI
        </Text>
      </Link>
    </Box>
  );
}
