import type { PipelineResult } from "./lib/types.js";
import { runMarketResearchAgent } from "./sub-agents/marketResearchAgent.js";
import { runUserResearchAgent } from "./sub-agents/userResearchAgent.js";
import { runCompetitorAgent } from "./sub-agents/competitorAgent.js";
import { runFeatureDiscoveryAgent } from "./sub-agents/featureDiscoveryAgent.js";
import { runPrioritizationAgent } from "./sub-agents/prioritizationAgent.js";
import { runRoadmapAgent } from "./sub-agents/roadmapAgent.js";
import { runPRDAgent } from "./sub-agents/prdAgent.js";

/**
 * Product Manager Agent: orchestrates research sub-agents in parallel, then runs
 * feature discovery -> prioritization -> roadmap -> PRD sequentially, since each
 * stage depends on the previous one's output.
 */
export async function runProductManagerAgent(productIdea: string): Promise<PipelineResult> {
  console.log("[PM Agent] Dispatching Market Research, User Research, and Competitor agents...");
  const [marketResearch, userResearch, competitorAnalysis] = await Promise.all([
    runMarketResearchAgent(productIdea),
    runUserResearchAgent(productIdea),
    runCompetitorAgent(productIdea),
  ]);

  console.log("[PM Agent] Running Feature Discovery...");
  const featureDiscovery = await runFeatureDiscoveryAgent(productIdea, {
    marketResearch,
    userResearch,
    competitorAnalysis,
  });

  console.log("[PM Agent] Running Prioritization...");
  const prioritization = await runPrioritizationAgent(productIdea, featureDiscovery);

  console.log("[PM Agent] Building Product Roadmap...");
  const roadmap = await runRoadmapAgent(productIdea, prioritization);

  console.log("[PM Agent] Drafting Requirements / PRD...");
  const prd = await runPRDAgent(productIdea, { prioritization, roadmap });

  return {
    productIdea,
    marketResearch,
    userResearch,
    competitorAnalysis,
    featureDiscovery,
    prioritization,
    roadmap,
    prd,
  };
}