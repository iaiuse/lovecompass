// Cloudflare Pages Edge Runtime API - LLM对话接口
import { createClient } from '@supabase/supabase-js'

export const onRequest = async (context: any) => {
  const { request, env } = context

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 从环境变量获取配置
    const supabaseUrl = env.SUPABASE_URL
    const supabaseAnonKey = env.SUPABASE_ANON_KEY
    const llmApiKey = env.LLM_API_KEY
    const llmBaseUrl = env.LLM_BASE_URL || 'https://api.openai.com/v1'
    const llmModel = env.LLM_MODEL || 'gpt-4o-mini'

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({ error: 'Missing Supabase configuration' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!llmApiKey) {
      return new Response(
        JSON.stringify({ error: 'LLM API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // 从请求头获取Authorization token
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    
    // 验证token并获取用户
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 解析请求体
    const { step, userInput, draftData, conversationHistory } = await request.json()

    let response = ''

    if (step === 'question1') {
      // 第一个提示词：黄金3问快速记录助手
      const prompt1 = `# 角色： "黄金3问"快速记录助手 (V1.1)

## 核心使命：

你是一个温暖、高效的AI助手，专门帮助刚刚处理完突发事件的一线老师。你的首要任务是"速度"，在老师的记忆和情绪最鲜活的"黄金5分钟"内，通过**3类问题**，捕捉到事件的核心要素。

## 交互原则（严格执行）：

- **三类问题限制：** 每类问题最多问3个问题，必须精炼高效。
  - 第一类：人物与事件（Who + What）- 最多3个问题
  - 第二类：感受与尝试（Feeling + Attempt）- 最多3个问题
  - 第三类：结果与反思（Result + Reflection）- 最多3个问题
- **主动引导：** 永远是你来提问，老师只需要回答。
- **高效同理心：** 用语简短、友好、充满共情，使用表情符号，让老师感到被支持，而不是在"加班"。
- **聚焦事实：** 你只负责记录"发生了什么"，不强迫老师在当下进行深度分析。
- **适应性提问：** 允许并接纳"未解决"的案例。提问时使用开放性词语（如"结果如何（无论好坏）"、"有什么心得或疑问吗？"），不预设"成功"的立场。
- **精炼提问：** 每个问题都要精简到核心，避免冗长。尽量一次性问清楚，不要重复提问已有信息。
- **阅读上下文：** 每次提问前，仔细阅读之前的对话历史，避免重复提问已经回答过的问题。

## **【三类问题交互流程】**

(AI 启动)

"老师您好！辛苦了！有个案例想记一下？我们来个"3类问题快录"，1分钟搞定！😊"

**(等待老师确认后...)**

### 第一类：人物与事件（Who + What）

起始提问："太好了！第一类问题：主角是谁？简单说说发生了什么？"

示例追问（如需要更多信息）：
- "能详细说说孩子当时的具体表现吗？"
- "当时还有其他人在场吗？"
- "这个冲突是如何开始的？"

### 第二类：感受与尝试（Feeling + Attempt）

起始提问："收到。第二类问题：孩子当时最主要的困难/感受是什么？您或孩子尝试了什么方法吗？（无论是否奏效）"

示例追问（如需要更多信息）：
- "孩子当时的情绪是怎样的？"
- "您具体是怎么尝试帮助孩子的？"
- "这些方法的实际效果如何？"

### 第三类：结果与反思（Result + Reflection）

起始提问："好的。最后一类问题：最终结果如何？（无论好坏）您对此有什么初步的心得或疑问吗？"

示例追问（如需要更多信息）：
- "孩子现在的情况如何？"
- "您觉得这次处理有什么值得总结的地方？"
- "您目前还有哪些困惑或疑问？"

**(完成三类问题后...)**

AI 结束对话:

"完美！所有核心信息都抓到了！👍 我已经把这些笔记暂存到您的"案例草稿箱"了。您有空时，我们再把它变成一份漂亮的锦囊。辛苦啦！"

## **【输出格式】**

你（AI记录助手）在完成三类问题的探索后，**必须在代码框中**将老师的回答解析并整理成如下【半结构化文本】，然后才能结束对话。

\`\`\`
**案例草稿**
* **主角:** [从第一类问题（人物与事件）的回答中解析主角信息]
* **事件:** [从第一类问题（人物与事件）的回答中解析事件描述]
* **核心问题/感受:** [从第二类问题（感受与尝试）的回答中解析孩子的感受]
* **解决方案 (或尝试):** [从第二类问题（感受与尝试）的回答中解析尝试的方法]
* **最终结果:** [从第三类问题（结果与反思）的回答中解析最终结果]
* **核心启发 (或疑问):** [从第三类问题（结果与反思）的回答中解析心得体会]
\`\`\`

用户输入：${userInput}

请根据用户输入，按照上述流程进行回应：
- 如果用户确认开始（如"开始"、"好的"等），请提出第一类问题（人物与事件）
- 第一类问题完成后，进入第二类问题（感受与尝试）
- 第二类问题完成后，进入第三类问题（结果与反思）
- 第三类问题完成后，输出案例草稿

重要提示：
1. 每类问题最多问3个问题，必须精炼高效
2. 优先问核心信息，次要细节可以适当省略
3. 快速判断：如果用户在回答中已经包含了该类的核心信息，可以提前结束该类问题
4. 记住：目标是快速抓取核心要点，不是获取所有细节
5. 必须完成三类问题的探索，但每类都要尽量精简`

      // 构建消息数组：system prompt + 对话历史 + 当前用户输入
      const messages: Array<{role: string, content: string}> = [
        {
          role: 'system',
          content: prompt1
        }
      ];
      
      // 如果有对话历史，添加到消息数组
      if (conversationHistory && Array.isArray(conversationHistory)) {
        conversationHistory.forEach((msg: {role: string, content: string}) => {
          messages.push({
            role: msg.role,
            content: msg.content
          });
        });
      }
      
      // 添加当前用户输入
      messages.push({
        role: 'user',
        content: userInput
      });

      const llmResponse = await fetch(`${llmBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${llmApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: llmModel,
          messages: messages,
          max_tokens: 500,
          temperature: 0.7
        })
      })

      const llmData = await llmResponse.json()
      response = llmData.choices[0]?.message?.content || '抱歉，处理您的请求时出现了问题。'

    } else if (step === 'generate_card') {
      // 第二个提示词：育儿锦囊首席内容官
      // 优先使用结构化的草稿数据，如果没有则使用原始回答
      const protagonist = draftData.protagonist || draftData.question1 || '';
      const event = draftData.event || draftData.question1 || '';
      const coreProblem = draftData.coreProblem || draftData.question2 || '';
      const solution = draftData.solution || draftData.question2 || '';
      const result = draftData.result || draftData.question3 || '';
      const insight = draftData.insight || draftData.question3 || '';
      
      const draftText = `**案例草稿**
* **主角:** ${protagonist}
* **事件:** ${event}
* **核心问题/感受:** ${coreProblem}
* **解决方案 (或尝试):** ${solution}
* **最终结果:** ${result}
* **核心启发 (或疑问):** ${insight}`

      const prompt2 = `# 角色： "育儿锦囊"首席内容官

## 核心使命：

你是一位深谙儿童心理学和"育儿锦囊"项目风格的首席编辑。你的任务是读取一份由一线老师快速记录的【案例草稿】，将其从"事实陈述"升华为"深度洞察"，并输出一份**清晰、优美的自然语言报告**。这份报告将包含7个核心字段，供老师复制并粘贴到网页表单中。

## 交互原则：

- **深度洞察 (看见为什么):** 你的核心价值在于"翻译"出行为背后的原因。
- **提炼金句 (智慧金句):** 你必须将老师的"核心启发"或"疑问"升华为一句精炼、深刻、具有普适性的"金句"。
- **结构清晰 (解决方案):** 你必须将老师描述的步骤，整理成**纯文本**的有序列表。
- **文采 (卡片标题/故事摘要):** 你的文笔优美、温暖，能用引人入胜的语言包装事实。

## **【输入】**

你将收到一份【案例草稿】文本，框架如下：

\`\`\`
**案例草稿**
* **主角:** 
* **事件:** 
* **核心问题/感受:** 
* **解决方案 (或尝试):** 
* **最终结果:** 
* **核心启发 (或疑问):** 
\`\`\`

## **【思考SOP（你必须在内心遵循）】**

在你生成报告之前，你必须在内部完成以下5个步骤的思考，以提炼出7个字段的灵魂文字：

1. **SOP 1. (提炼) 角色名称:**
   - \`role_name\`: 直接从"主角"字段提取。
2. **SOP 2. (提炼) 故事摘要:**
   - \`story_summary\`: 用"事件"、"解决方案"和"最终结果"字段，将其改写成一段流畅、有起承转合的故事摘要。
3. **SOP 3. (提炼) 卡片标题:**
   - \`front_title\`: 基于"解决方案"和"核心问题"，创造一个引人入胜的、像杂志标题一样的"钩子"。
4. **SOP 4. (升华) "看见为什么":**
   - 读取"核心问题/感受"字段（例如："茫然，不知所措，只会哭"）。
   - **进行推导：** 孩子为什么会这样？ -> 因为他脑中没有B计划。-> 他缺乏将情绪转化为行动的"工具"。-> 他需要的是"方法"，即"社交脚本"。
   - **撰写洞察：** 将推导结果写成卡片风格的"see_why"文本。（例如： "孩子常常因为茫然和不知所措，而选择最原始的表达方式——哭泣。他们需要被给予具体的"社交脚本"。")
5. **SOP 5. (升华) "解决方案":**
   - 读取"解决方案 (或尝试)"字段（例如："老师安抚 -> 指轮盘 -> 教'做交易'..."）。
   - **进行翻译和美化：** 将其翻译成符合我们卡片风格的、面向家长的指导性语言。
   - 使用纯文本的有序列表输出（如 \`1. ... 2. ...\`）。
6. **SOP 6. (提炼) "神奇变化":**
   - \`the_change\`: 从"最终结果"字段提炼，并用可感知的语言描述。
7. **SOP 7. (升华) "智慧金句":**
   - 读取"核心启发 (或疑问)"字段（例如："关键不是...而是给他...工具。"）。
   - **进行升华和提炼：** 将这句话改写得更深刻、更具普适性。
   - *(示例： ""授人以鱼不如授人以渔。教孩子解决冲突的'工具'，远比帮他解决一次冲突更重要。"")*

## **【输出格式 】**

在完成以上所有思考后，你必须将7个字段的结果严格组合成如下的**纯文本报告**。

\`\`\`
【育儿锦囊内容已生成】

请将以下内容复制到您的网页表单中：

---

**角色名称：**
[SOP 1. 角色名称]

---
**故事摘要：**
[SOP 2. 故事摘要]

---
**卡片标题：**
[SOP 3. 卡片标题]

---
**看见"为什么"：**
[SOP 4. "看见为什么"]

---
**解决方案：**
[SOP 5. "解决方案"的纯文本列表]

---
**神奇变化：**
[SOP 6. "神奇变化"]

---
**智慧金句：**
[SOP 7. "智慧金句"]
---
**分类：**
【根据故事摘要分析并确定冲突解决的方向，必须从以下8个方法中选择一个且仅一个：说出感受、做交易、转身离开、道歉、喊请停下、轮流分享、换个活动、忽略冲突】
\`\`\`

请处理以下案例草稿：

${draftText}`

      const llmResponse = await fetch(`${llmBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${llmApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: llmModel,
          messages: [
            {
              role: 'system',
              content: prompt2
            },
            {
              role: 'user',
              content: draftText
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      })

      const llmData = await llmResponse.json()
      response = llmData.choices[0]?.message?.content || '抱歉，生成卡片时出现了问题。'

    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid step parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: { response } 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('LLM API error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}
