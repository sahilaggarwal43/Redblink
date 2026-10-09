import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="nf container">
      <b aria-hidden="true">404</b>
      <h1 className="h-md">This page isn&rsquo;t here.</h1>
      <p className="lede">It may have moved when we rebuilt the site. These will get you back on track.</p>
      <div className="hero-ctas" style={{ marginTop: ".5rem" }}>
        <Link className="btn btn-red" href="/">Go to homepage <ArrowRight size={18} /></Link>
        <Link className="link-arrow" href="/services/">Browse services <ArrowRight size={16} /></Link>
        <Link className="link-arrow" href="/contact/">Contact us <ArrowRight size={16} /></Link>
      </div>
    </section>
  );
}
