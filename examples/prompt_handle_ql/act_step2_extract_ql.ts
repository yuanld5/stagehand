import { deepseek } from "@ai-sdk/deepseek";
import { z } from "zod";
import { generateObject /*generateText*/ } from "ai";

const model = deepseek("deepseek-chat"); // 或 'gpt-4.1', 'o3-mini' 等

async function main() {
  // Formator
  const schema = z.object({
    elementId: z.string(),
    description: z.string(),
    method: z.string(),
  });

  const { object, usage } = await generateObject({
    model,
    messages: [
    ],
    schema,
  });

  // console.log('Output:', text);
  console.log("Output:", object);
  console.log("Usage:", usage);
  // console.log('Warnings:', warnings);
}

main();
