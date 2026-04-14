// 本番用スタブ — dev-defaults.ts と同じインターフェースで空の値を返す
import type { SizeConfig, OcrResult } from "@/types/puzzle";

export const mockPreviewUrl: string = "";

export const mockFile: File | null = null;

export function createMockConfirmDefaults(): {
  sizeConfig: SizeConfig;
  ocrResult: OcrResult;
} | null {
  return null;
}
