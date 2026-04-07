"use client";

import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/PageLayout";
import { ImageUploader } from "@/components/ImageUploader";
import { usePuzzleImage } from "@/contexts/PuzzleImageContext";

export default function Home() {
  const router = useRouter();
  const { previewUrl } = usePuzzleImage();

  return (
    <PageLayout
      currentStep={0}
      title="画像アップロード"
      description="写真を撮るだけでイラストロジックを電子化。いつでもどこでもブラウザで楽しめます。"
      onNext={previewUrl ? () => router.push("/crop") : undefined}
    >
      <ImageUploader />
    </PageLayout>
  );
}
