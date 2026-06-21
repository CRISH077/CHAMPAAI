import { create } from 'zustand';
import { Agent } from '@/types';

interface AgentState {
  agents: Agent[];
  updateAgentStatus: (id: string, status: Agent['status']) => void;
  updateAgentActivity: (id: string, activity: string) => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  agents: [
    { id: '1', name: 'Browser Agent', status: 'LIVE', activity: 'youtube.com - Lo-fi hip hop radio' },
    { id: '2', name: 'Research Agent', status: 'LIVE', activity: 'wikipedia.org - Deep Space' },
    { id: '3', name: 'System Agent', status: 'IDLE', activity: 'Awaiting commands' },
  ],
  updateAgentStatus: (id, status) => set((state) => ({
    agents: state.agents.map((agent) =>
      agent.id === id ? { ...agent, status } : agent
    ),
  })),
  updateAgentActivity: (id, activity) => set((state) => ({
    agents: state.agents.map((agent) =>
      agent.id === id ? { ...agent, activity } : agent
    ),
  })),
}));
