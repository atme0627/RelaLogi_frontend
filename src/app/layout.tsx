import type { Metadata } from "next";
import { Provider } from "./provider";

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
      <body suppressHydrationWarning>
        <Provider>
          <main
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              padding: "0 16px",
              width: "100%",
              minHeight: "100vh",
            }}
          >
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}
