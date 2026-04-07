"use client";

// ヘルスチェックエンドポイントの動作確認用ボタン
import { useState } from "react";
import { Button, Text, Box } from "@chakra-ui/react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

export function HealthCheckButton() {
  const [result, setResult] = useState<string>("");

  const handleClick = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      const data = await res.json();
      setResult(JSON.stringify(data));
    } catch (e) {
      setResult(`Error: ${e instanceof Error ? e.message : "unknown"}`);
    }
  };

  return (
    <Box mt={4}>
      <Button onClick={handleClick}>Health Check</Button>
      {result && <Text mt={2}>Result: {result}</Text>}
    </Box>
  );
}
