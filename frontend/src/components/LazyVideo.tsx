"use client";

import { useEffect, useRef, VideoHTMLAttributes } from "react";

/**
 * Video that only downloads when it gets close to the screen,
 * and pauses when it leaves (saves data + battery on phones).
 */
export default function LazyVideo({ src, ...props }: VideoHTMLAttributes<HTMLVideoElement> & { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!v.src) v.src = src;
          if (props.autoPlay) v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src, props.autoPlay]);

  // When the source changes (e.g. in the dashboard preview) swap it in
  useEffect(() => {
    const v = ref.current;
    if (v && v.src && !v.src.endsWith(src)) v.src = src;
  }, [src]);

  return <video ref={ref} preload="none" {...props} />;
}
