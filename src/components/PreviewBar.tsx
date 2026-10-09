"use client";
import { usePathname } from "next/navigation";

/** Shown while previewing CMS drafts. */
export function PreviewBar() {
  const path = usePathname();
  return (
    <div className="preview-bar" role="status">
      <span><b>Preview mode.</b> You&rsquo;re seeing unpublished drafts. Visitors still see the live version.</span>
      <a href={`/api/exit-preview/?path=${encodeURIComponent(path)}`}>Exit preview</a>
      <a href="/admin">Back to CMS</a>
    </div>
  );
}
