import { create } from 'zustand';
import { Task } from '@/types';

interface TaskState {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTaskProgress: (id: string, progress: number) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  removeTask: (id: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [
    {
      id: '01',
      title: 'Browser Agent',
      status: 'In Progress',
      progress: 100,
      target: 'youtube.com',
      type: 'browser'
    },
    {
      id: '02',
      title: 'Research Agent',
      status: 'In Progress',
      progress: 45,
      target: 'wikipedia.org',
      type: 'research'
    },
    {
      id: '03',
      title: 'Image Generation',
      status: 'Completed',
      progress: 100,
      target: 'leonardo.ai',
      type: 'image'
    },
    {
      id: '04',
      title: 'Code Executor',
      status: 'Waiting',
      progress: 0,
      target: 'replit.com',
      type: 'code'
    }
  ],
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTaskProgress: (id, progress) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id ? { ...task, progress } : task
    ),
  })),
  updateTaskStatus: (id, status) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id ? { ...task, status } : task
    ),
  })),
  removeTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id),
  })),
}));
