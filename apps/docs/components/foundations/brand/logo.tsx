import type { ComponentProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { cx } from "@/utils/cx";

/**
 * JoyUI sprout mark. Default is theme-aware mono (black in light / white in
 * dark). Pass `mono={false}` for the fixed light-mode asset only.
 */
export function Logo({
  size = 32,
  mono = true,
  className,
}: {
  size?: number;
  mono?: boolean;
  className?: string;
}) {
  if (mono) {
    return (
      <>
        <Image
          src="/brand/JoyUI_logo_blackandwhite.png"
          alt="JoyUI"
          width={size}
          height={size}
          className={cx("theme-logo-light shrink-0 object-contain", className)}
          priority
        />
        <Image
          src="/brand/JoyUI_logo_blackandwhite_dark.png"
          alt="JoyUI"
          width={size}
          height={size}
          className={cx("theme-logo-dark shrink-0 object-contain", className)}
          priority
        />
      </>
    );
  }

  return (
    <Image
      src="/brand/JoyUI_logo.png"
      alt="JoyUI"
      width={size}
      height={size}
      className={cx("shrink-0 object-contain", className)}
      priority
    />
  );
}

/** Theme-aware metallic JoyUI Pro mark. */
export function ProLogo({
  size = 36,
  className,
  decorative = false,
  priority = false,
}: {
  size?: number;
  className?: string;
  decorative?: boolean;
  priority?: boolean;
}) {
  const alt = decorative ? "" : "JoyUI Pro";

  return (
    <>
      <Image
        src="/brand/JoyUI_pro.png"
        alt={alt}
        width={size}
        height={size}
        className={cx("theme-logo-light shrink-0 object-contain", className)}
        priority={priority}
      />
      <Image
        src="/brand/JoyUI_pro_dark.png"
        alt={alt}
        width={size}
        height={size}
        className={cx("theme-logo-dark shrink-0 object-contain", className)}
        priority={priority}
      />
    </>
  );
}

/** Compact nav title: mark + wordmark for fumadocs `nav.title`. */
export function NavBrand({
  className,
  size = 22,
  href = "/",
  ...props
}: ComponentProps<"a"> & { size?: number }) {
  return (
    <Link
      href={href ?? "/"}
      className={cx("inline-flex items-center gap-2", className)}
      {...props}
    >
      <Logo size={size} />
      <span className="tracking-tight">JoyUI</span>
    </Link>
  );
}
