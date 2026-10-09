import Link from "next/link";
import brand from "@/data/brand.json";

type Props = { onClick?: () => void; tone?: "default" | "light"; className?: string };

/**
 * Official RedBlink logo, pulled from redblink.com by scripts/fetch-brand.mjs.
 * Until that runs, a typographic wordmark is shown in its place.
 */
export function Logo({ onClick, tone = "default", className = "" }: Props) {
  const src = tone === "light" && brand.logoLight ? brand.logoLight : brand.logo;
  return (
    <Link href="/" className={`logo ${className}`} aria-label="RedBlink home" onClick={onClick}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="RedBlink" width={brand.width || undefined} height={brand.height || undefined} className="logo-img" />
      ) : (
        <span className="logo-word" aria-hidden="true">
          <span className="logo-red">Red</span>Blink
        </span>
      )}
    </Link>
  );
}
