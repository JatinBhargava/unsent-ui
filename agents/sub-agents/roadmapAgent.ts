import { runAgent } from "../lib/openai.js";

const SYSTEM_PROMPT = `You are a Product Roadmap Agent inside a product management pipeline.
Given a prioritized/ranked feature list, organize it into a phased roadmap using Now / Next /
Later horizons. For each phase, list the features included and a one-line goal/theme for that
phase. Keep it concise and actionable.`;

export async function runRoadmapAgent(
  productIdea: string,
  prioritization: string,
): Promise<string> {
  return runAgent(
    SYSTEM_PROMPT,
    `Product idea: ${productIdea}\n\n## Prioritized Features\n${prioritization}\n\nBuild the Now/Next/Later roadmap.`,
  );
}