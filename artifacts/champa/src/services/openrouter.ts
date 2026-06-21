import { Message } from '@/types';

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function streamChatCompletion(
  messages: Message[],
  model: string,
  onChunk: (text: string) => void
): Promise<void> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    onChunk('[ERROR: VITE_OPENROUTER_API_KEY not set. Add your key in Replit Secrets.]');
    return;
  }

  const formattedMessages = messages
    .filter(m => m.role !== 'system')
    .map(m => ({ role: m.role, content: m.content }));

  formattedMessages.unshift({
    role: 'system',
    content:
      'You are CHAMPA — an advanced AI operating system for power users. Be precise, concise, and highly capable. Occasionally use terminal-style notation for statuses (e.g. [TASK COMPLETE], [PROCESSING]). No emojis. Respond in plain text.',
  });

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'CHAMPA OS',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        stream: true,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      let errMsg = `HTTP ${response.status}`;
      try {
        const errBody = await response.json();
        errMsg = errBody?.error?.message || errMsg;
      } catch {}
      onChunk(`[ERROR: ${errMsg}]`);
      return;
    }

    if (!response.body) {
      onChunk('[ERROR: Empty response body]');
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'data: [DONE]') continue;
        if (trimmed.startsWith('data: ')) {
          try {
            const data = JSON.parse(trimmed.slice(6));
            const content = data?.choices?.[0]?.delta?.content;
            if (content) onChunk(content);
          } catch {
            // Partial JSON — skip
          }
        }
      }
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    onChunk(`\n[ERROR: ${msg}]`);
  }
}
