import { runAgent } from "../lib/openai.js";

const SYSTEM_PROMPT = `You are a User Research Agent inside a product management pipeline.
Identify likely user personas, their jobs-to-be-done, pain points, and unmet needs relevant
to the given product idea. Be concise, use bullet points, and ground personas in realistic
behaviors and motivations rather than generic descriptions.`;

export async function runUserResearchAgent(productIdea: string): Promise<string> {
  return runAgent(
    SYSTEM_PROMPT,
    `Product idea: ${productIdea}\n\nProduce a user research brief covering: 2-3 key personas, their jobs-to-be-done, and top pain points/unmet needs.`,
  );
}