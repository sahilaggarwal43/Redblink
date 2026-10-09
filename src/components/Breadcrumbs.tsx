import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb">
      <ol className="crumbs">
        {all.map((it, i) =>
          i === all.length - 1 ? (
            <li key={it.path}><span aria-current="page">{it.name}</span></li>
          ) : (
            <li key={it.path}><Link href={it.path}>{it.name}</Link></li>
          )
        )}
      </ol>
      <JsonLd data={breadcrumbLd(all)} />
    </nav>
  );
}
