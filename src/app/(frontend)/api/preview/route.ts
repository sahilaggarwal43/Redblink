import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { previewSecret } from "@/cms/preview";

// Turns on draft preview for CMS users. Linked from the "Preview" button in /admin.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const path = url.searchParams.get("path") || "/";
  if (url.searchParams.get("secret") !== previewSecret() || !path.startsWith("/")) {
    return new Response("Invalid preview link", { status: 401 });
  }
  (await draftMode()).enable();
  redirect(path);
}
