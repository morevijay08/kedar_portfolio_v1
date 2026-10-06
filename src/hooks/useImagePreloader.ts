"use client";

import { useEffect, useRef, useState } from "react";

export interface UseImagePreloaderOptions {
  /** How many leading frames must be loaded before `isReady` flips to true. */
  readyCount?: number;
  /** How many downloads run at the same time. */
  concurrency?: number;
}

export interface UseImagePreloaderResult {
  /**
   * Stable array that is filled in as frames arrive (index = frame index).
   * Read `imagesRef.current[i]` at draw time; entries that have not loaded yet
   * are `undefined`.
   */
  imagesRef: React.MutableRefObject<(HTMLImageElement | undefined)[]>;
  /** 0-100, progress of the first `readyCount` frames (what the loader shows). */
  progress: number;
  /** True once the first `readyCount` frames are loaded: the page can show. */
  isReady: boolean;
  /** True once every frame has finished (the rest load in the background). */
  isComplete: boolean;
  hasError: boolean;
}

/**
 * Loads frames in order and lets the page start after the first few, instead
 * of blocking on all of them. The remaining frames keep downloading quietly
 * (a few at a time) while the visitor reads the first screen.
 */
export function useImagePreloader(
  urls: string[] | null,
  { readyCount = 24, concurrency = 6 }: UseImagePreloaderOptions = {}
): UseImagePreloaderResult {
  const imagesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!urls || urls.length === 0) return;

    const total = urls.length;
    const needed = Math.min(readyCount, total);
    imagesRef.current = new Array(total);

    let cancelled = false;
    let next = 0;
    let settled = 0;
    let settledInitial = 0;
    const live = new Set<HTMLImageElement>();

    setProgress(0);
    setIsReady(false);
    setIsComplete(false);
    setHasError(false);

    const onSettled = (index: number) => {
      if (cancelled) return;
      settled += 1;
      if (index < needed) {
        settledInitial += 1;
        setProgress(Math.round((settledInitial / needed) * 100));
        if (settledInitial === needed) setIsReady(true);
      }
      if (settled === total) setIsComplete(true);
    };

    const loadNext = () => {
      if (cancelled || next >= total) return;
      const index = next++;
      const img = new Image();
      img.decoding = "async";
      // The first screen's frames matter most; the rest can wait their turn.
      (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority =
        index < needed ? "high" : "low";
      live.add(img);

      img.onload = () => {
        img.onload = img.onerror = null;
        live.delete(img);
        imagesRef.current[index] = img;
        onSettled(index);
        loadNext();
      };
      img.onerror = () => {
        img.onload = img.onerror = null;
        live.delete(img);
        // Leave the slot empty: drawing falls back to the previous frame.
        if (!cancelled) setHasError(true);
        onSettled(index);
        loadNext();
      };
      img.src = urls[index];
    };

    for (let i = 0; i < Math.min(concurrency, total); i++) loadNext();

    return () => {
      cancelled = true;
      live.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
      live.clear();
    };
  }, [urls, readyCount, concurrency]);

  return { imagesRef, progress, isReady, isComplete, hasError };
}
