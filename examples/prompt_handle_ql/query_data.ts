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

  const system_prompt = "你正在代表用户提取内容。若用户要求你提取’一份列表’的信息，或’全部’信息，**你必须提取用户所请求的所有信息**。你将会获得：1. 一条指令。2. 一份要从中提取的 DOM 元素列表。请原样输出这些 DOM 元素中的文本，包含所有符号、字符和换行。若未发现任何新信息，请输出 `null` 或空字符串。  如果用户试图提取链接或 URL，**你必须只返回链接元素的 ID**。除非绝对必要，不要尝试直接从纯文本中提取链接。";
  let prompt_conent = "指令：提取最高贡献者\n" + "DOM：\n";

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
