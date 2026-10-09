import { createHash } from "node:crypto";

/** Secret shared by the admin preview links and /api/preview. Derived from PAYLOAD_SECRET unless set. */
export const previewSecret = () =>
  process.env.PREVIEW_SECRET || createHash("sha256").update(`preview:${process.env.PAYLOAD_SECRET || ""}`).digest("hex").slice(0, 32);

export const previewUrl = (path: string) => `/api/preview/?secret=${previewSecret()}&path=${encodeURIComponent(path)}`;
