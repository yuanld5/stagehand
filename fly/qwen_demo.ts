import { Stagehand } from "@/lib/index";
// import { AISdkClient } from "../examples/external_clients/aisdk";
import { z } from "zod";
// import { openai } from "@ai-sdk/openai";

async function example() {
  const stagehand = new Stagehand({
    env: "LOCAL",
    verbose: 1,
    enableCaching: false,
    modelName: "qwen",
    modelClientOptions: {
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    },
    // llmClient: new AISdkClient({
    //   model: openai("qwen-2.5-32b"),
    // }),
  });

  await stagehand.init();
  await stagehand.page.goto("https://github.com/browserbase/stagehand");
  await stagehand.page.act({ action: "click on the contributors" });
  const contributor = await stagehand.page.extract({
    instruction: "extract the top contributor",
    schema: z.object({
      username: z.string(),
      url: z.string(),
    }),
  });
  console.log(`Our favorite contributor is ${contributor.username}`);
}

(async () => {
  await example();
})();
