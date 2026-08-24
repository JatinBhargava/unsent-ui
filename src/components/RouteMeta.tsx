import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_NAME = "Unsent";

const DEFAULT_META = {
  title: "Unsent — Write what you never meant to send",
  description:
    "Unsent is a shared diary for people who love to write. Keep your pages private, or invite others to read and write alongside you — one diary page at a time.",
};

type PageMeta = typeof DEFAULT_META;

// Titles mirror each page's <h1> — a title that doesn't describe the content
// is the thing SEO audits flag.
const ROUTE_META: Record<string, PageMeta> = {
  "/": DEFAULT_META,
  "/login": {
    title: "Open your diary — log in to Unsent",
    description:
      "Log in to Unsent to read diaries, write your own pages, and pick up where you left off.",
  },
  "/register": {
    title: "Start a new diary — join Unsent",
    description:
      "Create an Unsent account and start a diary. Write privately, or open your pages to readers who write back.",
  },
  "/diaries": {
    title: "Diaries — words left open on Unsent",
    description:
      "Read diary pages people chose to share, and keep track of the ones you wrote yourself.",
  },
  "/write": {
    title: "What's on your mind? — write on Unsent",
    description:
      "Write a diary page on Unsent. Keep it private, or publish it for others to read and add to.",
  },
  "/friends": {
    title: "Your circle — friends on Unsent",
    description:
      "See who you write alongside on Unsent, handle friend requests, and pick up your conversations.",
  },
  "/events": {
    title: "Community events on Unsent",
    description: "Writing prompts, shared pages, and community events happening on Unsent.",
  },
  "/wod": {
    title: "Win of the Day on Unsent",
    description: "One small win, written down each day. Read today's, then add your own.",
  },
  "/profile": {
    title: `Your profile · ${SITE_NAME}`,
    description: "Your Unsent profile — display name, details, and the interests you write about.",
  },
  "/about": {
    title: `About · ${SITE_NAME}`,
    description: "Who built Unsent and why — a shared space for quiet writing.",
  },
  "/privacy": {
    title: `Privacy Policy · ${SITE_NAME}`,
    description: "How Unsent handles your diary pages, your account, and your data.",
  },
  "/terms": {
    title: `Terms & Conditions · ${SITE_NAME}`,
    description: "The terms you agree to when you write and read on Unsent.",
  },
  "/changelog": {
    title: `Open Source Changelog · ${SITE_NAME}`,
    description: "What shipped on Unsent, release by release, in the open.",
  },
};

function metaFor(pathname: string): PageMeta {
  const exact = ROUTE_META[pathname];
  if (exact) return exact;

  if (pathname.startsWith("/diary/")) {
    return {
      title: `Diary entry · ${SITE_NAME}`,
      description: "A diary page shared on Unsent — read it, or add your own words to it.",
    };
  }
  if (pathname.startsWith("/messages/")) {
    return {
      title: `Conversation · ${SITE_NAME}`,
      description: "Your conversation with someone you write alongside on Unsent.",
    };
  }

  return DEFAULT_META;
}

function setMetaContent(selector: string, content: string) {
  document.head.querySelector(selector)?.setAttribute("content", content);
}

/** Keeps the document title and description in step with the current route. */
export default function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const { title, description } = metaFor(pathname);

    document.title = title;

    let tag = document.head.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", description);

    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[name="twitter:description"]', description);
    setMetaContent('meta[property="og:url"]', window.location.href);
    document.head
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", window.location.origin + pathname);
  }, [pathname]);

  return null;
}
