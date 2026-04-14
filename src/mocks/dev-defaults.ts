// 開発時のみ使用されるモックデフォルト値
// 本番ビルドでは next.config.ts の resolveAlias / NormalModuleReplacementPlugin により
// dev-defaults.prod.ts に差し替えられる
import samplePuzzle from "@/mocks/fixtures/sample_puzzle.png";
import sampleVerticalHint from "@/mocks/fixtures/sample_cropped_height_hint.png";
import sampleHorizontalHint from "@/mocks/fixtures/sample_cropped_width_hint.png";
import type { SizeConfig, OcrResult } from "@/types/puzzle";

export const mockPreviewUrl: string =
  (samplePuzzle as { src?: string }).src ?? (samplePuzzle as unknown as string);

export const mockFile: File | null = new File([""], "sample_puzzle.png", {
  type: "image/png",
});

function generateMockHints(rows: number, cols: number): string[][] {
  return Array.from({ length: rows }, () => {
    const count = Math.floor(Math.random() * 3) + 1;
    const hints = Array.from({ length: count }, () =>
      String(Math.floor(Math.random() * 15) + 1),
    );
    const empties = Array.from({ length: cols - count }, () => "");
    return [...empties, ...hints];
  });
}

export function createMockConfirmDefaults(): {
  sizeConfig: SizeConfig;
  ocrResult: OcrResult;
} | null {
  const config: SizeConfig = {
    gameCols: 25,
    gameRows: 25,
    maxVerticalHintRows: 7,
    maxHorizontalHintCols: 7,
  };

  return {
    sizeConfig: config,
    ocrResult: {
      verticalHint: generateMockHints(config.maxVerticalHintRows, config.gameCols),
      horizontalHint: generateMockHints(config.gameRows, config.maxHorizontalHintCols),
      verticalHintImage:
        (sampleVerticalHint as { src?: string }).src ?? (sampleVerticalHint as unknown as string),
      horizontalHintImage:
        (sampleHorizontalHint as { src?: string }).src ?? (sampleHorizontalHint as unknown as string),
    },
  };
}
