import { answerStoryQuestion } from "@/lib/agent";
import { getStory } from "@/lib/newsroom";
import { createConfiguredEvidenceSelector } from "@/lib/provider";

export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return Response.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const { slug, question } = (input ?? {}) as {
    slug?: unknown;
    question?: unknown;
  };
  if (typeof slug !== "string" || typeof question !== "string")
    return Response.json(
      { error: "A story slug and question are required." },
      { status: 400 },
    );

  const story = getStory(slug);
  if (!story)
    return Response.json({ error: "Story not found." }, { status: 404 });

  const cleanQuestion = question.trim().slice(0, 500);
  if (!cleanQuestion)
    return Response.json({ error: "Please ask a question." }, { status: 400 });

  const answer = await answerStoryQuestion(
    cleanQuestion,
    story,
    createConfiguredEvidenceSelector(),
  );
  return Response.json(answer, {
    headers: { "cache-control": "no-store" },
  });
}
