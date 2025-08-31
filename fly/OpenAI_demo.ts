// import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod/v3";
// import { Stagehand } from "@/lib/index";
import { Stagehand } from "../lib/index"

/**
 * This example shows how to parameterize the API key for the LLM provider.
 *
 * In order to best demonstrate, unset the OPENAI_API_KEY environment variable and
 * set the USE_OPENAI_API_KEY environment variable to your OpenAI API key.
 *
 * export USE_OPENAI_API_KEY=$OPENAI_API_KEY
 * unset OPENAI_API_KEY
 */

async function example() {

  const stagehand = new Stagehand({
    env: "LOCAL",
    verbose: 1,
    enableCaching: false,
    modelName: "gpt-4o-mini",
    modelClientOptions: {
      apiKey: process.env.USE_OPENAI_API_KEY,
      // baseURL: "https://api.deepseek.com/v1",
    },
  });

  await stagehand.init();
  await stagehand.page.goto("https://github.com/browserbase/stagehand");
  await stagehand.page.act({ action: "click on the contributors" });
  // await stagehand.page.goto("https://www.baidu.com");
  // await stagehand.page.act({ action: "input 'ME'" });
  const contributor = await stagehand.page.extract({
    // instruction: "extract the top contributor",
    instruction: "extract the top Computer",
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
