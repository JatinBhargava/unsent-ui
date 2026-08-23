import { runAgent } from "../lib/openai.js";

const SYSTEM_PROMPT = `You are a Requirements Agent inside a product management pipeline.
Given a product roadmap and its "Now" phase features, write a Product Requirements Document
(PRD) for the highest-priority "Now" feature(s). Include: Overview, Problem Statement, Goals &
Non-Goals, User Stories, Functional Requirements, Success Metrics, and Open Questions. Use
markdown headings.`;

export async function runPRDAgent(
  productIdea: string,
  context: { prioritization: string; roadmap: string },
): Promise<string> {
  return runAgent(
    SYSTEM_PROMPT,
    [
      `Product idea: ${productIdea}`,
      `\n## Prioritized Features\n${context.prioritization}`,
      `\n## Roadmap\n${context.roadmap}`,
      `\nWrite the PRD for the top "Now" feature(s).`,
    ].join("\n"),
  );
}