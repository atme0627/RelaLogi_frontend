"use client";

import { createContext, useContext, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

const PAGE_ORDER = ["/", "/crop", "/size", "/confirm", "/play"];

type Direction = "forward" | "backward" | "none";

const NavigationContext = createContext<Direction>("none");

// ページ遷移の方向を追跡するProvider（layout経由で永続化）
export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);

  // render中に同期的に方向を算出（template.tsxが正しい値を読めるように）
  let direction: Direction = "none";
  if (prevPathRef.current !== null) {
    const prevIndex = PAGE_ORDER.indexOf(prevPathRef.current);
    const currIndex = PAGE_ORDER.indexOf(pathname);
    if (prevIndex >= 0 && currIndex >= 0 && prevIndex !== currIndex) {
      direction = currIndex > prevIndex ? "forward" : "backward";
    }
  }

  // render後にprevPathRefを更新
  useEffect(() => {
    prevPathRef.current = pathname;
  }, [pathname]);

  return (
    <NavigationContext value={direction}>{children}</NavigationContext>
  );
}

export function useNavigationDirection() {
  return useContext(NavigationContext);
}
