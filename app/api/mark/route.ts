import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const { subject, question, markScheme, studentAnswer, marks } = await req.json();

  const prompt = `You are a GCSE examiner marking a student's answer.

Subject: ${subject}
Question (${marks} marks): ${question}

Mark Scheme:
${markScheme}

Student's Answer:
${studentAnswer}

Mark this answer strictly against the mark scheme. Respond in this exact JSON format:
{
  "score": <number 0-${marks}>,
  "feedback": "Overall comment on the answer quality",
  "awarded": ["Point you gave credit for", "Another point awarded"],
  "missed": ["Point not addressed", "Another missed point"],
  "improvements": "Specific advice on what to add or change to score full marks"
}

Be fair but strict — only award marks for points clearly addressed. Do not add text outside the JSON.`;

  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    thinking: { type: "adaptive" },
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return Response.json({ error: "Failed to parse marking response" }, { status: 500 });
  }

  return Response.json(JSON.parse(jsonMatch[0]));
}
