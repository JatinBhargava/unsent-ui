import { useLocation } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Collapses the id-bearing paths to their route pattern. Without this every
// diary id becomes its own row in Speed Insights, so no single page ever
// gathers enough samples to report a score.
function routeFor(pathname: string): string {
  if (pathname.startsWith("/diary/")) return "/diary/[id]";
  if (pathname.startsWith("/messages/conversation/")) {
    return "/messages/conversation/[id]";
  }
  return pathname;
}

/** Reports Core Web Vitals, keyed by route pattern rather than raw pathname. */
export default function RouteSpeedInsights() {
  const { pathname } = useLocation();

  return <SpeedInsights route={routeFor(pathname)} />;
}
