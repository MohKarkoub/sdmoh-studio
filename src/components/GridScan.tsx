"use client";
import { useEffect, useRef, useCallback } from "react";

export default function GridScan({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    let time = 0;
    let raf: number;

    const animate = () => {
      time += 0.012;
      ctx.clearRect(0, 0, w, h);

      const sm = smoothMouseRef.current;
      const rm = mouseRef.current;
      sm.x += (rm.x - sm.x) * 0.08;
      sm.y += (rm.y - sm.y) * 0.08;

      const gridSize = 50;
      const cols = Math.ceil(w / gridSize) + 2;
      const rows = Math.ceil(h / gridSize) + 2;

      const tiltX = ((sm.x / w) - 0.5) * 0.3;
      const tiltY = ((sm.y / h) - 0.5) * 0.3;

      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.transform(1, tiltY, tiltX, 1, 0, 0);
      ctx.translate(-w / 2, -h / 2);

      const fadeRadius = 250;
      const cx = sm.x;
      const cy = sm.y;

      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      for (let i = 0; i < cols; i++) {
        const x = i * gridSize;
        const distX = Math.abs(x - cx);
        const fade = Math.max(0, 1 - distX / fadeRadius);
        ctx.globalAlpha = 0.03 + fade * 0.12;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let j = 0; j < rows; j++) {
        const y = j * gridSize;
        const distY = Math.abs(y - cy);
        const fade = Math.max(0, 1 - distY / fadeRadius);
        ctx.globalAlpha = 0.03 + fade * 0.12;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const scanY = ((Math.sin(time * 0.8) + 1) / 2) * h;
      const scanHeight = 200;

      const scanGrad = ctx.createLinearGradient(0, scanY - scanHeight, 0, scanY + scanHeight);
      scanGrad.addColorStop(0, "rgba(168,85,247,0)");
      scanGrad.addColorStop(0.3, "rgba(168,85,247,0.04)");
      scanGrad.addColorStop(0.5, "rgba(168,85,247,0.1)");
      scanGrad.addColorStop(0.7, "rgba(168,85,247,0.04)");
      scanGrad.addColorStop(1, "rgba(168,85,247,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - scanHeight, w, scanHeight * 2);

      const lineGrad = ctx.createLinearGradient(0, 0, w, 0);
      lineGrad.addColorStop(0, "rgba(249,115,22,0)");
      lineGrad.addColorStop(0.2, "rgba(249,115,22,0.15)");
      lineGrad.addColorStop(0.5, "rgba(168,85,247,0.5)");
      lineGrad.addColorStop(0.8, "rgba(249,115,22,0.15)");
      lineGrad.addColorStop(1, "rgba(249,115,22,0)");
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(w, scanY);
      ctx.stroke();

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const gx = i * gridSize;
          const gy = j * gridSize;
          const dist = Math.sqrt((gx - cx) ** 2 + (gy - cy) ** 2);
          const hoverFade = Math.max(0, 1 - dist / 200);
          const scanDist = Math.abs(gy - scanY);
          const scanFade = Math.max(0, 1 - scanDist / 100);
          const intensity = Math.max(hoverFade * 0.6, scanFade * 0.8);

          if (intensity > 0.01) {
            const r = hoverFade > scanFade ? 249 : 168;
            const g = hoverFade > scanFade ? 115 : 85;
            const b = hoverFade > scanFade ? 22 : 247;
            ctx.globalAlpha = intensity;
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.beginPath();
            ctx.arc(gx, gy, 1.5 + intensity * 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.globalAlpha = intensity * 0.3;
            ctx.beginPath();
            ctx.arc(gx, gy, 4 + intensity * 6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.globalAlpha = 1;
      ctx.restore();
      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    const cleanup = draw();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      if (cleanup) cleanup();
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: "auto" }}
    />
  );
}
