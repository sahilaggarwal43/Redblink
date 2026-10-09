/** Database URL from whichever variable the hosting provider set (Neon sets DATABASE_URL / POSTGRES_URL). */
export const databaseUrl = () =>
  process.env.DATABASE_URI || process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || "";

export const cmsConfigured = () => !!databaseUrl() && !!process.env.PAYLOAD_SECRET;
