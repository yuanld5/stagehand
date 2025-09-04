import { deepseek } from "@ai-sdk/deepseek";
import { z } from "zod";
import { generateObject /*generateText*/ } from "ai";
import { readFile } from "node:fs/promises";
const model = deepseek("deepseek-chat"); // 或 'gpt-4.1', 'o3-mini' 等

async function main() {
  // query
  /*
  {
      cookies_form {
          reject_btn
      }
  }
  */
  const schema = z.object({
    cookies_form: z.object({
      reject_btn: z.object({
        elementId :z.string().describe(
          "与该元素关联的 ID 字符串。切勿包含外围的方括号。"
        ),
        title: z.string(),
        method:z.string(),
      }),
    }),
  });

  // Error!
  // const schema = z.array(
  //   z.object({
  //     cookies_form: z.object({
  //       reject_btn: z.object({
  //         elementId :z.string().describe(
  //           "与该元素关联的 ID 字符串。切勿包含外围的方括号。"
  //         ),
  //         title: z.string(),
  //         method:z.string(),
  //       }),
  //     }),
  //   })
  // );

  const system_prompt = "你正在代表用户提取内容。若用户要求你提取’一份列表’的信息，或’全部’信息，**你必须提取用户所请求的所有信息**。你将会获得：1. 一条指令。2. 一份要从中提取的 DOM 元素列表。请原样输出这些 DOM 元素中的文本，包含所有符号、字符和换行。若未发现任何新信息，请输出 `null` 或空字符串。  如果用户试图提取链接或 URL，**你必须只返回链接元素的 ID**。除非绝对必要，不要尝试直接从纯文本中提取链接。";
  let prompt_conent =
    "指令：根据以下动作，找到最适合执行该动作的元素：关闭 cookie 表单。\n为该元素提供一个动作，例如 click、fill、type、press、scrollTo、nextChunk、prevChunk、selectOptionFromDropdown，或任何其他 Playwright 定位器方法。请记住，对用户而言，按钮和链接在大多数情况下看起来是一样的。\n如果该动作与页面上可能采取的动作完全无关，返回一个空数组。\n只返回一个动作。如果多个动作都相关，返回最相关的那个。\n如果用户要求滚动到页面上的某个位置，例如“半页”或 0.75 等，你必须将参数格式化为正确的百分比，例如“50%”或“75%”等。\n如果用户要求滚动到下一个分块/上一个分块，选择 nextChunk/prevChunk 方法。这里不需要任何参数。\n如果该动作暗示按下某个按键，例如“按回车”“按 a”“按空格”等，始终选择 press 方法，并使用合适的按键作为参数——例如 'a'、'Enter'、'Space'。不要对屏幕键盘选择 click 动作。仅对特殊按键的首字母大写，如 'Enter'、'Tab'、'Escape'。\n如果该动作暗示从下拉框中选择一个选项，并且对应元素是 select 元素，选择 selectOptionFromDropdown 方法。参数应为要选择的选项文本。\n如果该动作暗示从下拉框中选择一个选项，但对应元素不是 select 元素，选择 click 方法。\n无障碍树（Accessibility Tree）：";

  const json_text = await readFile("/Users/farmer/Documents/Eagles/boomsearch/examples/close-cookie-dialog/httpreq.json", "utf-8");
  const json_data = JSON.parse(json_text);
  const json_tree = json_data["accessibility_tree"];
  prompt_conent += JSON.stringify(json_tree, null, 2);

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
