"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useImagePreloader } from "@/hooks/useImagePreloader";
import { useCanvas } from "@/hooks/useCanvas";
import {
  getAllFrameUrls,
  FRAME_COUNT,
} from "@/lib/frameLoader";

import Loader from "./Loader";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Generate only the approved frame URLs once.
const FRAME_URLS = getAllFrameUrls();

// Scroll distance used by the pinned animation.
const PIN_SCROLL_DISTANCE = () => window.innerHeight * 12;

export default function ImageSequence() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { canvasRef, drawImage } = useCanvas();

  const {
    images,
    progress,
    isLoading,
    isComplete,
  } = useImagePreloader(FRAME_URLS);

  const [isReady, setIsReady] = useState(false);

  // Draw the first frame once all images have loaded.
  useEffect(() => {
    if (
      isComplete &&
      images.length === FRAME_COUNT &&
      images[0]
    ) {
      drawImage(images[0]);
      setIsReady(true);
    }
  }, [isComplete, images, drawImage]);

  // Set up GSAP ScrollTrigger after the images are ready.
  useLayoutEffect(() => {
    if (!isReady) return;

    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const sequence = {
        frame: 0,
      };

      const renderFrame = () => {
        const frameIndex = Math.round(sequence.frame);

        const image = images[frameIndex];

        if (image) {
          drawImage(image);
        }
      };

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
  }, [isReady, images, drawImage]);

  return (
    <>
      {/* Loading screen while the image sequence is loading */}
      {(isLoading || !isReady) && (
        <Loader
          progress={progress}
          isComplete={isComplete}
        />
      )}

      {/* Scroll-driven image sequence */}
      <section
        ref={sectionRef}
        className="hero"
        aria-label="Scroll-driven portfolio animation"
      >
        <canvas
          ref={canvasRef}
          className="hero__canvas"
        />
      </section>
    </>
  );
}