"use client";

import { useState, useRef, useCallback } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Box, Text } from "@chakra-ui/react";
import { usePuzzleImage } from "@/contexts/PuzzleImageContext";
import { mockPreviewUrl } from "@/mocks/dev-defaults";
import type { Point, Quad } from "@/types/puzzle";

export type { Point, Quad };

// ドラッグ対象の識別
type DragTarget = {
  regionIndex: number;
  pointIndex: number;
} | null;

const REGION_COLORS = ["#3B82F6", "#EF4444"]; // 青（縦ヒント）、赤（横ヒント）

// 共有点: 縦ヒントの左下(0,3) と 横ヒントの右上(1,1)
const SHARED_POINT = { from: [0, 3], to: [1, 1] } as const;

// 画像サイズに対する初期領域の比率で配置
function createInitialRegions(w: number, h: number): [Quad, Quad] {
  const shared = { x: w * 0.35, y: h * 0.35 };
  return [
    // 縦ヒント：盤面の上部（共有点が右下）
    [
      { x: w * 0.35, y: h * 0.05 },
      { x: w * 0.95, y: h * 0.05 },
      { x: w * 0.95, y: h * 0.35 },
      { ...shared },
    ],
    // 横ヒント：盤面の左側（共有点が右上）
    [
      { x: w * 0.05, y: h * 0.35 },
      { ...shared },
      { x: w * 0.35, y: h * 0.95 },
      { x: w * 0.05, y: h * 0.95 },
    ],
  ];
}

function quadToPolygonPoints(quad: Quad): string {
  return quad.map((p) => `${p.x},${p.y}`).join(" ");
}

// 指定の点が共有点かどうか判定し、連動先を返す
function getLinkedPoint(ri: number, pi: number): [number, number] | null {
  if (ri === SHARED_POINT.from[0] && pi === SHARED_POINT.from[1]) {
    return [SHARED_POINT.to[0], SHARED_POINT.to[1]];
  }
  if (ri === SHARED_POINT.to[0] && pi === SHARED_POINT.to[1]) {
    return [SHARED_POINT.from[0], SHARED_POINT.from[1]];
  }
  return null;
}

// スクリーン座標 → SVG viewBox座標 に変換
function screenToSvgCoords(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
): { x: number; y: number } | null {
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const svgPt = pt.matrixTransform(ctm.inverse());
  return { x: svgPt.x, y: svgPt.y };
}

type Props = {
  onRegionsChange?: (regions: [Quad, Quad]) => void;
};

// アップロード画像上で2つのヒント領域を選択するエディタ
export function CropEditor({ onRegionsChange }: Props = {}) {
  const { previewUrl } = usePuzzleImage();
  const effectiveUrl = previewUrl || mockPreviewUrl;
  const svgRef = useRef<SVGSVGElement>(null);
  const [imageSize, setImageSize] = useState<{ w: number; h: number } | null>(null);
  const [regions, setRegions] = useState<[Quad, Quad] | null>(null);
  const [drag, setDrag] = useState<DragTarget>(null);
  const [hover, setHover] = useState<DragTarget>(null);

  // 画像のnaturalSizeから初期領域をセット
  const initFromImage = useCallback((img: HTMLImageElement) => {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (w > 0 && h > 0) {
      setImageSize({ w, h });
      const initial = createInitialRegions(w, h);
      setRegions(initial);
      onRegionsChange?.(initial);
    }
  }, [onRegionsChange]);

  // refコールバック: キャッシュ済みの場合onLoadが発火しないため、completeならここで初期化
  const imgRef = useCallback(
    (img: HTMLImageElement | null) => {
      if (img?.complete && img.naturalWidth > 0) {
        initFromImage(img);
      }
    },
    [initFromImage],
  );

  const handleImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      initFromImage(e.currentTarget);
    },
    [initFromImage],
  );

  const handlePointerDown = useCallback(
    (regionIndex: number, pointIndex: number, e: ReactPointerEvent) => {
      e.preventDefault();
      (e.target as Element).setPointerCapture(e.pointerId);
      setDrag({ regionIndex, pointIndex });
    },
    [],
  );

  // ドラッグ中：SVGのgetScreenCTMで正確にviewBox座標へ変換
  const handlePointerMove = useCallback(
    (e: ReactPointerEvent) => {
      if (!drag || !svgRef.current || !imageSize) return;

      const coords = screenToSvgCoords(svgRef.current, e.clientX, e.clientY);
      if (!coords) return;
      const x = Math.max(0, Math.min(imageSize.w, coords.x));
      const y = Math.max(0, Math.min(imageSize.h, coords.y));

      setRegions((prev) => {
        if (!prev) return prev;
        const next = prev.map((quad) => quad.map((p) => ({ ...p }))) as [Quad, Quad];
        next[drag.regionIndex][drag.pointIndex] = { x, y };

        // 共有点なら連動先も更新
        const linked = getLinkedPoint(drag.regionIndex, drag.pointIndex);
        if (linked) {
          next[linked[0]][linked[1]] = { x, y };
        }

        return next;
      });
    },
    [drag, imageSize],
  );

  const handlePointerUp = useCallback(() => {
    setDrag(null);
    if (regions) onRegionsChange?.(regions);
  }, [regions, onRegionsChange]);

  if (!effectiveUrl) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">画像がありません。アップロード画面に戻ってください。</Text>
      </Box>
    );
  }

  // 共有点は一度だけ描画するため、2つ目の領域側をスキップ
  const isSharedAndSkip = (ri: number, pi: number) =>
    ri === SHARED_POINT.to[0] && pi === SHARED_POINT.to[1];

  return (
    <Box
      position="relative"
      w="100%"
      h="100%"
      borderRadius="xl"
      overflow="hidden"
      userSelect="none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ touchAction: "none", cursor: drag || hover ? "none" : undefined }}
    >
      {/* パズル画像: objectFit containで中央配置 */}
      <img
        ref={imgRef}
        src={effectiveUrl}
        alt="パズル画像"
        onLoad={handleImageLoad}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "contain",
        }}
      />

      {/* SVGオーバーレイ: preserveAspectRatioでimgと同じスケーリング */}
      {imageSize && regions && (
        <svg
          ref={svgRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          viewBox={`0 0 ${imageSize.w} ${imageSize.h}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* マスク: 白=表示、黒=非表示。全体白で覆い、領域部分を黒くする → 領域外がグレーアウト */}
            <mask id="crop-mask">
              <rect width={imageSize.w} height={imageSize.h} fill="white" />
              {regions.map((quad, i) => (
                <polygon key={i} points={quadToPolygonPoints(quad)} fill="black" />
              ))}
            </mask>
          </defs>

          {/* グレーアウトレイヤー（マスクで領域内を除外） */}
          <rect
            width={imageSize.w}
            height={imageSize.h}
            fill="rgba(0,0,0,0.5)"
            mask="url(#crop-mask)"
          />

          {/* 枠線とハンドルを分離し、ハンドルを最前面に描画 */}
          {(() => {
            const handleRadius = imageSize.w * 0.0075;
            const lineWidth = imageSize.w * 0.0015;
            return (
              <>
                {/* 枠線（背面） */}
                {regions.map((quad, ri) => (
                  <polygon
                    key={ri}
                    points={quadToPolygonPoints(quad)}
                    fill="none"
                    stroke={REGION_COLORS[ri]}
                    strokeWidth={lineWidth}
                  />
                ))}
                {/* ドラッグハンドル（最前面） */}
                {regions.map((quad, ri) =>
                  quad.map((point, pi) => {
                    if (isSharedAndSkip(ri, pi)) return null;
                    const isShared = getLinkedPoint(ri, pi) !== null;
                    const isDragging = drag?.regionIndex === ri && drag?.pointIndex === pi;
                    const isDraggingShared = isShared && drag && getLinkedPoint(drag.regionIndex, drag.pointIndex) !== null;
                    const isHovering = hover?.regionIndex === ri && hover?.pointIndex === pi;
                    const isHoveringShared = isShared && hover && getLinkedPoint(hover.regionIndex, hover.pointIndex) !== null;
                    const active = isDragging || isDraggingShared || isHovering || isHoveringShared;
                    const r = active ? handleRadius * 1.3 : handleRadius;
                    if (isShared) {
                      const cx = point.x;
                      const cy = point.y;
                      return (
                        <g
                          key={`${ri}-${pi}`}
                          cursor="none"
                          onPointerDown={(e) => handlePointerDown(ri, pi, e)}
                          onPointerEnter={() => setHover({ regionIndex: ri, pointIndex: pi })}
                          onPointerLeave={() => setHover(null)}
                        >
                          {active && <circle cx={cx} cy={cy} r={r * 1.4} fill="white" opacity={0.5} />}
                          <defs>
                            <clipPath id="shared-top-right">
                              <polygon points={`${cx - r * 2},${cy - r * 2} ${cx + r * 2},${cy - r * 2} ${cx + r * 2},${cy + r * 2}`} />
                            </clipPath>
                            <clipPath id="shared-bottom-left">
                              <polygon points={`${cx - r * 2},${cy - r * 2} ${cx + r * 2},${cy + r * 2} ${cx - r * 2},${cy + r * 2}`} />
                            </clipPath>
                          </defs>
                          <circle cx={cx} cy={cy} r={r} fill={REGION_COLORS[0]} clipPath="url(#shared-top-right)" />
                          <circle cx={cx} cy={cy} r={r} fill={REGION_COLORS[1]} clipPath="url(#shared-bottom-left)" />
                        </g>
                      );
                    }
                    return (
                      <g key={`${ri}-${pi}`}>
                        {active && <circle cx={point.x} cy={point.y} r={r * 1.4} fill="white" opacity={0.5} />}
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={r}
                          fill={REGION_COLORS[ri]}
                          stroke={REGION_COLORS[ri]}
                          strokeWidth={lineWidth}
                          cursor="none"
                          onPointerDown={(e) => handlePointerDown(ri, pi, e)}
                          onPointerEnter={() => setHover({ regionIndex: ri, pointIndex: pi })}
                          onPointerLeave={() => setHover(null)}
                        />
                      </g>
                    );
                  }),
                )}
              </>
            );
          })()}
        </svg>
      )}
    </Box>
  );
}
