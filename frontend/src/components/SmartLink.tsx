"use client";

import Link from "next/link";
import { goTo } from "./motion/SmoothScroll";

/**
 * A link that works with whatever the admin types:
 *  "#playbooks" → smooth scroll, "/courses" → page, "https://…" → new tab.
 */
export default function SmartLink({
  href,
  children,
  onClick,
  ...rest
}: { href: string; children: React.ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const external = /^(https?:|mailto:|tel:|wa\.me)/.test(href);
  if (href.startsWith("#")) {
    return (
      <a
        href={href}
        {...rest}
        onClick={(e) => {
          onClick?.(e);
          e.preventDefault();
          // Section lives on the homepage → go there first
          if (!document.getElementById(href.slice(1))) window.location.href = `/${href}`;
          else goTo(href);
        }}
      >
        {children}
      </a>
    );
  }
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href || "/"} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
