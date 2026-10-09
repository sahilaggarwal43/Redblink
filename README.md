# RedBlink website

Next.js 15 site with a built-in CMS (Payload 3) at `/admin`.

## Local development
```bash
npm install
cp .env.example .env          # fill DATABASE_URI, PAYLOAD_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run migrate               # create database tables
npm run dev                   # site on http://localhost:3000, CMS on /admin
```
Without `DATABASE_URI` the site runs on its built-in content and `/admin` is unavailable.

## Deploying on Vercel
1. Storage → add **Neon Postgres** (sets `POSTGRES_URL`) and a **Blob** store (sets `BLOB_READ_WRITE_TOKEN`).
2. Add `PAYLOAD_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`.
3. Deploy. `npm run vercel-build` applies migrations and builds. On first start the CMS creates the default
   roles, the first administrator and loads all current site content.

## CMS: how publishing works
Edit → **Save draft** → **Preview** → set Review status to **Pending approval** → an approver sets **Approved**
→ a publisher clicks **Publish**. The live site refreshes automatically within seconds.

- Nothing can be published unless it has been approved, by anyone, including administrators.
- Editing approved content sends it back to draft for re-approval.
- Two people can't edit the same item at once (document locking); every save is kept in **Versions** and can be restored.
- **Administration → Activity log** records who did what and when.

### Default roles (editable under Administration → Roles)
| Role | Can do |
| --- | --- |
| Administrator | Everything, including users, roles and settings |
| Editor | Create and edit content, submit for approval |
| Creator | Create drafts and edit only their own items |
| SEO Specialist | Edit SEO fields (meta, canonical, Open Graph, indexing, sitemap, JSON-LD) on every page |
| Approver | Approve and publish changes, view activity log |

Roles can also be limited to specific pages, and users can be disabled without deleting them.

## Changing the database schema
After editing collections in `src/cms`, run `npm run payload migrate:create <name>` and commit the new file in `src/migrations`.
