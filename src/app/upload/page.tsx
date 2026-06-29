"use client";

import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/PageLayout";
import { ImageUploader } from "@/components/ImageUploader";
import { usePuzzleImage } from "@/contexts/PuzzleImageContext";

export default function UploadPage() {
  const router = useRouter();
  const { previewUrl } = usePuzzleImage();

  return (
    <PageLayout
      currentStep={0}
      title="画像をアップロード"
      description={"イラストロジックの問題画像を\nアップロードしてください。\n\n対応形式: JPG, PNG"}
      onNext={() => router.push("/crop")}
      nextDisabled={!previewUrl}
    >
      <ImageUploader />
    </PageLayout>
  );
}
