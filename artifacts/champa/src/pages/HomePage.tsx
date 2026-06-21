import { motion } from 'framer-motion';
import { MessageSquare, Globe, Search, Code, Plus, Brain } from 'lucide-react';
import { Link } from 'wouter';
import { useChatStore } from '@/store/chatStore';
import { useMemoryStore } from '@/store/memoryStore';
import { useTaskStore } from '@/store/taskStore';

export default function HomePage() {
  const { messages } = useChatStore();
  const { memories } = useMemoryStore();
  const { tasks } = useTaskStore();

  const recentMemory = memories.find(m => m.pinned) || memories[0];
  const activeTasks = tasks.filter(t => t.status === 'In Progress');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="p-6 space-y-8 pb-24"
    >
      <header className="pt-4">
        <h1 className="font-display text-2xl font-bold tracking-widest border-b border-white/20 pb-4 inline-block pr-12">
          CHAMPA<br />
          <span className="text-sm text-white/50">AI ASSISTANT // OS</span>
        </h1>
      </header>

      {/* Status */}
      <section className="space-y-3">
        <h2 className="font-display text-xs text-white/50 tracking-widest">SYSTEM STATUS</h2>
        <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
          </span>
          <div>
            <p className="font-mono text-xs text-white/50">CHAMPA ONLINE</p>
            <p className="font-sans text-sm text-white mt-0.5">
              {messages.length} messages · {memories.length} memories · {activeTasks.length} active tasks
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h2 className="font-display text-xs text-white/50 tracking-widest">QUICK ACTIONS</h2>
        <div className="grid grid-cols-5 gap-2">
          {[
            { icon: MessageSquare, label: 'Chat', link: '/chat' },
            { icon: Globe, label: 'Browser', link: '/tasks' },
            { icon: Search, label: 'Search', link: '/chat' },
            { icon: Code, label: 'Code', link: '/chat' },
            { icon: Plus, label: 'Create', link: '/chat' },
          ].map((action, i) => (
            <Link key={i} href={action.link} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="h-14 w-14 rounded-2xl bg-[#0d0d0d] border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:border-white transition-all">
                <action.icon size={20} />
              </div>
              <span className="font-mono text-[9px] uppercase text-white/40 group-hover:text-white transition-colors">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent chat */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xs text-white/50 tracking-widest">RECENT CHAT</h2>
          <Link href="/chat" className="font-mono text-[10px] text-white/40 hover:text-white transition-colors uppercase">
            Open
          </Link>
        </div>
        {messages.length === 0 ? (
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-5 text-center">
            <p className="font-mono text-xs text-white/30">NO CONVERSATIONS YET</p>
            <Link href="/chat">
              <button className="mt-3 font-mono text-xs text-white border border-white/20 rounded-xl px-4 py-2 hover:bg-white hover:text-black transition-all">
                START CHATTING
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {[...messages].reverse().slice(0, 2).map(msg => (
              <div key={msg.id} className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-4">
                <p className="font-mono text-[10px] text-white/30 mb-1 uppercase">
                  {msg.role === 'user' ? 'YOU' : 'CHAMPA'}
                </p>
                <p className="font-sans text-sm text-white/80 truncate">{msg.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Active tasks */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xs text-white/50 tracking-widest">ACTIVE TASKS</h2>
          <Link href="/tasks" className="font-mono text-[10px] text-white/40 hover:text-white transition-colors uppercase">
            View All
          </Link>
        </div>
        {activeTasks.length === 0 ? (
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-5 text-center">
            <p className="font-mono text-xs text-white/30">NO ACTIVE TASKS</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeTasks.slice(0, 3).map((task, i) => (
              <div key={task.id} className="flex items-center justify-between bg-[#0d0d0d] border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-white/30 text-xs">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-sans text-sm">{task.title}</span>
                </div>
                <span className="font-mono text-[10px] text-white/50 bg-white/5 px-2 py-1 rounded">
                  {task.progress}%
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Memory snippets */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xs text-white/50 tracking-widest">MEMORY SNIPPETS</h2>
          <Link href="/memory" className="font-mono text-[10px] text-white/40 hover:text-white transition-colors uppercase">
            View All
          </Link>
        </div>
        {!recentMemory ? (
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-5 text-center">
            <p className="font-mono text-xs text-white/30">NO MEMORIES SAVED YET</p>
            <p className="font-mono text-[10px] text-white/20 mt-1">Chat with CHAMPA to build memory</p>
          </div>
        ) : (
          <div className="bg-[#0d0d0d] border border-white/10 border-l-2 border-l-white rounded-2xl p-4">
            <p className="font-sans text-sm text-white/90 leading-relaxed">"{recentMemory.content}"</p>
            <p className="font-mono text-[10px] text-white/30 mt-3 text-right">
              {new Date(recentMemory.timestamp).toLocaleDateString().toUpperCase()}
            </p>
          </div>
        )}
      </section>

      {/* Model info */}
      <section className="space-y-3 pb-4">
        <h2 className="font-display text-xs text-white/50 tracking-widest">AI ENGINE</h2>
        <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
          <Brain size={18} className="text-white/40" />
          <div>
            <p className="font-mono text-xs text-white/80">OpenRouter · Free Tier</p>
            <p className="font-mono text-[10px] text-white/30 mt-0.5">6 free models available</p>
          </div>
          <Link href="/chat" className="ml-auto">
            <span className="font-mono text-[10px] text-white/40 hover:text-white transition-colors uppercase border border-white/10 rounded-lg px-2 py-1">
              Switch
            </span>
          </Link>
        </div>
      </section>
    </motion.div>
  );
}
