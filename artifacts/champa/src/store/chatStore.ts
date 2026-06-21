import { create } from 'zustand';
import { Message } from '@/types';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  selectedModel: string;
  isGeneratingImage: boolean;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, content: string) => void;
  setLoading: (isLoading: boolean) => void;
  setSelectedModel: (model: string) => void;
  setGeneratingImage: (isGenerating: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      id: 'system-1',
      role: 'system',
      content: 'CHAMPA SYSTEM ONLINE. ALL AGENTS STANDING BY.',
      timestamp: Date.now() - 10000,
    }
  ],
  isLoading: false,
  selectedModel: 'meta-llama/llama-3.1-8b-instruct:free',
  isGeneratingImage: false,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (id, content) => set((state) => ({
    messages: state.messages.map((msg) =>
      msg.id === id ? { ...msg, content } : msg
    ),
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setGeneratingImage: (isGeneratingImage) => set({ isGeneratingImage }),
  clearMessages: () => set({ messages: [] }),
}));
