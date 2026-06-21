import { create } from 'zustand';
import { Agent } from '@/types';

interface AgentState {
  agents: Agent[];
  updateAgentStatus: (id: string, status: Agent['status']) => void;
  updateAgentActivity: (id: string, activity: string) => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  agents: [],
  updateAgentStatus: (id, status) =>
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === id ? { ...agent, status } : agent
      ),
    })),
  updateAgentActivity: (id, activity) =>
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === id ? { ...agent, activity } : agent
      ),
    })),
}));
