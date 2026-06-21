import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '@/store/taskStore';
import { Terminal, Globe, Search, ImageIcon, Plus, X, ChevronRight } from 'lucide-react';

const TASK_TYPES = ['browser', 'research', 'image', 'code'] as const;

export default function TasksPage() {
  const { tasks, addTask, removeTask, updateTaskStatus } = useTaskStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newType, setNewType] = useState<typeof TASK_TYPES[number]>('browser');

  const getIcon = (type: string) => {
    switch (type) {
      case 'browser': return <Globe size={15} className="text-white/50" />;
      case 'research': return <Search size={15} className="text-white/50" />;
      case 'image': return <ImageIcon size={15} className="text-white/50" />;
      default: return <Terminal size={15} className="text-white/50" />;
    }
  };

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addTask({
      id: Date.now().toString(),
      title: newTitle.trim(),
      target: newTarget.trim() || undefined,
      type: newType,
      status: 'In Progress',
      progress: 0,
    });
    setNewTitle('');
    setNewTarget('');
    setNewType('browser');
    setShowAdd(false);
  };

  const statusColor = (status: string) => {
    if (status === 'Completed') return 'text-white';
    if (status === 'In Progress') return 'text-white/80';
    return 'text-white/40';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full bg-black p-6 space-y-6 pb-24"
    >
      <header className="pt-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold tracking-widest">TASK MONITOR</h1>
        <button
          data-testid="add-task-btn"
          onClick={() => setShowAdd(true)}
          className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center hover:bg-white/80 transition-colors"
        >
          <Plus size={18} />
        </button>
      </header>

      {/* Add task form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#0d0d0d] border border-white/20 rounded-2xl p-4 space-y-3 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs text-white/50 tracking-widest">NEW TASK</span>
              <button onClick={() => setShowAdd(false)} className="text-white/30 hover:text-white">
                <X size={14} />
              </button>
            </div>
            <input
              data-testid="task-title-input"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Task name..."
              className="w-full bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-white/40 placeholder:text-white/25 font-sans"
              autoFocus
            />
            <input
              data-testid="task-target-input"
              value={newTarget}
              onChange={e => setNewTarget(e.target.value)}
              placeholder="Target URL or resource (optional)..."
              className="w-full bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-white/40 placeholder:text-white/25 font-sans font-mono"
            />
            <div className="flex gap-2">
              {TASK_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setNewType(t)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono uppercase transition-colors ${
                    newType === t ? 'bg-white text-black' : 'bg-white/5 text-white/40 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              data-testid="task-submit-btn"
              onClick={handleAdd}
              disabled={!newTitle.trim()}
              className="w-full py-2 bg-white text-black rounded-xl font-mono text-xs uppercase disabled:opacity-30 hover:bg-white/80 transition-colors"
            >
              Add Task
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks list */}
      <section className="space-y-3 flex-1 overflow-y-auto">
        <h2 className="font-display text-xs text-white/50 tracking-widest">RUNNING AGENTS</h2>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center mb-4">
              <Terminal size={22} className="text-white/20" />
            </div>
            <p className="font-mono text-sm text-white/30">NO TASKS RUNNING</p>
            <p className="font-mono text-[10px] text-white/20 mt-1">Tap + to create a new agent task</p>
          </div>
        ) : (
          <AnimatePresence>
            {tasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.04 }}
                className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-4 relative overflow-hidden"
              >
                {task.status === 'In Progress' && (
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-white/5">
                    <motion.div
                      className="h-full bg-white"
                      initial={{ width: 0 }}
                      animate={{ width: `${task.progress}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                )}

                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="font-mono text-white/25 text-xs mt-0.5 flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <p className="font-sans text-sm font-medium truncate">{task.title}</p>
                      {task.target && (
                        <div className="flex items-center gap-1.5 mt-1">
                          {getIcon(task.type)}
                          <span className="font-mono text-[11px] text-white/40 truncate">{task.target}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <select
                      value={task.status}
                      onChange={e => updateTaskStatus(task.id, e.target.value as typeof task.status)}
                      className={`font-mono text-[10px] uppercase bg-white/5 border border-white/10 rounded-lg px-2 py-1 outline-none cursor-pointer hover:border-white/30 transition-colors ${statusColor(task.status)}`}
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Paused">Paused</option>
                      <option value="Waiting">Waiting</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="text-white/20 hover:text-white/60 transition-colors p-1"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                {task.status === 'In Progress' && task.progress > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-white/60 rounded-full" style={{ width: `${task.progress}%` }} />
                    </div>
                    <span className="font-mono text-[10px] text-white/30">{task.progress}%</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </section>
    </motion.div>
  );
}
