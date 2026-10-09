"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, Phone, X, Plus, Minus } from "lucide-react";
import { Logo } from "./Logo";
import { categories, services as staticServices, type CategoryId } from "@/data/services";
import { site as staticSite } from "@/data/site";
import { productList } from "@/data/products";

type NavProduct = { id: string; name: string; kind: string };
type NavService = { slug: string; title: string; category: CategoryId };

type MenuId = "services" | "products" | null;

const links = [
  { href: "/industries/", label: "Industries" },
  { href: "/hire/", label: "Hire engineers" },
  { href: "/work/", label: "Work" },
  { href: "/about/", label: "About" },
];

export function Header({
  site = staticSite,
  services = staticServices,
  products = productList.map((p) => ({ id: p.slug, name: p.name, kind: p.kind })),
}: { site?: typeof staticSite; services?: NavService[]; products?: NavProduct[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<MenuId>(null);
  const [cat, setCat] = useState<CategoryId>("genai");
  const [drawer, setDrawer] = useState(false);
  const [drawerSub, setDrawerSub] = useState<MenuId>(null);
  const [scrolled, setScrolled] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [drawerTop, setDrawerTop] = useState(80);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!drawer) return;
    const place = () => setDrawerTop(Math.max(0, headerRef.current?.getBoundingClientRect().bottom ?? 80));
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [drawer]);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(null); setDrawer(false); }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(null); setDrawer(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawer]);

  const enter = (id: MenuId) => { if (timer.current) clearTimeout(timer.current); setOpen(id); };
  const leave = () => { timer.current = setTimeout(() => setOpen(null), 140); };
  const active = categories.find((c) => c.id === cat)!;
  const catServices = services.filter((s) => s.category === cat);

  return (
    <header ref={headerRef} className={`site-header ${scrolled ? "scrolled" : ""}`} onMouseLeave={leave}>
      <div className="container hdr">
        <Logo onClick={() => setDrawer(false)} />

        <nav className="nav" aria-label="Main">
          <button className="nav-trigger" aria-expanded={open === "services"} aria-controls="mega-services" onMouseEnter={() => enter("services")} onClick={() => setOpen(open === "services" ? null : "services")}>
            Services <ChevronDown size={15} />
          </button>
          {links.slice(0, 2).map((l) => (
            <Link key={l.href} href={l.href} aria-current={pathname.startsWith(l.href) ? "page" : undefined} onMouseEnter={() => setOpen(null)}>{l.label}</Link>
          ))}
          <button className="nav-trigger" aria-expanded={open === "products"} aria-controls="mega-products" onMouseEnter={() => enter("products")} onClick={() => setOpen(open === "products" ? null : "products")}>
            Products <ChevronDown size={15} />
          </button>
          {links.slice(2).map((l) => (
            <Link key={l.href} href={l.href} aria-current={pathname.startsWith(l.href) ? "page" : undefined} onMouseEnter={() => setOpen(null)}>{l.label}</Link>
          ))}
          <a href={site.blogUrl} onMouseEnter={() => setOpen(null)}>Insights</a>
        </nav>

        <div className="hdr-right">
          <a className="hdr-phone" href={site.phoneHref}><Phone size={15} /> {site.phone}</a>
          <Link href="/contact/" className="btn btn-red btn-sm">Talk to an expert <ArrowRight size={16} /></Link>
          <button className="burger" aria-label={drawer ? "Close menu" : "Open menu"} aria-expanded={drawer} aria-controls="mobile-menu" onClick={() => setDrawer(!drawer)}>
            {drawer ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key={open}
            className="mega"
            id={`mega-${open}`}
            onMouseEnter={() => enter(open)}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 0.61, 0.12, 1] }}
          >
            <div className="container">
              {open === "services" ? (
                <div className="mega-inner">
                  <div className="mega-cats" role="tablist" aria-label="Service practices" aria-orientation="vertical">
                    {categories.map((c) => (
                      <button key={c.id} role="tab" aria-selected={cat === c.id} className="mega-cat" onMouseEnter={() => setCat(c.id)} onFocus={() => setCat(c.id)} onClick={() => setCat(c.id)}>
                        {c.name}
                        <span className="count">{services.filter((s) => s.category === c.id).length}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mega-panel" role="tabpanel">
                    <div className="mega-panel-head">
                      <strong className="mega-title">{active.name}</strong>
                      <p>{active.blurb}</p>
                    </div>
                    <motion.div key={cat} className="mega-links" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
                      {catServices.map((s) => (
                        <Link key={s.slug} href={`/services/${s.slug}/`}>{s.title}</Link>
                      ))}
                    </motion.div>
                    <div className="mega-foot">
                      <Link href="/services/" className="link-arrow">View all {services.length} services <ArrowRight size={16} /></Link>
                      <Link href="/contact/" className="link-arrow">Not sure? Talk to an architect <ArrowRight size={16} /></Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mega-simple">
                  {products.slice(0, 8).map((p) => (
                    <Link key={p.id} href={`/products/${p.id}/`}>
                      <strong>{p.name}</strong>
                      <span>{p.kind}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />

      {mounted && createPortal(
      <AnimatePresence>
        {drawer && (
          <motion.nav id="mobile-menu" className="drawer" aria-label="Mobile" style={{ top: drawerTop }} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            <div className="drawer-sec">
              <button aria-expanded={drawerSub === "services"} onClick={() => setDrawerSub(drawerSub === "services" ? null : "services")}>
                Services {drawerSub === "services" ? <Minus size={18} /> : <Plus size={18} />}
              </button>
              {drawerSub === "services" && (
                <div className="drawer-sub">
                  {categories.map((c) => (
                    <div key={c.id} style={{ display: "contents" }}>
                      <b>{c.name}</b>
                      {services.filter((s) => s.category === c.id).map((s) => (
                        <Link key={s.slug} href={`/services/${s.slug}/`} onClick={() => setDrawer(false)}>{s.title}</Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="drawer-sec">
              <button aria-expanded={drawerSub === "products"} onClick={() => setDrawerSub(drawerSub === "products" ? null : "products")}>
                Products {drawerSub === "products" ? <Minus size={18} /> : <Plus size={18} />}
              </button>
              {drawerSub === "products" && (
                <div className="drawer-sub">
                  {products.map((p) => <Link key={p.id} href={`/products/${p.id}/`} onClick={() => setDrawer(false)}>{p.name}</Link>)}
                </div>
              )}
            </div>
            {links.map((l) => (
              <div className="drawer-sec" key={l.href}><Link href={l.href} onClick={() => setDrawer(false)}>{l.label}</Link></div>
            ))}
            <div className="drawer-sec"><Link href="/careers/" onClick={() => setDrawer(false)}>Careers</Link></div>
            <div className="drawer-sec"><a href={site.blogUrl} onClick={() => setDrawer(false)}>Insights</a></div>
            <div className="drawer-cta">
              <Link href="/contact/" className="btn btn-red" onClick={() => setDrawer(false)}>Talk to an expert <ArrowRight size={18} /></Link>
              <a href={site.phoneHref} className="btn btn-ghost" onClick={() => setDrawer(false)}><Phone size={18} /> {site.phone}</a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>, document.body)}
    </header>
  );
}
