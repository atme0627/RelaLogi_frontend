// MSWリクエストハンドラ定義
// バックエンドAPIのモックレスポンスをここに集約する
import { http, HttpResponse } from "msw";
import sampleVerticalHint from "@/mocks/fixtures/sample_cropped_height_hint.png";
import sampleHorizontalHint from "@/mocks/fixtures/sample_cropped_width_hint.png";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

// ヒント盤面のモックデータを生成
// 実際のOCRと同様に、ヒントは右寄せ（縦）/ 下寄せ（横）で詰まるため、左側/上側に空文字が多い
function generateMockHints(rows: number, cols: number): string[][] {
  return Array.from({ length: rows }, () => {
    const hintCount = Math.floor(Math.random() * 3) + 1;
    const hints = Array.from({ length: hintCount }, () =>
      String(Math.floor(Math.random() * 15) + 1)
    );
    const empties = Array.from({ length: cols - hintCount }, () => "");
    return [...empties, ...hints];
  });
}

export const handlers = [
  http.get(`${API_BASE}/api/health`, () => {
    return HttpResponse.json({ status: "ok" });
  }),

  http.post(`${API_BASE}/api/puzzles/crop`, async ({ request }) => {
    const formData = await request.formData();

    const vRegion = JSON.parse(formData.get("verticalHintRegion") as string);
    const hRegion = JSON.parse(formData.get("horizontalHintRegion") as string);

    const verticalHint = generateMockHints(vRegion.rows, vRegion.cols);
    const horizontalHint = generateMockHints(hRegion.rows, hRegion.cols);

    return HttpResponse.json({
      vertical_hint: verticalHint,
      horizontal_hint: horizontalHint,
      vertical_hint_image: sampleVerticalHint.src ?? sampleVerticalHint,
      horizontal_hint_image: sampleHorizontalHint.src ?? sampleHorizontalHint,
    });
  }),
];
