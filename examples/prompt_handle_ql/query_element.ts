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
  // const schema = z.object({
  //   cookies_form: z.object({
  //     reject_btn: z.object({
  //       elementId :z.string().describe(
  //         "与该元素关联的 ID 字符串。切勿包含外围的方括号。"
  //       ),
  //       title: z.string(),
  //       method:z.string(),
  //     }),
  //   }),
  // });

  const schema = z.object({
    popup_form: z.object({
      close_btn: z.object({
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

  // const system_prompt = "你正在帮助用户通过在页面中定位元素来实现浏览器自动化，这些元素基于用户想要观察的内容。你将会获得：1. 一条关于需要观察哪些元素的指令；2. 一个展示页面语义结构的分层无障碍树。该树是 DOM 与无障碍树的混合体。请返回一个与指令匹配的元素数组；如果不存在匹配元素，则返回一个空数组；如果只有一个就返回一个值。";
  // let prompt_conent =
  //   "指令：根据以下动作，找到最适合执行该动作的元素：关闭 cookie 表单。\n为该元素提供一个动作，例如 click、fill、type、press、scrollTo、nextChunk、prevChunk、selectOptionFromDropdown，或任何其他 Playwright 定位器方法。请记住，对用户而言，按钮和链接在大多数情况下看起来是一样的。\n如果该动作与页面上可能采取的动作完全无关，返回一个空数组。\n只返回一个动作。如果多个动作都相关，返回最相关的那个。\n如果用户要求滚动到页面上的某个位置，例如“半页”或 0.75 等，你必须将参数格式化为正确的百分比，例如“50%”或“75%”等。\n如果用户要求滚动到下一个分块/上一个分块，选择 nextChunk/prevChunk 方法。这里不需要任何参数。\n如果该动作暗示按下某个按键，例如“按回车”“按 a”“按空格”等，始终选择 press 方法，并使用合适的按键作为参数——例如 'a'、'Enter'、'Space'。不要对屏幕键盘选择 click 动作。仅对特殊按键的首字母大写，如 'Enter'、'Tab'、'Escape'。\n如果该动作暗示从下拉框中选择一个选项，并且对应元素是 select 元素，选择 selectOptionFromDropdown 方法。参数应为要选择的选项文本。\n如果该动作暗示从下拉框中选择一个选项，但对应元素不是 select 元素，选择 click 方法。\n无障碍树（Accessibility Tree）：";
  const system_prompt = "你正在帮助用户通过在页面中定位元素来实现浏览器自动化，这些元素基于用户想要观察的内容。你将会获得：1. 一条关于需要观察哪些元素的指令；2. 一个展示页面语义结构的分层无障碍树。该树是 DOM 与无障碍树的混合体。请返回一个与指令匹配的元素数组；如果不存在匹配元素，则返回一个空数组；如果只有一个就返回一个值。";
  let prompt_conent =
    "指令：根据要求大模型输出的数据格式来查找元素。\n为该元素提供一个动作，例如 click、fill、type、press、scrollTo、nextChunk、prevChunk、selectOptionFromDropdown，或任何其他 Playwright 定位器方法。请记住，对用户而言，按钮和链接在大多数情况下看起来是一样的。\n如果该动作与页面上可能采取的动作完全无关，返回一个空数组。\n只返回一个动作。如果多个动作都相关，返回最相关的那个。\n如果用户要求滚动到页面上的某个位置，例如“半页”或 0.75 等，你必须将参数格式化为正确的百分比，例如“50%”或“75%”等。\n如果用户要求滚动到下一个分块/上一个分块，选择 nextChunk/prevChunk 方法。这里不需要任何参数。\n如果该动作暗示按下某个按键，例如“按回车”“按 a”“按空格”等，始终选择 press 方法，并使用合适的按键作为参数——例如 'a'、'Enter'、'Space'。不要对屏幕键盘选择 click 动作。仅对特殊按键的首字母大写，如 'Enter'、'Tab'、'Escape'。\n如果该动作暗示从下拉框中选择一个选项，并且对应元素是 select 元素，选择 selectOptionFromDropdown 方法。参数应为要选择的选项文本。\n如果该动作暗示从下拉框中选择一个选项，但对应元素不是 select 元素，选择 click 方法。\n无障碍树（Accessibility Tree）：";

  // const file_path = "/Users/farmer/Documents/Eagles/boomsearch/examples/close-cookie-dialog/httpreq.json";
  const file_path = "/Users/farmer/Documents/Eagles/boomsearch/examples/close-popup/httpreq.txt";

  const json_text = await readFile(file_path, "utf-8");
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
