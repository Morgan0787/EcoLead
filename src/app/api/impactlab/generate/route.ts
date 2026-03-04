import { handleGenerateImpactPlanPost } from "@/lib/impactlab/generate-plan";

// Keep this route intentionally thin to avoid merge conflicts in API entrypoint files.
export const POST = handleGenerateImpactPlanPost;
