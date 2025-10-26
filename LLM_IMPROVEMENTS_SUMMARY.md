# LLM对话系统改进总结

## 问题概述

原有的LLM对话系统存在以下问题：
1. 没有正确解析第一个提示词返回的结构化草稿内容
2. 传递给第二个提示词的数据不完整或不正确
3. `role_name` 等字段缺少语义理解，容易提取错误内容
4. TypeScript类型错误

## 解决方案

### 1. 添加结构化草稿数据解析 (`LLMDialog.tsx`)

新增 `parseDraftFromResponse` 函数，用于从LLM的回复中解析案例草稿的各个字段：

```typescript
const parseDraftFromResponse = (response: string): Partial<{
  protagonist: string;
  event: string;
  coreProblem: string;
  solution: string;
  result: string;
  insight: string;
}> => {
  // 使用正则表达式解析案例草稿格式
  const protagonistMatch = response.match(/\*\*主角:\*\*([\s\S]*?)(?=\*)/);
  // ... 其他字段的解析
}
```

### 2. 改进数据流 (`LLMDialog.tsx`)

在三个问题的回答阶段，逐步收集和解析结构化数据：

- **Question 1**: 解析主角和事件
- **Question 2**: 解析核心问题和解决方案
- **Question 3**: 解析结果和启发

每个阶段都会：
1. 保存用户的原始回答
2. 从LLM的回复中解析结构化草稿内容
3. 将解析结果合并到 `draftData` 状态中

### 3. 优化后端数据处理 (`chat.ts`)

改进第二个提示词的数据准备逻辑：

```typescript
// 优先使用结构化的草稿数据，如果没有则使用原始回答
const protagonist = draftData.protagonist || draftData.question1 || '';
const event = draftData.event || draftData.question1 || '';
// ... 其他字段
```

这确保了即使解析失败，也能使用原始回答作为后备。

### 4. 修复TypeScript类型错误

- 为 `draftData` 添加了完整的类型定义
- 修复了 `theme` 字段的类型（从 `string[]` 改为 `[string, string]`）
- 添加了必要的导入（`Case` 类型）
- 修复了重复声明变量的问题

## 数据流示意

```
用户回答 -> LLM处理 -> 返回对话 + 草稿内容
                          ↓
                    解析草稿内容
                          ↓
                    保存到draftData
                          ↓
                    汇总所有字段
                          ↓
                    传递给第二个提示词
                          ↓
                    生成最终卡片
```

## 示例草稿格式

第一个提示词现在会输出如下格式的草稿：

```
**案例草稿**
* **主角:** 豆豆
* **事件:** 豆豆跟同学抢玩具，把同学打伤了
* **核心问题/感受:** 孩子很委屈，打了同学也不开心，不愿意把抢到的玩具分享回去
* **解决方案 (或尝试):** 老师尝试先安抚他的情绪，没有讲道理
* **最终结果:** 孩子没有归还玩具
* **核心启发 (或疑问):** 老师说的话没能共情到他
```

这些字段会被正确解析并传递给第二个提示词，确保生成的卡片内容更准确。

## 优化效果

1. **更准确的字段提取**: `role_name` 现在会从 "主角" 字段中正确提取，而不是从对话中错误提取
2. **完整的数据传递**: 所有草稿字段都会正确传递给第二个提示词
3. **更好的语义理解**: 字段之间有明确的对应关系
4. **更强的容错性**: 即使解析失败，也能使用原始回答
