import { getPayload } from "payload";
import config from "../src/payload.config";
import { seed } from "../src/cms/seed";

process.env.CMS_SKIP_SEED = "1";
const payload = await getPayload({ config });
await seed(payload);
payload.logger.info("Seed complete");
process.exit(0);
