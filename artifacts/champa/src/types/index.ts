export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  isGenerating?: boolean;
}

export interface Task {
  id: string;
  title: string;
  status: 'In Progress' | 'Paused' | 'Waiting' | 'Completed';
  progress: number;
  target?: string;
  type: 'browser' | 'research' | 'image' | 'code';
}

export interface Memory {
  id: string;
  content: string;
  timestamp: number;
  pinned: boolean;
}

export interface Agent {
  id: string;
  name: string;
  status: 'LIVE' | 'IDLE' | 'ERROR';
  activity?: string;
}
