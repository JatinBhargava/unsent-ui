import { config } from "dotenv";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runProductManagerAgent } from "./orchestrator.js";
import type { PipelineResult } from "./lib/types.js";

config({ path: join(dirname(fileURLToPath(import.meta.url)), ".env") });

function buildMarkdown(result: PipelineResult): string {
  return `# Product Requirements Document

## Product Idea
${result.productIdea}

## Market Research
${result.marketResearch}

## User Research
${result.userResearch}

## Competitor Analysis
${result.competitorAnalysis}

## Feature Discovery
${result.featureDiscovery}

## Prioritization
${result.prioritization}

## Product Roadmap
${result.roadmap}

## Requirements / PRD
${result.prd}
`;
}

async function main() {
  const productIdea = process.argv.slice(2).join(" ").trim();
  if (!productIdea) {
    console.error('Usage: npm run pm-agent -- "<product idea>"');
    process.exit(1);
  }
  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY environment variable. Set it in .env or your shell.");
    process.exit(1);
  }

  const result = await runProductManagerAgent(productIdea);
  const doc = buildMarkdown(result);

  const outDir = join(process.cwd(), "agents", "output");
  mkdirSync(outDir, { recursive: true });
  const filepath = join(outDir, `prd-${Date.now()}.md`);
  writeFileSync(filepath, doc, "utf-8");

  console.log("\n" + doc);
  console.log(`\n[PM Agent] Saved PRD to ${filepath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});