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

// 共有点: 縦ヒントの右上(0,1) と 横ヒントの左下(1,3)
const SHARED_POINT = { from: [0, 1], to: [1, 3] } as const;

// 画像サイズに対する初期領域の比率で配置
function createInitialRegions(w: number, h: number): [Quad, Quad] {
  const shared = { x: w * 0.35, y: h * 0.35 };
  return [
    // 縦ヒント：左側
    [
      { x: w * 0.05, y: h * 0.05 },
      { ...shared },
      { x: w * 0.35, y: h * 0.7 },
      { x: w * 0.05, y: h * 0.7 },
    ],
    // 横ヒント：上部
    [
      { x: w * 0.35, y: h * 0.05 },
      { x: w * 0.95, y: h * 0.05 },
      { x: w * 0.95, y: h * 0.35 },
      { ...shared },
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

type Props = {
  onRegionsChange?: (regions: [Quad, Quad]) => void;
};

// アップロード画像上で2つのヒント領域を選択するエディタ
export function CropEditor({ onRegionsChange }: Props = {}) {
  const { previewUrl } = usePuzzleImage();
  const effectiveUrl = previewUrl || mockPreviewUrl;
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageSize, setImageSize] = useState<{ w: number; h: number } | null>(null);
  const [regions, setRegions] = useState<[Quad, Quad] | null>(null);
  const [drag, setDrag] = useState<DragTarget>(null);

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

  // ドラッグ中：表示座標をnaturalサイズ座標系に変換し、共有点なら両方更新
  const handlePointerMove = useCallback(
    (e: ReactPointerEvent) => {
      if (!drag || !containerRef.current || !imageSize) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scaleX = imageSize.w / rect.width;
      const scaleY = imageSize.h / rect.height;
      const x = Math.max(0, Math.min(imageSize.w, (e.clientX - rect.left) * scaleX));
      const y = Math.max(0, Math.min(imageSize.h, (e.clientY - rect.top) * scaleY));

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
      ref={containerRef}
      position="relative"
      display="inline-block"
      w="100%"
      borderRadius="xl"
      overflow="hidden"
      userSelect="none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ touchAction: "none" }}
    >
      {/* パズル画像 */}
      <img
        ref={imgRef}
        src={effectiveUrl}
        alt="パズル画像"
        onLoad={handleImageLoad}
        style={{ width: "100%", display: "block" }}
      />

      {/* SVGオーバーレイ: グレーアウト + 切り抜き領域 + ドラッグハンドル */}
      {imageSize && regions && (
        <svg
          width={imageSize.w}
          height={imageSize.h}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          viewBox={`0 0 ${imageSize.w} ${imageSize.h}`}
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
                    return (
                      <circle
                        key={`${ri}-${pi}`}
                        cx={point.x}
                        cy={point.y}
                        r={handleRadius}
                        fill="white"
                        stroke={isShared ? "#8B5CF6" : REGION_COLORS[ri]}
                        strokeWidth={lineWidth}
                        cursor="grab"
                        onPointerDown={(e) => handlePointerDown(ri, pi, e)}
                      />
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
