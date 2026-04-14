import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Provider } from "./provider";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

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
    <html lang="ja" suppressHydrationWarning className={notoSansJP.variable}>
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
