"use client";

import { useEffect, useRef, VideoHTMLAttributes } from "react";

interface LazyVideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  src?: string;
  pauseOnScroll?: boolean;
}

export default function LazyVideo({ src, className, style, pauseOnScroll = false, ...props }: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    let isIntersecting = false;
    let scrollTimeout: NodeJS.Timeout;

    const playVideo = () => {
      if (props.autoPlay && isIntersecting) {
        videoElement.play().catch(() => {});
      }
    };

    const pauseVideo = () => {
      videoElement.pause();
    };

    // 1. Intersection Observer to handle entering/leaving viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting) {
            playVideo();
          } else {
            pauseVideo();
          }
        });
      },
      { rootMargin: "0px" } // Use 0px to pause exactly when it leaves viewport
    );

    observer.observe(videoElement);

    // 2. Optional Scroll event listener to pause video WHILE scrolling (saves huge CPU/GPU)
    const onScroll = () => {
      if (!isIntersecting || !pauseOnScroll) return;
      
      // Pause immediately on scroll
      pauseVideo();
      
      // Clear previous timeout
      clearTimeout(scrollTimeout);
      
      // Resume video 150ms after scroll stops
      scrollTimeout = setTimeout(() => {
        playVideo();
      }, 150);
    };

    if (pauseOnScroll) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      observer.unobserve(videoElement);
      if (pauseOnScroll) {
        window.removeEventListener("scroll", onScroll);
      }
      clearTimeout(scrollTimeout);
    };
  }, [props.autoPlay, pauseOnScroll]);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      style={style}
      preload="none"
      {...props}
    >
      {/* If children are passed (e.g. <source>), render them */}
      {props.children}
    </video>
  );
}
