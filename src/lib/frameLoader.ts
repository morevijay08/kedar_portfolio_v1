// Stop the scroll sequence at the approved final visual frame.
export const FRAME_COUNT = 240;

export const FRAME_DIRECTORY = "/frames";

export const FRAME_PREFIX = "ezgif-frame-";

export const FRAME_EXTENSION = "jpg";

export const FRAME_NUMBER_PADDING = 3;

export function getFrameUrl(
  frameNumber: number
): string {
  const padded = String(frameNumber).padStart(
    FRAME_NUMBER_PADDING,
    "0"
  );

  return `${FRAME_DIRECTORY}/${FRAME_PREFIX}${padded}.${FRAME_EXTENSION}`;
}

export function getAllFrameUrls(): string[] {
  return Array.from(
    { length: FRAME_COUNT },
    (_, i) => getFrameUrl(i + 1)
  );
}
