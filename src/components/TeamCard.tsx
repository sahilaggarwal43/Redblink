import { Linkedin } from "lucide-react";
import photos from "@/data/team-photos.json";

type Member = { name: string; role: string; linkedin: string; photo?: string | null };
const slugify = (n: string) => n.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Team member card. Photos are synced from redblink.com by scripts/fetch-brand.mjs. */
export function TeamCard({ m }: { m: Member }) {
  const photo = m.photo ?? (photos as Record<string, string>)[slugify(m.name)];
  const initials = m.name.split(" ").map((p) => p[0]).join("");
  return (
    <article className="person">
      <div className="person-photo">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={`${m.name}, ${m.role} at RedBlink`} loading="lazy" decoding="async" />
        ) : (
          <span className="person-initials" aria-hidden="true">{initials}</span>
        )}
        <a className="person-in" href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on LinkedIn`}>
          <Linkedin size={16} />
        </a>
      </div>
      <h3 className="person-name">{m.name}</h3>
      <p className="person-role">{m.role}</p>
    </article>
  );
}
