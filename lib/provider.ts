import type { EvidenceSelection, EvidenceSelector } from "./agent";
import type { Story } from "./newsroom";

type ChatCompletionResponse = {
  choices?: { message?: { content?: string } }[];
};

function extractJson(value: string) {
  const match = value.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Provider did not return JSON");
  return JSON.parse(match[0]) as EvidenceSelection;
}

export function createConfiguredEvidenceSelector(): EvidenceSelector | undefined {
  const endpoint = process.env.NEWSREN_PROVIDER_URL?.trim();
  const model = process.env.NEWSREN_PROVIDER_MODEL?.trim();
  const apiKey = process.env.NEWSREN_PROVIDER_API_KEY?.trim();
  if (!endpoint || !model) return undefined;

  return {
    name: "openai-compatible-evidence-selector",
    async select(question: string, story: Story) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({
          model,
          temperature: 0,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "You are an evidence selector, not a writer. Select at most four claim IDs that directly answer the question. Never create claims. Return only JSON: {\"claimIds\":[\"id\"],\"abstain\":boolean}. Abstain when the bounded bundle cannot answer.",
            },
            {
              role: "user",
              content: JSON.stringify({
                question,
                story: story.title,
                claims: story.claims.map((claim) => ({
                  id: claim.id,
                  kind: claim.kind,
                  text: claim.text,
                })),
              }),
            },
          ],
        }),
        signal: AbortSignal.timeout(8_000),
      });
      if (!response.ok) throw new Error(`Provider returned ${response.status}`);
      const payload = (await response.json()) as ChatCompletionResponse;
      const content = payload.choices?.[0]?.message?.content;
      if (!content) throw new Error("Provider response was empty");
      return extractJson(content);
    },
  };
}
