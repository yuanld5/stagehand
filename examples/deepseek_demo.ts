import { Stagehand } from "@/lib/index";
import { AISdkClient } from "../examples/external_clients/aisdk";
import { deepseek } from "@ai-sdk/deepseek";
import { z } from "zod";

async function example() {
  const stagehand = new Stagehand({
    env: "LOCAL",
    verbose: 2,
    enableCaching: false,
    modelName: "deepseek",
    // do not need it, it can work well.
    // todo: 这说明modelClientOptions的配置是不管用的，只是环境变量管用。
    // modelClientOptions: {
    //   apiKey: process.env.DEEPSEEK_API_KEY,
    //   baseURL: "https://api.deepseek.com/v1",
    // },
    llmClient: new AISdkClient({
      model: deepseek("deepseek-chat"),
    }),
  });

  await stagehand.init();
  await stagehand.page.goto("https://github.com/browserbase/stagehand");

  // await stagehand.page.goto("https://www.google.com");
  // const observeResult = await stagehand.page.observe("What can I click on this page?");
  // console.log(`Observe result:\n`, observeResult);

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
