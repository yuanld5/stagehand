import { deepseek } from "@ai-sdk/deepseek";
import { z } from "zod";
import { generateObject /*generateText*/ } from "ai";

const model = deepseek("deepseek-chat"); // 或 'gpt-4.1', 'o3-mini' 等

async function main() {
  const metadataSchema = z.object({
    progress: z
      .string()
      .describe(
        "progress of what has been extracted so far, as concise as possible",
      ),
    completed: z
      .boolean()
      .describe(
        "true if the goal is now accomplished. Use this conservatively, only when sure that the goal has been completed.",
      ),
  });

  const { object, usage } = await generateObject({
    model,
    messages: [
      {
        "role": "system",
        "content": "You are an AI assistant tasked with evaluating the progress and completion status of an extraction task.\nAnalyze the extraction response and determine if the task is completed or if more information is needed.\nStrictly abide by the following criteria:\n1. Once the instruction has been satisfied by the current extraction response, ALWAYS set completion status to true and stop processing, regardless of remaining chunks.\n2. Only set completion status to false if BOTH of these conditions are true:\n   - The instruction has not been satisfied yet\n   - There are still chunks left to process (chunksTotal > chunksSeen)"
      },
      {
        "role": "user",
        "content": "Instruction: extract the top contributor\nExtracted content: {\n  \"username\": \"tkattkat\",\n  \"url\": \"https://github.com/tkattkat\"\n}\nchunksSeen: 1\nchunksTotal: 1"
      }
    ],
    schema: metadataSchema,
  });

  // console.log('Output:', text);
  console.log("Output:", object);
  console.log("Usage:", usage);
  // console.log('Warnings:', warnings);
}

main();
