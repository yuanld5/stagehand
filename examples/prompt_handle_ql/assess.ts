import { deepseek } from "@ai-sdk/deepseek";
import { z } from "zod";
import { generateObject /*generateText*/ } from "ai";

const model = deepseek("deepseek-chat"); // 或 'gpt-4.1', 'o3-mini' 等

async function main() {

  const schema = z.any();

  const system_prompt = "你是一名 AI 助手，负责评估一个提取任务的进展与完成状态。请分析提取结果，并判断任务是否已经完成，或是否需要更多信息。严格遵守以下准则：1. 一旦当前的提取结果已经满足指令要求，始终将完成状态设为 true 并停止处理，不论是否还有剩余分块（chunks）。2. 只有在以下两个条件同时为真时，才将完成状态设为 false：- 指令尚未被满足；- 仍然有待处理的分块（chunksTotal > chunksSeen）。";
  const prompt_conent = "指令: 抽取最高贡献者。\n抽取内容: {\n  \"username\": \"tkattkat\",\n  \"url\": \"https://github.com/tkattkat\"\n}\nchunksSeen: 1\nchunksTotal: 1"

  const { object, usage } = await generateObject({
    model,
    system: system_prompt,
    prompt: prompt_conent,
    schema,
  });

  // console.log('Output:', text);
  console.log("Output:", object);
  console.log("Usage:", usage);
  // console.log('Warnings:', warnings);
}

main();
