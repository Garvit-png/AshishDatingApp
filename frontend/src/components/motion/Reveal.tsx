"use client";

import { useEffect, useRef } from "react";

type Variant = "up" | "down" | "left" | "right" | "zoom" | "blur";

/** Fades/slides children in when they scroll into view. */
export default function Reveal({
  children,
  as = "div",
  variant = "up",
  delay = 0,
  className = "",
  once = true,
  ...rest
}: {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  variant?: Variant;
  delay?: number;
  className?: string;
  once?: boolean;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          if (once) io.disconnect();
        } else if (!once) {
          el.classList.remove("is-in");
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const Tag = as as React.ElementType;
  return (
    <Tag
      {...rest}
      ref={ref}
      data-reveal={variant}
      className={`reveal ${className}`}
      style={{ ...(rest.style ?? {}), "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
