import { runAgent } from "../lib/openai.js";
import type { ResearchBundle } from "../lib/types.js";

const SYSTEM_PROMPT = `You are a Feature Discovery Agent inside a product management pipeline.
Given market research, user research, and competitor analysis, synthesize a list of candidate
features/capabilities. For each feature give a short name and a one-line description of the
user need it addresses. Aim for 8-12 candidates, grouped loosely by theme.`;

export async function runFeatureDiscoveryAgent(
  productIdea: string,
  research: ResearchBundle,
): Promise<string> {
  return runAgent(
    SYSTEM_PROMPT,
    [
      `Product idea: ${productIdea}`,
      `\n## Market Research\n${research.marketResearch}`,
      `\n## User Research\n${research.userResearch}`,
      `\n## Competitor Analysis\n${research.competitorAnalysis}`,
      `\nSynthesize the candidate feature list.`,
    ].join("\n"),
  );
}