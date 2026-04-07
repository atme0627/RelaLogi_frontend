import { Box, Heading, Text } from "@chakra-ui/react";
import { HealthCheckButton } from "@/components/HealthCheckButton";

export default function Home() {
  return (
    <Box p={8}>
      <Heading size="2xl">Hello World</Heading>
      <Text mt={4}>RelaLogi フロントエンド</Text>
      <HealthCheckButton />
    </Box>
  );
}
