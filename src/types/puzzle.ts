// 四角形の4頂点（左上・右上・右下・左下の順）
export type Point = { x: number; y: number };
export type Quad = [Point, Point, Point, Point];

export type SizeConfig = {
  gameRows: number;
  gameCols: number;
  maxVerticalHintRows: number;
  maxHorizontalHintCols: number;
};

// プレイ画面のセル状態
export type CellState = "empty" | "filled" | "cross" | "diamond";

export type OcrResult = {
  verticalHint: string[][];
  horizontalHint: string[][];
  verticalHintImage: string;
  horizontalHintImage: string;
};

// ===== バックエンドAPI (/api/puzzles/recognize) の型 =====
// OpenAPI (relalogi_backend/api/openapi.yaml) に対応

export type GridSize = { rows: number; cols: number };

// hintParameter フィールド（multipartにJSON文字列として載せる）
export type HintParameter = {
  verticalHintSize: GridSize;
  horizontalHintSize: GridSize;
  verticalHintRegion: Quad;
  horizontalHintRegion: Quad;
};

// 数字の文字列グリッド。空白時は "" を使用
export type Grid = {
  size: GridSize;
  values: string[][];
};

// recognize のレスポンス (Puzzle)
export type RecognizeResponse = {
  verticalHintGrid: Grid;
  horizontalHintGrid: Grid;
  // data URI 形式（data:image/png;base64,...）
  verticalHintImage: string;
  horizontalHintImage: string;
};
