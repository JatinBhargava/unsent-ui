import OpenAI from "openai";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing OPENAI_API_KEY environment variable.");
    }
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

export const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o";

export async function runAgent(
  systemPrompt: string,
  userPrompt: string,
  model: string = DEFAULT_MODEL,
): Promise<string> {
  const response = await getClient().chat.completions.create({
    model,
    temperature: 0.4,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error(`Agent call to ${model} returned an empty response.`);
  }
  return content.trim();
}
