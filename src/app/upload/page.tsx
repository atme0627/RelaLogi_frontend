import { Box, Heading, Text } from "@chakra-ui/react";
import { ImageUploader } from "@/components/ImageUploader";
import { StepIndicator } from "@/components/StepIndicator";

export default function UploadPage() {
  return (
    <Box
      w="100%"
      h="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box w="100%" position="relative">
        {/* インジケーター + テキスト（ドロップゾーンの上に浮かせる） */}
        <Box position="absolute" bottom="100%" left={0} w="100%" pb={6}>
          <Box display="flex" justifyContent="center" mb={8}>
            <StepIndicator totalSteps={4} currentStep={0} />
          </Box>
          <Heading size="2xl">画像アップロード</Heading>
          <Text color="gray.500" mt={2} fontSize="md">
            イラストロジックの画像を選択してください
          </Text>
        </Box>

        {/* ドロップゾーン / プレビュー */}
        <ImageUploader />
      </Box>
    </Box>
  );
}
