import { motion } from "framer-motion";
import { Search, Pin, Trash2 } from "lucide-react";
import { useMemoryStore } from "@/store/memoryStore";
import { useState } from "react";

export default function MemoryPage() {
  const { memories, togglePin, removeMemory } = useMemoryStore();
  const [search, setSearch] = useState("");

  const filteredMemories = memories.filter(m => m.content.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full bg-black p-6 space-y-6"
    >
      <header className="pt-4">
        <h1 className="font-display text-2xl font-bold tracking-widest border-b border-white/20 pb-4 inline-block pr-12">
          MEMORY CORE
        </h1>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
        <input 
          type="text" 
          placeholder="Search memories..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-card border border-border rounded-2xl py-4 pl-12 pr-4 font-sans text-sm outline-none focus:border-white/50 transition-colors placeholder:text-white/30"
        />
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {filteredMemories.map((memory) => (
          <div key={memory.id} className={`bg-card border rounded-2xl p-5 relative group ${memory.pinned ? 'border-white/30 border-l-2 border-l-white' : 'border-border'}`}>
            <p className="font-sans text-sm leading-relaxed pr-8">{memory.content}</p>
            
            <div className="flex items-center justify-between mt-4">
              <span className="font-mono text-[10px] text-white/30 uppercase">
                {new Date(memory.timestamp).toLocaleDateString()}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => togglePin(memory.id)}
                  className={`p-2 rounded-lg transition-colors ${memory.pinned ? 'text-white bg-white/10' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
                >
                  <Pin size={14} />
                </button>
                <button 
                  onClick={() => removeMemory(memory.id)}
                  className="p-2 rounded-lg text-white/30 hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredMemories.length === 0 && (
          <div className="text-center py-12">
            <p className="font-mono text-sm text-white/30">NO MEMORIES FOUND</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
