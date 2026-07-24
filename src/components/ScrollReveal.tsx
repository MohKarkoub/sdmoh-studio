"use client";
import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Direction = "left" | "right" | "up" | "down" | "fade";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  duration?: number;
  delay?: number;
  distance?: number;
  className?: string;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  direction = "up",
  duration = 0.8,
  delay = 0,
  distance = 60,
  className = "",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const fromVars: gsap.TweenVars = {
        opacity: 0,
        duration,
        delay,
        ease: "power3.out",
      };

      switch (direction) {
        case "left":
          fromVars.x = -distance;
          break;
        case "right":
          fromVars.x = distance;
          break;
        case "up":
          fromVars.y = distance;
          break;
        case "down":
          fromVars.y = -distance;
          break;
        case "fade":
          break;
      }

      gsap.from(el, {
        ...fromVars,
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: once ? "play none none none" : "play reverse play reverse",
        },
      });
    });

    return () => ctx.revert();
  }, [direction, duration, delay, distance, once]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}
