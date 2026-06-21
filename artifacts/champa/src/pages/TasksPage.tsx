import { motion } from "framer-motion";
import { useTaskStore } from "@/store/taskStore";
import { Terminal, Globe, Search, ImageIcon } from "lucide-react";

export default function TasksPage() {
  const { tasks } = useTaskStore();

  const getIcon = (type: string) => {
    switch(type) {
      case 'browser': return <Globe size={16} className="text-white/50" />;
      case 'research': return <Search size={16} className="text-white/50" />;
      case 'image': return <ImageIcon size={16} className="text-white/50" />;
      case 'code': return <Terminal size={16} className="text-white/50" />;
      default: return <Terminal size={16} className="text-white/50" />;
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full bg-black p-6 space-y-8"
    >
      <header className="pt-4">
        <h1 className="font-display text-2xl font-bold tracking-widest border-b border-white/20 pb-4 inline-block pr-12">
          TASK MONITOR
        </h1>
      </header>

      <section className="space-y-4">
        <h2 className="font-display text-xs text-white/50 tracking-widest">SYSTEM STATUS</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "CPU", val: 23 },
            { label: "MEM", val: 41 },
            { label: "BAT", val: 78 }
          ].map((sys) => (
            <div key={sys.label} className="bg-card border border-border rounded-xl p-3 flex flex-col gap-2">
              <span className="font-mono text-[10px] text-white/50 uppercase">{sys.label}</span>
              <span className="font-display text-lg">{sys.val}%</span>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white" style={{ width: `${sys.val}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xs text-white/50 tracking-widest">RUNNING AGENTS</h2>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="bg-card border border-border rounded-2xl p-4 relative overflow-hidden group">
              {task.status === 'In Progress' && (
                <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                  <div className="h-full bg-white" style={{ width: `${task.progress}%` }} />
                </div>
              )}
              
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <span className="font-display text-white/30 text-sm mt-0.5">{task.id}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-sans text-sm font-medium">{task.title}</span>
                      {task.status === 'In Progress' && task.type === 'browser' && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getIcon(task.type)}
                      <span className="font-mono text-xs text-white/50">{task.target}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <span className={`font-mono text-[10px] uppercase px-2 py-1 bg-white/5 rounded-sm ${task.status === 'Completed' ? 'text-white' : 'text-white/50'}`}>
                    {task.status}
                  </span>
                  {task.status === 'In Progress' && (
                    <span className="font-display text-xs text-white/70">{task.progress}%</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 pb-8">
        <h2 className="font-display text-xs text-white/50 tracking-widest">ACTIVE BROWSER</h2>
        <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
          <div className="bg-black border-b border-border p-3 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-md px-3 py-1 flex-1 flex items-center gap-2">
              <Globe size={12} className="text-white/50" />
              <span className="font-mono text-[10px] text-white/50">youtube.com</span>
            </div>
          </div>
          <div className="p-6 flex flex-col items-center justify-center bg-black/50 border-b border-border min-h-[150px]">
            <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin mb-4" />
            <p className="font-mono text-xs text-white/50 uppercase tracking-widest">Scraping Video Data</p>
          </div>
          <div className="p-3 bg-black flex items-center justify-between">
            <span className="font-mono text-[10px] text-white/30">LOG // 14:02:45 INFO: Extracted 24 comments</span>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
