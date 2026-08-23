import { runAgent } from "../lib/openai.js";

const SYSTEM_PROMPT = `You are a Prioritization Agent inside a product management pipeline.
Given a candidate feature list, score each feature using a RICE-style approach (Reach, Impact,
Confidence, Effort) on a 1-5 scale where relevant, compute a rough priority score, and rank the
features from highest to lowest priority. Present the result as a markdown table followed by a
short rationale for the top 3 picks.`;

export async function runPrioritizationAgent(
  productIdea: string,
  featureDiscovery: string,
): Promise<string> {
  return runAgent(
    SYSTEM_PROMPT,
    `Product idea: ${productIdea}\n\n## Candidate Features\n${featureDiscovery}\n\nScore and rank these features.`,
  );
}