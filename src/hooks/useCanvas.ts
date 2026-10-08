"use client";

import { useCallback, useEffect, useRef } from "react";

export interface UseCanvasResult {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  /**
   * Draws the given image onto the canvas, centered and cropped to cover
   * the full viewport while preserving aspect ratio. Pass `null` to
   * redraw the last-drawn image (used after a resize).
   */
  drawImage: (image: HTMLImageElement | null) => void;
}

const MAX_DEVICE_PIXEL_RATIO = 2;
const RESIZE_DEBOUNCE_MS = 100;

/**
 * Manages a full-viewport, Retina-aware <canvas> and exposes a single
 * `drawImage` function that performs a "cover" fit (like CSS
 * `object-fit: cover`) so every frame fills the screen edge-to-edge and
 * stays perfectly centered regardless of the source image's aspect ratio.
 */
export function useCanvas(): UseCanvasResult {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastImageRef = useRef<HTMLImageElement | null>(null);
  const dprRef = useRef<number>(1);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
    dprRef.current = dpr;

    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Reset then scale so all subsequent draw calls can use CSS pixel
      // coordinates while the backing buffer stays Retina-sharp.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, []);

  const drawImage = useCallback((image: HTMLImageElement | null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (image) {
      lastImageRef.current = image;
    }

    const img = image ?? lastImageRef.current;
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = dprRef.current;
    const viewportWidth = canvas.width / dpr;
    const viewportHeight = canvas.height / dpr;

    ctx.clearRect(0, 0, viewportWidth, viewportHeight);

    const imageRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = viewportWidth / viewportHeight;

    let drawWidth: number;
    let drawHeight: number;

    if (imageRatio > canvasRatio) {
      // Image is relatively wider than the viewport: fit height, crop sides.
      drawHeight = viewportHeight;
      drawWidth = drawHeight * imageRatio;
    } else {
      // Image is relatively taller than the viewport: fit width, crop top/bottom.
      drawWidth = viewportWidth;
      drawHeight = drawWidth / imageRatio;
    }

    const offsetX = (viewportWidth - drawWidth) / 2;
    const offsetY = (viewportHeight - drawHeight) / 2;

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  useEffect(() => {
    resizeCanvas();

    let resizeTimeout: ReturnType<typeof setTimeout> | undefined;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        drawImage(null);
      }, RESIZE_DEBOUNCE_MS);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, [resizeCanvas, drawImage]);

  return { canvasRef, drawImage };
}
