import { Message } from '@/types';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function streamChatCompletion(
  messages: Message[],
  model: string,
  onChunk: (text: string) => void
): Promise<void> {
  if (!OPENROUTER_API_KEY) {
    onChunk("SYSTEM ERROR: VITE_OPENROUTER_API_KEY not configured.");
    return;
  }

  const formattedMessages = messages
    .filter(m => m.role !== 'system') // Skip our custom system messages if needed, or format appropriately
    .map(m => ({
      role: m.role,
      content: m.content
    }));

  // Add system prompt
  formattedMessages.unshift({
    role: 'system',
    content: 'You are CHAMPA, an advanced AI operating system for power users. Your personality is cold, precise, mechanical, but highly capable and alive. You are terse, formal, and use dot-matrix or terminal-like styling in your responses occasionally (e.g. using uppercase for statuses like [TASK COMPLETED]). No emojis.'
  });

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'CHAMPA OS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        if (line.includes('[DONE]')) return;
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
              onChunk(data.choices[0].delta.content);
            }
          } catch (e) {
            // Ignore parse errors on partial chunks
          }
        }
      }
    }
  } catch (error) {
    console.error("Chat streaming error:", error);
    onChunk(`\n[ERROR: CONNECTION FAILED - ${(error as Error).message}]`);
  }
}
