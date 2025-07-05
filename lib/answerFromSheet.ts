// lib/answerFromSheet.ts
import { getSheetData } from './getSheetData'
import { formatRowToText } from './formatRowToText'
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai'

// 初始化 OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

// 傳入使用者問題，回傳 AI 回答
export async function answerFromSheet(userQuestion: string): Promise<string> {
  // 1. 從 Google Sheet 抓取所有資料
  const rows = await getSheetData()

  // 2. 把每一列格式化成文字知識
  const knowledge = rows.map(formatRowToText).join('\n')

  // 3. 把知識和問題一起丟給 ChatGPT
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: 'system',
      content: `你是公司內部的知識客服，以下是從 Google Sheet 取得的資料：\n${knowledge}`
    },
    {
      role: 'user',
      content: userQuestion
    }
  ]

  // 4. 呼叫 ChatGPT API
  const res = await openai.createChatCompletion({
    model: 'gpt-4',
    messages
  })

  return res.data.choices[0].message?.content?.trim() || '找不到答案'
}
