import { SITE_URL } from "@/lib/schema";

/**
 * AI crawlers, named explicitly.
 *
 * A bare `User-agent: *  Allow: /` already permits all of these, so none of it
 * is strictly required. It is here because several of these crawlers are
 * opt-out by convention rather than by rule, and an explicit Allow removes any
 * ambiguity about intent: nothing on this site should be withheld from a model
 * that is trying to work out who Kane is.
 *
 * They fall into three groups, and the distinction matters:
 *
 *   Training       GPTBot, ClaudeBot, Google-Extended, Applebot-Extended.
 *                  Feeds the model itself. Slow payoff, long memory.
 *   Retrieval      OAI-SearchBot, PerplexityBot. Fetches pages to answer a
 *                  live query and cite them. This is the one that shows up in
 *                  an answer today.
 *   User fetch     ChatGPT-User, Claude-Web. Fired when a person asks the
 *                  assistant to go and look at this specific site.
 *
 * Google-Extended and Applebot-Extended are permission tokens only: they do
 * not crawl, they govern what Gemini and Apple Intelligence may use from what
 * Googlebot and Applebot already fetched.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Applebot",
  "Bingbot",
  "meta-externalagent",
  "Amazonbot",
  "cohere-ai",
  "DuckAssistBot",
  "MistralAI-User",
  "YouBot",
];

/** Emitted as /robots.txt at build time. */
export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
