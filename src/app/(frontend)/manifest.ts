import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "RedBlink", short_name: "RedBlink", start_url: "/", display: "standalone", background_color: "#fdfafb", theme_color: "#e0102e", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }] };
}
