import type { Metadata } from "next";
import { Provider } from "./provider";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "RelaLogi",
  description: "雑誌のピクセルパズルをブラウザで遊べるサービス",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body style={{ overflow: "hidden" }} suppressHydrationWarning>
        <Provider>
          <Header />
          <main
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              padding: "0 16px",
              width: "100%",
              height: "calc(100vh - 72px)",
            }}
          >
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}
