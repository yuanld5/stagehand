import { deepseek } from "@ai-sdk/deepseek";
import { z } from "zod";
import { generateObject /*generateText*/ } from "ai";

const model = deepseek("deepseek-chat"); // 或 'gpt-4.1', 'o3-mini' 等
// got the same issue.
async function main() {
  const returnAction = true;

  const observeSchema = z.object({
    elements: z
      .array(
        z.object({
          elementId: z
            .string()
            .describe(
              "the ID string associated with the element. Never include surrounding square brackets. This field must follow the format of 'number-number'.",
            ),
          description: z
            .string()
            .describe(
              "a description of the accessible element and its purpose",
            ),
          ...(returnAction
            ? {
              method: z
                .string()
                .describe(
                  "the candidate method/action to interact with the element. Select one of the available Playwright interaction methods.",
                ),
              arguments: z.array(
                z
                  .string()
                  .describe(
                    "the arguments to pass to the method. For example, for a click, the arguments are empty, but for a fill, the arguments are the value to fill in.",
                  ),
              ),
            }
            : {}),
        }),
      )
      .describe("an array of accessible elements that match the instruction"),
  });

  const { object, usage } = await generateObject({
    model,
    messages: [
      {
        role: "system",
        content:
          " You are helping the user automate the browser by finding elements based on what the user wants to observe in the page. You will be given: 1. a instruction of elements to observe 2. a hierarchical accessibility tree showing the semantic structure of the page. The tree is a hybrid of the DOM and the accessibility tree. Return an array of elements that match the instruction if they exist, otherwise return an empty array.",
      },
      {
        role: "user",
        content:
          "instruction: What can I click on this page?\nAccessibility Tree: \n[0-3] RootWebArea: Google\n  [0-12] scrollable\n    [0-46] body\n      [0-50] div\n        [0-54] navigation\n          [0-57] link: About\n          [0-59] link: Store\n          [0-62] div\n            [0-64] div\n              [0-66] link: Gmail\n              [0-69] link: Search for Images\n                [0-70] StaticText: Images\n            [0-73] button: Google apps\n              [0-76] image\n            [0-80] link: Sign in\n        [0-92] image: Google\n        [0-2] search\n          [0-136] div\n            [0-140] div\n              [0-1] combobox: Search\n              [0-155] div\n                [0-168] div\n                  [0-171] button: Search by voice\n                  [0-176] button: Search by image\n                [0-179] link: AI Mode\n            [0-357] center\n              [0-358] button: Google Search\n              [0-6] button: I'm Feeling Lucky\n        [0-428] contentinfo\n          [0-431] div\n            [0-432] div\n              [0-433] link: Advertising\n              [0-435] link: Business\n              [0-437] link: How Search works\n            [0-440] link: Applying AI towards science and the environment\n            [0-442] div\n              [0-443] link: Privacy\n              [0-5] link: Terms\n              [0-453] button: Settings\n      [0-530] dialog: Sign in to Google\n        [0-540] div\n          [0-542] StaticText: Sign in to Google\n          [0-544] StaticText: Get the most from your Google account\n          [0-545] div\n            [0-547] button: Stay signed out\n            [0-555] button: Sign in\n",
      },
    ],
    schema: observeSchema,
  });

  // console.log('Output:', text);
  console.log("Output:", object);
  console.log("Usage:", usage);
  // console.log('Warnings:', warnings);
}

main();
