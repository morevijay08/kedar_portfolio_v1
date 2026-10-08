"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Transform-based animation is substantially lighter than animating
// background-position: it stays on the compositor whenever possible.
const PAN_SPEED = 220;
const PAUSE = 1.2;
const MIN_SCROLL_OVERFLOW = 0.2;
const FALLBACK_BG = "linear-gradient(135deg, #1e293b, #0f172a)";

const ScrollingPreview = ({
  src,
  alt,
  bg,
  fallbackSrc,
}: {
  src: string;
  alt: string;
  bg?: string;
  fallbackSrc?: string;
}) => {
  const reduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scrollPx, setScrollPx] = useState(0);
  const [activeSrc, setActiveSrc] = useState(src);
  const [bgReady, setBgReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );

    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setActiveSrc(src);
  }, [src]);

  useEffect(() => {
    let cancelled = false;
    const img = new window.Image();

    const compute = () => {
      const viewport = viewportRef.current;
      if (cancelled || !viewport || !img.naturalWidth) return;

      const renderedHeight =
        viewport.clientWidth * (img.naturalHeight / img.naturalWidth);
      const overflow = renderedHeight - viewport.clientHeight;
      setScrollPx(
        overflow > viewport.clientHeight * MIN_SCROLL_OVERFLOW ? overflow : 0
      );
    };

    img.onload = compute;
    img.onerror = () => {
      if (!cancelled && fallbackSrc && activeSrc !== fallbackSrc) {
        setActiveSrc(fallbackSrc);
      }
    };
    img.src = activeSrc;
    if (img.complete) compute();

    window.addEventListener("resize", compute);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", compute);
    };
  }, [activeSrc, fallbackSrc]);

  useEffect(() => {
    if (!bg) {
      setBgReady(false);
      return;
    }

    let cancelled = false;
    const img = new window.Image();
    img.onload = () => !cancelled && setBgReady(true);
    img.onerror = () => !cancelled && setBgReady(false);
    img.src = bg;

    return () => {
      cancelled = true;
    };
  }, [bg]);

  const scrolls = scrollPx > 0;
  const animate = !reduceMotion && isVisible;
  const pan = Math.min(Math.max(scrollPx / PAN_SPEED, 5), 16);
  const total = pan * 2 + PAUSE * 2;
  const times = [
    0,
    pan / total,
    (pan + PAUSE) / total,
    (pan * 2 + PAUSE) / total,
    1,
  ];

  const useFallback = () => {
    if (fallbackSrc && activeSrc !== fallbackSrc) setActiveSrc(fallbackSrc);
  };

  return (
    <div
      className="pointer-events-none absolute inset-0"
      role="img"
      aria-label={alt}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#0f172a",
          backgroundImage: bgReady && bg ? `url("${bg}")` : FALLBACK_BG,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div
        ref={viewportRef}
        style={{
          position: "absolute",
          left: 22,
          right: 22,
          top: 20,
          bottom: 0,
          overflow: "hidden",
          borderRadius: 10,
          boxShadow:
            "0 24px 50px -12px rgba(8,20,55,0.55), 0 8px 18px -8px rgba(8,20,55,0.45)",
          border: "1px solid rgba(255,255,255,0.18)",
        }}
      >
        {scrolls ? (
          <motion.img
            key={activeSrc}
            src={activeSrc}
            alt=""
            draggable={false}
            onError={useFallback}
            className="block w-full max-w-none select-none"
            style={{ willChange: "transform" }}
            animate={
              animate
                ? { y: [0, -scrollPx, -scrollPx, 0, 0] }
                : { y: 0 }
            }
            transition={
              animate
                ? { duration: total, ease: "easeInOut", repeat: Infinity, times }
                : { duration: 0 }
            }
          />
        ) : (
          <motion.img
            key={activeSrc}
            src={activeSrc}
            alt=""
            draggable={false}
            onError={useFallback}
            className="size-full select-none object-cover"
            style={{ willChange: "transform" }}
            animate={animate ? { scale: [1, 1.04, 1], x: [0, -5, 0] } : undefined}
            transition={
              animate
                ? { duration: 14, ease: "easeInOut", repeat: Infinity }
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
};

export default ScrollingPreview;
