"use client";

import { useState, useEffect } from "react";

type Props = {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
};

// スピナーなし・直接入力可能な数値入力フィールド
export function NumberInput({ value, onChange, min, max }: Props) {
  const [text, setText] = useState(String(value));

  // 外部からvalueが変わったら同期（ボタン操作時）
  useEffect(() => {
    setText(String(value));
  }, [value]);

  const commit = () => {
    const parsed = parseInt(text);
    if (isNaN(parsed)) {
      // 不正な入力は元に戻す
      setText(String(value));
    } else {
      const clamped = Math.max(min, Math.min(max, parsed));
      onChange(clamped);
      setText(String(clamped));
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
      }}
      style={{
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "0.875rem",
        width: "32px",
        border: "none",
        outline: "none",
        background: "transparent",
      }}
    />
  );
}
