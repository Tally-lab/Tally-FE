import type { ChatRequest, ChatResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const chatAPI = {
  send: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error(`Chat failed: ${response.status}`);
    return response.json();
  },

  stream: async (
    request: ChatRequest,
    onChunk: (text: string) => void,
    onDone: () => void,
    onError: (error: Error) => void,
  ): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Stream failed: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No readable stream');

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // SSE format: "data:chunk\n\n"
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.slice(5);
            if (data) onChunk(data);
          } else if (line.length > 0 && !line.startsWith(':')) {
            // Plain text chunk (non-SSE)
            onChunk(line);
          }
        }
      }
      onDone();
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  },

  clearConversation: async (conversationId: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/api/chat/conversations/${conversationId}`, {
      method: 'DELETE',
    });
  },
};
