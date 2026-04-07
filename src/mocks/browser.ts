// MSWブラウザワーカーのセットアップ
// handlersで定義したモックをService Workerに登録する
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
