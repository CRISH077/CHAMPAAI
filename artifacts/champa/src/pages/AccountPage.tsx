import { motion } from 'framer-motion';
import { Shield, CreditCard, Mic, Info, Settings2, Database, ChevronRight, Bot } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { useMemoryStore } from '@/store/memoryStore';
import { useTaskStore } from '@/store/taskStore';

export default function AccountPage() {
  const { messages, clearMessages } = useChatStore();
  const { memories } = useMemoryStore();
  const { tasks } = useTaskStore();

  const userMessages = messages.filter(m => m.role === 'user').length;
  const aiMessages = messages.filter(m => m.role === 'assistant').length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;

  const stats = [
    { label: 'Messages Sent', value: userMessages },
    { label: 'AI Responses', value: aiMessages },
    { label: 'Memories Saved', value: memories.length },
    { label: 'Tasks Completed', value: completedTasks },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full bg-black p-6 space-y-6 pb-24"
    >
      <header className="pt-4">
        <h1 className="font-display text-2xl font-bold tracking-widest border-b border-white/20 pb-4 inline-block pr-12">
          ACCOUNT
        </h1>
      </header>

      {/* Profile */}
      <section className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-5 flex items-center gap-5">
        <div className="h-14 w-14 bg-white text-black rounded-full flex items-center justify-center font-display text-xl font-bold flex-shrink-0">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="font-sans text-lg font-bold">CHAMPA User</h2>
          <p className="font-mono text-xs text-white/40 mt-1 uppercase">OpenRouter · Free Tier</p>
        </div>
      </section>

      {/* Live stats */}
      <section className="space-y-3">
        <h2 className="font-display text-xs text-white/50 tracking-widest">SESSION STATS</h2>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-4">
              <p className="font-display text-3xl font-bold">{s.value}</p>
              <p className="font-mono text-[10px] text-white/40 mt-1 uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Settings */}
      <section className="space-y-3">
        <h2 className="font-display text-xs text-white/50 tracking-widest">SETTINGS</h2>
        <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
          {[
            { icon: Database, label: 'Memory Storage', sub: `${memories.length} items stored` },
            { icon: Settings2, label: 'Agent Settings', sub: `${tasks.length} tasks total` },
            { icon: Mic, label: 'Voice Settings', sub: 'Browser microphone' },
            { icon: CreditCard, label: 'Subscription', sub: 'OpenRouter Free' },
            { icon: Shield, label: 'Privacy', sub: 'Local storage only' },
            { icon: Info, label: 'About CHAMPA', sub: 'v1.0.0' },
          ].map((item, i) => (
            <button
              key={i}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group text-left"
            >
              <div className="flex items-center gap-4">
                <item.icon size={17} className="text-white/40 group-hover:text-white transition-colors flex-shrink-0" />
                <div>
                  <p className="font-sans text-sm">{item.label}</p>
                  <p className="font-mono text-[10px] text-white/30 mt-0.5">{item.sub}</p>
                </div>
              </div>
              <ChevronRight size={15} className="text-white/20 group-hover:text-white/50 transition-colors" />
            </button>
          ))}
        </div>
      </section>

      {/* Danger zone */}
      <section className="space-y-3">
        <h2 className="font-display text-xs text-white/50 tracking-widest">DATA</h2>
        <button
          data-testid="clear-chat-btn"
          onClick={() => { if (confirm('Clear all chat history?')) clearMessages(); }}
          className="w-full py-3 border border-white/10 rounded-2xl font-mono text-sm text-white/50 hover:border-white/30 hover:text-white transition-all"
        >
          CLEAR CHAT HISTORY
        </button>
      </section>
    </motion.div>
  );
}
