import { create } from 'zustand';
import { Memory } from '@/types';

interface MemoryState {
  memories: Memory[];
  addMemory: (memory: Memory) => void;
  removeMemory: (id: string) => void;
  togglePin: (id: string) => void;
}

export const useMemoryStore = create<MemoryState>((set) => ({
  memories: [
    {
      id: '1',
      content: 'User prefers dark mode and high-contrast interfaces.',
      timestamp: Date.now() - 86400000 * 2,
      pinned: true,
    },
    {
      id: '2',
      content: 'You like lo-fi music, anime and coding',
      timestamp: Date.now() - 86400000,
      pinned: true,
    },
    {
      id: '3',
      content: 'Working on a new AI OS project named CHAMPA.',
      timestamp: Date.now() - 3600000,
      pinned: false,
    }
  ],
  addMemory: (memory) => set((state) => ({ memories: [memory, ...state.memories] })),
  removeMemory: (id) => set((state) => ({
    memories: state.memories.filter((mem) => mem.id !== id),
  })),
  togglePin: (id) => set((state) => ({
    memories: state.memories.map((mem) =>
      mem.id === id ? { ...mem, pinned: !mem.pinned } : mem
    ).sort((a, b) => (a.pinned === b.pinned ? b.timestamp - a.timestamp : (a.pinned ? -1 : 1))),
  })),
}));
