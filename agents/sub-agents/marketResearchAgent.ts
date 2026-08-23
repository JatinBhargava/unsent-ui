import { runAgent } from "../lib/openai.js";

const SYSTEM_PROMPT = `You are a Market Research Agent inside a product management pipeline.
Analyze market size, growth trends, target segments, and macro opportunities/risks for the
given product idea. Be concise, use bullet points, and cite the kind of evidence a PM would
look for (TAM/SAM/SOM estimates, adoption trends, timing). Do not invent precise statistics;
frame estimates as directional.`;

export async function runMarketResearchAgent(productIdea: string): Promise<string> {
  return runAgent(
    SYSTEM_PROMPT,
    `Product idea: ${productIdea}\n\nProduce a market research brief covering: market size & trends, target segments, and timing/opportunity.`,
  );
}
