"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useImagePreloader } from "@/hooks/useImagePreloader";
import { useCanvas } from "@/hooks/useCanvas";
import {
  FRAME_COUNT,
  getAllFrameUrls,
  pickFrameVariant,
} from "@/lib/frameLoader";

import Loader from "./Loader";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// The page appears once this many frames are loaded; the rest stream in
// behind the scenes while the visitor is still on the first screen.
const INITIAL_FRAMES = 24;

// Scroll distance used by the pinned animation.
const PIN_SCROLL_DISTANCE = () => window.innerHeight * 12;

export default function ImageSequence() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { canvasRef, drawImage } = useCanvas();

  // Pick desktop or phone-sized frames on the client.
  const [urls, setUrls] = useState<string[] | null>(null);
  useEffect(() => {
    setUrls(getAllFrameUrls(pickFrameVariant()));
  }, []);

  const { imagesRef, progress, isReady } = useImagePreloader(urls, {
    readyCount: INITIAL_FRAMES,
  });

  // Set up GSAP ScrollTrigger once the first frames are ready.
  useLayoutEffect(() => {
    if (!isReady) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const sequence = { frame: 0 };
      let lastDrawn = -1;

      // Draw the requested frame, or the closest earlier one that has
      // already loaded (matters only if someone scrolls faster than the
      // background download). Skips redrawing the same frame twice.
      const renderFrame = () => {
        const target = Math.round(sequence.frame);
        const images = imagesRef.current;

        for (let i = target; i >= 0; i--) {
          const image = images[i];
          if (image && image.naturalWidth > 0) {
            if (i !== lastDrawn) {
              drawImage(image);
              lastDrawn = i;
            }
            return;
          }
        }
      };

      renderFrame();

      gsap.to(sequence, {
        frame: FRAME_COUNT - 1,
        ease: "none",
        snap: "frame",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: PIN_SCROLL_DISTANCE,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
        onUpdate: renderFrame,
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, [isReady, imagesRef, drawImage]);

  return (
    <>
      {/* Loading screen: only until the first few frames are in */}
      <Loader progress={progress} isComplete={isReady} />

      {/* Scroll-driven image sequence */}
      <section
        ref={sectionRef}
        className="hero"
        aria-label="Scroll-driven portfolio animation"
      >
        <canvas ref={canvasRef} className="hero__canvas" />
      </section>
    </>
  );
}
