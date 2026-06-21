import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Memory } from '@/types';

interface MemoryState {
  memories: Memory[];
  addMemory: (memory: Memory) => void;
  removeMemory: (id: string) => void;
  togglePin: (id: string) => void;
}

export const useMemoryStore = create<MemoryState>()(
  persist(
    (set) => ({
      memories: [],
      addMemory: (memory) => set((state) => ({ memories: [memory, ...state.memories] })),
      removeMemory: (id) =>
        set((state) => ({ memories: state.memories.filter((m) => m.id !== id) })),
      togglePin: (id) =>
        set((state) => ({
          memories: state.memories
            .map((m) => (m.id === id ? { ...m, pinned: !m.pinned } : m))
            .sort((a, b) =>
              a.pinned === b.pinned ? b.timestamp - a.timestamp : a.pinned ? -1 : 1
            ),
        })),
    }),
    { name: 'champa-memory' }
  )
);
