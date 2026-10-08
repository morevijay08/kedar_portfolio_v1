"use client";

import { useEffect, useRef, useState } from "react";

export interface UseImagePreloaderResult {
  /** Fully loaded <img> elements, indexed the same way as the input urls array. */
  images: HTMLImageElement[];
  /** Whole-number percentage between 0 and 100. */
  progress: number;
  /** True while any image is still loading. */
  isLoading: boolean;
  /** True once every image has finished loading (successfully or not). */
  isComplete: boolean;
  /** True if one or more images failed to load. */
  hasError: boolean;
}

/**
 * Preloads a fixed list of image URLs and reports granular progress.
 *
 * Each image is loaded via a real HTMLImageElement so the browser decodes
 * and caches it immediately — by the time `isComplete` flips to true every
 * frame is ready to be drawn to canvas with zero decode latency, which is
 * what keeps the scroll-scrub perfectly smooth.
 */
export function useImagePreloader(urls: string[]): UseImagePreloaderResult {
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Kept in a ref (not state) so consumers get a stable array reference
  // once loading completes, without triggering extra re-renders per frame.
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [, forceRender] = useState<number>(0);

  useEffect(() => {
    if (urls.length === 0) {
      setIsLoading(false);
      setIsComplete(true);
      return;
    }

    let isMounted = true;
    let loadedCount = 0;
    const totalCount = urls.length;
    const loadedImages: HTMLImageElement[] = new Array(totalCount);

    setIsLoading(true);
    setIsComplete(false);
    setProgress(0);
    setHasError(false);

    const handleOneSettled = () => {
      loadedCount += 1;
      if (!isMounted) return;

      const pct = Math.round((loadedCount / totalCount) * 100);
      setProgress(pct);

      if (loadedCount === totalCount) {
        imagesRef.current = loadedImages;
        setIsLoading(false);
        setIsComplete(true);
        // Ensure consumers reading `images` see the freshly populated ref.
        forceRender((n) => n + 1);
      }
    };

    const imageElements: HTMLImageElement[] = urls.map((url, index) => {
      const img = new Image();
      img.decoding = "async";

      img.onload = () => {
        loadedImages[index] = img;
        handleOneSettled();
      };

      img.onerror = () => {
        if (isMounted) setHasError(true);
        // Store the image anyway so indices stay aligned; a broken frame
        // simply won't draw, it won't crash the sequence.
        loadedImages[index] = img;
        handleOneSettled();
      };

      img.src = url;
      return img;
    });

    return () => {
      isMounted = false;
      // Detach handlers to avoid state updates after unmount and to
      // let the browser release decode resources for in-flight loads.
      imageElements.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [urls]);

  return {
    images: imagesRef.current,
    progress,
    isLoading,
    isComplete,
    hasError,
  };
}
