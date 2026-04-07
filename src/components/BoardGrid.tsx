"use client";

type Props = {
  rows: number;
  cols: number;
  cellSize: number;
  variant: "game" | "hint";
  // 角丸を適用する角を指定
  borderRadius?: {
    topLeft?: boolean;
    topRight?: boolean;
    bottomLeft?: boolean;
    bottomRight?: boolean;
  };
  // 背景色を上書き（HintBoardで透過にする場合など）
  bgColor?: string;
};

// 個別の角丸を持つrectのパスを生成
function roundedRectPath(
  x: number, y: number, w: number, h: number,
  rTL: number, rTR: number, rBR: number, rBL: number,
) {
  return [
    `M ${x + rTL},${y}`,
    `H ${x + w - rTR}`,
    rTR > 0 ? `A ${rTR},${rTR} 0 0 1 ${x + w},${y + rTR}` : `L ${x + w},${y}`,
    `V ${y + h - rBR}`,
    rBR > 0 ? `A ${rBR},${rBR} 0 0 1 ${x + w - rBR},${y + h}` : `L ${x + w},${y + h}`,
    `H ${x + rBL}`,
    rBL > 0 ? `A ${rBL},${rBL} 0 0 1 ${x},${y + h - rBL}` : `L ${x},${y + h}`,
    `V ${y + rTL}`,
    rTL > 0 ? `A ${rTL},${rTL} 0 0 1 ${x + rTL},${y}` : `L ${x},${y}`,
    "Z",
  ].join(" ");
}

// 盤面のグリッドをSVGで描画するコンポーネント
export function BoardGrid({
  rows,
  cols,
  cellSize,
  variant,
  borderRadius = {},
  bgColor: bgColorProp,
}: Props) {
  const width = cellSize * cols;
  const height = cellSize * rows;

  const bgColor = bgColorProp ?? (variant === "game" ? "var(--chakra-colors-gray-50)" : "var(--chakra-colors-blue-50)");
  const thinColor = "var(--chakra-colors-gray-200)";
  const thickColor = variant === "game" ? "var(--chakra-colors-gray-400)" : "var(--chakra-colors-blue-400)";

  const r = 8;
  const tl = borderRadius.topLeft ? r : 0;
  const tr = borderRadius.topRight ? r : 0;
  const bl = borderRadius.bottomLeft ? r : 0;
  const br = borderRadius.bottomRight ? r : 0;

  const outerSw = 3;

  const clipId = `clip-${rows}-${cols}-${tl}${tr}${br}${bl}`;

  // 各辺のstrokeWidthを計算
  const topSw = (tl || tr) ? ((variant === "hint" && (tl && tr || tl && bl)) ? outerSw * 2 : outerSw) : (variant === "game" ? outerSw * 2 : (variant === "hint" ? 0.5 : outerSw));
  const bottomSw = (bl || br) ? ((variant === "game" || (variant === "hint" && tl && bl)) ? outerSw * 2 : outerSw) : (variant === "hint" ? 0.5 : outerSw);
  const leftSw = (tl || bl) ? ((variant === "hint" && (tl && tr || tl && bl)) ? outerSw * 2 : outerSw) : (variant === "game" ? outerSw * 2 : (variant === "hint" ? 0.5 : outerSw));
  const rightSw = (tr || br) ? ((variant === "game" || (variant === "hint" && tl && tr)) ? outerSw * 2 : outerSw) : (variant === "hint" ? 0.5 : outerSw);

  return (
    <svg width={width} height={height} overflow="visible">
      <defs>
        {/* 角丸クリップ */}
        <clipPath id={clipId}>
          <path d={roundedRectPath(0, 0, width, height, tl, tr, br, bl)} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {/* 背景 */}
        <rect x={0} y={0} width={width} height={height} fill={bgColor} />
        {/* 縦線 — 横ヒント（左側）のみ右から数える */}
        {Array.from({ length: cols - 1 }, (_, i) => {
          const x = (i + 1) * cellSize;
          const isHorizontalHint = variant === "hint" && borderRadius.topLeft && borderRadius.bottomLeft;
          const count = isHorizontalHint ? cols - (i + 1) : i + 1;
          const isThick = count % 5 === 0;
          return (
            <line
              key={`v${i}`}
              x1={x} y1={0} x2={x} y2={height}
              stroke={isThick ? thickColor : thinColor}
              strokeWidth={isThick ? 1 : 0.5}
            />
          );
        })}
        {/* 横線 — 縦ヒント（上側）のみ下から数える */}
        {Array.from({ length: rows - 1 }, (_, i) => {
          const y = (i + 1) * cellSize;
          const isVerticalHint = variant === "hint" && borderRadius.topLeft && borderRadius.topRight;
          const count = isVerticalHint ? rows - (i + 1) : i + 1;
          const isThick = count % 5 === 0;
          return (
            <line
              key={`h${i}`}
              x1={0} y1={y} x2={width} y2={y}
              stroke={isThick ? thickColor : thinColor}
              strokeWidth={isThick ? 1 : 0.5}
            />
          );
        })}
      </g>

      {/* 外枠 — グリッド端を中心に描画（クリップ外で内外均等に表示） */}
      <line x1={tl} y1={0} x2={width - tr} y2={0}
        stroke={thickColor} strokeWidth={topSw / 2} />
      <line x1={bl} y1={height} x2={width - br} y2={height}
        stroke={thickColor} strokeWidth={bottomSw / 2} />
      <line x1={0} y1={tl} x2={0} y2={height - bl}
        stroke={thickColor} strokeWidth={leftSw / 2} />
      <line x1={width} y1={tr} x2={width} y2={height - br}
        stroke={thickColor} strokeWidth={rightSw / 2} />
      {/* 角丸 */}
      {tl > 0 && <path d={`M 0,${tl} A ${tl},${tl} 0 0 1 ${tl},0`} fill="none" stroke={thickColor} strokeWidth={outerSw} />}
      {tr > 0 && <path d={`M ${width - tr},0 A ${tr},${tr} 0 0 1 ${width},${tr}`} fill="none" stroke={thickColor} strokeWidth={outerSw} />}
      {br > 0 && <path d={`M ${width},${height - br} A ${br},${br} 0 0 1 ${width - br},${height}`} fill="none" stroke={thickColor} strokeWidth={outerSw} />}
      {bl > 0 && <path d={`M ${bl},${height} A ${bl},${bl} 0 0 1 0,${height - bl}`} fill="none" stroke={thickColor} strokeWidth={outerSw} />}
    </svg>
  );
}
