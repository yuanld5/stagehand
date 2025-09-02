import { Stagehand } from "@/lib/index";
import { AISdkClient } from "../examples/external_clients/aisdk";
import { deepseek } from "@ai-sdk/deepseek";
import { z } from "zod";

// // AgentQL
import { wrap, configure } from "agentql";
import { chromium } from "playwright";

async function example() {
  const stagehand = new Stagehand({
    env: "LOCAL",
    verbose: 2,
    enableCaching: false,
    modelName: "deepseek",
    modelClientOptions: {
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    },
    llmClient: new AISdkClient({
      model: deepseek("deepseek-chat"),
    }),
  });

  // const browser = await chromium.launch({headless: false});
  // const page = await wrap(await browser.newPage());
  // await page.goto('https://github.com/browserbase/stagehand');
  // const contributorButton = await page.getByPrompt('contributors button');
  // await contributorButton.click();

  await stagehand.init();
  await stagehand.page.goto("https://github.com/browserbase/stagehand");
  // const observeResult = await stagehand.page.observe("What can I click on this page?");
  // console.log(`Observe result:\n`, observeResult);
  // await stagehand.page.observe("find contributors buttons");
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
