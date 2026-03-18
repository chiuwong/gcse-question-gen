import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const { subject, topic, marks } = await req.json();

  const prompt = `You are an expert GCSE examiner writing a question for a student.

Subject: ${subject}
Topic: ${topic}
Marks: ${marks}

Generate ONE exam-style question worth ${marks} marks on this topic.

Respond in this exact JSON format:
{
  "question": "The full exam question text here",
  "markScheme": "A detailed mark scheme listing each point worth 1 mark, e.g.:\\n• Point 1 (1 mark)\\n• Point 2 (1 mark)\\netc."
}

Rules:
- Match the difficulty and style of real ${subject} GCSE exams
- For high-mark questions (6+), include command words like "Explain", "Evaluate", "Assess"
- Mark scheme should list exactly ${marks} distinct marking points
- For maths, show worked solution steps as marking points
- Keep language appropriate for GCSE level (age 15-16)
- Do not add any text outside the JSON`;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: "claude-opus-4-6",
          max_tokens: 1024,
          thinking: { type: "adaptive" },
          messages: [{ role: "user", content: prompt }],
        });

        let fullText = "";
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            fullText += event.delta.text;
          }
        }

        // Extract JSON from the response
        const jsonMatch = fullText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found in response");

        const data = JSON.parse(jsonMatch[0]);
        controller.enqueue(
          new TextEncoder().encode(JSON.stringify(data))
        );
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/json" },
  });
}
