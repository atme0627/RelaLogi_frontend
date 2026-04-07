// MSWリクエストハンドラ定義
// バックエンドAPIのモックレスポンスをここに集約する
import { http, HttpResponse } from "msw";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

export const handlers = [
  http.get(`${API_BASE}/api/health`, () => {
    return HttpResponse.json({ status: "ok" });
  }),

  http.post(`${API_BASE}/api/puzzles/crop`, () => {
    return HttpResponse.json({ status: "ok" });
  }),
];
