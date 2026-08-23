import { runAgent } from "../lib/openai.js";

const SYSTEM_PROMPT = `You are a Competitor Agent inside a product management pipeline.
Identify likely direct and indirect competitors or alternatives for the given product idea,
their positioning, strengths/weaknesses, and gaps a new entrant could exploit. Be concise
and use bullet points. Do not invent specific company names/facts you cannot be reasonably
confident about; you may refer to categories of competitors when unsure.`;

export async function runCompetitorAgent(productIdea: string): Promise<string> {
  return runAgent(
    SYSTEM_PROMPT,
    `Product idea: ${productIdea}\n\nProduce a competitor analysis covering: direct/indirect competitors, their positioning & strengths/weaknesses, and whitespace gaps.`,
  );
}
