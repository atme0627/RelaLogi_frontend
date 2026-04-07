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
