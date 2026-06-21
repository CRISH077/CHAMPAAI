import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      isLoading: false,
      selectedModel: 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
      isGeneratingImage: false,
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      updateMessage: (id, content) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, content, isGenerating: false } : msg
          ),
        })),
      setLoading: (isLoading) => set({ isLoading }),
      setSelectedModel: (model) => set({ selectedModel: model }),
      setGeneratingImage: (isGeneratingImage) => set({ isGeneratingImage }),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'champa-chat',
      partialize: (state) => ({
        messages: state.messages,
        selectedModel: state.selectedModel,
      }),
    }
  )
);
