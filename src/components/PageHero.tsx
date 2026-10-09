import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";
import { HeroText } from "./HeroText";

type Props = {
  title: string;
  lede?: string;
  crumbs: { name: string; path: string }[];
  children?: ReactNode;
  /** Interactive visual shown beside the title on wide screens. */
  aside?: ReactNode;
  /** Replaces the default animated title (e.g. the About page autocomplete). */
  titleNode?: ReactNode;
};

export function PageHero({ title, lede, crumbs, children, aside, titleNode }: Props) {
  return (
    <section className={`page-hero ${aside ? "has-aside" : ""}`}>
      <div className="container">
        <Breadcrumbs items={crumbs} />
        <div className="page-hero-grid">
          <div>
            {titleNode ?? <HeroText title={title} lede={lede} />}
            {titleNode && lede && <p className="lede">{lede}</p>}
            {children}
          </div>
          {aside && <div className="page-hero-aside">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
