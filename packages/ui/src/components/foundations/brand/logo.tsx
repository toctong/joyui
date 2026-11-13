import { cx } from "../../../utils/cx";

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
        <img
          src="/brand/JoyUI_logo_blackandwhite.png"
          alt="JoyUI"
          width={size}
          height={size}
          className={cx("theme-logo-light shrink-0 object-contain", className)}
        />
        <img
          src="/brand/JoyUI_logo_blackandwhite_dark.png"
          alt="JoyUI"
          width={size}
          height={size}
          className={cx("theme-logo-dark shrink-0 object-contain", className)}
        />
      </>
    );
  }

  return (
    <img
      src="/brand/JoyUI_logo.png"
      alt="JoyUI"
      width={size}
      height={size}
      className={cx("shrink-0 object-contain", className)}
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
      <img
        src="/brand/JoyUI_pro.png"
        alt={alt}
        width={size}
        height={size}
        className={cx("theme-logo-light shrink-0 object-contain", className)}
      />
      <img
        src="/brand/JoyUI_pro_dark.png"
        alt={alt}
        width={size}
        height={size}
        className={cx("theme-logo-dark shrink-0 object-contain", className)}
      />
    </>
  );
}

/**
 * Compact nav title: mark + wordmark for fumadocs `nav.title`.
 * Pass as a ReactNode (not a function) so Server → Client layouts can serialize it.
 * Fumadocs wraps this in its own link.
 */
export function NavBrand({
  className,
  size = 22,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span className={cx("inline-flex items-center gap-2", className)}>
      <Logo size={size} />
      <span className="tracking-tight">JoyUI</span>
    </span>
  );
}
