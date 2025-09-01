// process.env.GLOBAL_AGENT_HTTP_PROXY = "http://127.0.0.1:7890";
// require("global-agent/bootstrap");

import "dotenv/config";
import { Stagehand } from "../lib/index";

async function main() {
  const stagehand = new Stagehand({
    env: "LOCAL",
    verbose: 1,
    modelName: "gemini-1.5-flash",
    modelClientOptions: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  });

  await stagehand.init();

  console.log(`Stagehand Session Started`);
  console.log(
    `Watch live: https://browserbase.com/sessions/${stagehand.browserbaseSessionID}`,
  );

  const page = stagehand.page;

  await page.goto("https://stagehand.dev");

  const extractResult = await page.extract(
    "Extract the value proposition from the page.",
  );
  console.log(`Extract result:\n`, extractResult);

  const actResult = await page.act("Click the 'Evals' button.");
  console.log(`Act result:\n`, actResult);

  const observeResult = await page.observe("What can I click on this page?");
  console.log(`Observe result:\n`, observeResult);

  const agent = stagehand.agent({
    instructions: "You're a helpful assistant that can control a web browser.",
  });

  const agentResult = await agent.execute(
    "What is the most accurate model to use in Stagehand?",
  );
  console.log(`Agent result:\n`, agentResult);

  await stagehand.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
