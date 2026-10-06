// Scroll-sequence frames.
//   /public/frames/lg/f001.webp ... f240.webp  -> 1280x720, desktop
//   /public/frames/sm/f001.webp ... f240.webp  ->  800x450, phones / Data Saver
export const FRAME_COUNT = 240;

export type FrameVariant = "lg" | "sm";

export const FRAME_DIRECTORY = "/frames";
export const FRAME_PREFIX = "f";
export const FRAME_EXTENSION = "webp";
export const FRAME_NUMBER_PADDING = 3;

export function getFrameUrl(frameNumber: number, variant: FrameVariant): string {
  const padded = String(frameNumber).padStart(FRAME_NUMBER_PADDING, "0");
  return `${FRAME_DIRECTORY}/${variant}/${FRAME_PREFIX}${padded}.${FRAME_EXTENSION}`;
}

export function getAllFrameUrls(variant: FrameVariant): string[] {
  return Array.from({ length: FRAME_COUNT }, (_, i) => getFrameUrl(i + 1, variant));
}

/** Smaller frames for phones and for people who turned on Data Saver. */
export function pickFrameVariant(): FrameVariant {
  if (typeof window === "undefined") return "lg";
  const small = window.matchMedia("(max-width: 768px)").matches;
  const saveData =
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData ?? false;
  return small || saveData ? "sm" : "lg";
}
