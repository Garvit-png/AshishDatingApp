import raw from "@/data/site.json";
import { normalizeContent } from "./normalize";

/** Content baked into this deployment (from src/data/site.json). */
export const siteContent = normalizeContent(raw);
