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
      <body style={{ margin: 0, overflow: "hidden" }} suppressHydrationWarning>
        <Provider>
          <main style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}
