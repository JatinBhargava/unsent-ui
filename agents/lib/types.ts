export interface ResearchBundle {
  marketResearch: string;
  userResearch: string;
  competitorAnalysis: string;
}

export interface PipelineResult extends ResearchBundle {
  productIdea: string;
  featureDiscovery: string;
  prioritization: string;
  roadmap: string;
  prd: string;
}