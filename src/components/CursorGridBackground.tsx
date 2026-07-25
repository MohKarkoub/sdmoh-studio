"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const CursorGrid = dynamic(
  () => import("./CursorGrid"),
  { ssr: false }
);

export default function CursorGridBackground() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!isDesktop) return null;

  return (
    <div className="absolute inset-0 z-[1] pointer-events-none">
      <CursorGrid
        cellSize={80}
        color="#A0A0A0"
        radius={300}
        falloff="smooth"
        holdTime={300}
        fadeDuration={300}
        lineWidth={1.5}
        maxOpacity={0.6}
        fillOpacity={0.08}
        gridOpacity={0.05}
        cellRadius={0}
        clickPulse={true}
        pulseSpeed={600}
      />
    </div>
  );
}
