import { getLatestPosts } from "@/lib/wordpress";
import { Reveal } from "./Reveal";

export async function LatestPosts() {
  const posts = await getLatestPosts(3);
  return (
    <div className="posts">
      {posts.map((p, i) => (
        <Reveal key={p.link} delay={i * 0.08}>
          <a href={p.link} className="post">
            <div className="post-img">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt="" loading="lazy" />
              ) : (
                <svg className="ph" viewBox="0 0 320 200" preserveAspectRatio="none" aria-hidden="true">
                  {Array.from({ length: 9 }).map((_, r) => (
                    <path key={r} d={`M0 ${30 + r * 18} C 80 ${22 + r * 18 + (i + r) % 3 * 6}, 160 ${38 + r * 18 - (i * 2 + r) % 4 * 5}, 320 ${28 + r * 18}`} fill="none" stroke={r === 3 + i ? "var(--red)" : "rgba(255,255,255,.22)"} strokeWidth={r === 3 + i ? 2 : 1} />
                  ))}
                </svg>
              )}
            </div>
            <time dateTime={p.date}>{new Date(p.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
            <h3>{p.title}</h3>
            <p>{p.excerpt}</p>
          </a>
        </Reveal>
      ))}
    </div>
  );
}
