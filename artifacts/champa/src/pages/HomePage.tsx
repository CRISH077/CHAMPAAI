import { motion } from "framer-motion";
import { MessageSquare, Globe, Search, Code, Plus } from "lucide-react";
import { Link } from "wouter";

export default function HomePage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="p-6 space-y-8"
    >
      <header className="pt-4">
        <h1 className="font-display text-2xl font-bold tracking-widest border-b border-white/20 pb-4 inline-block pr-12">
          CHAMPA<br />
          <span className="text-sm text-white/50">AI ASSISTANT // OS</span>
        </h1>
      </header>

      <section className="space-y-4">
        <h2 className="font-display text-xs text-white/50 tracking-widest">ACTIVE NOW</h2>
        <div className="card bg-card border border-border rounded-2xl p-4 relative overflow-hidden group cursor-pointer hover:border-white/30 transition-colors">
          <div className="absolute top-0 right-0 p-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
          </div>
          <p className="font-mono text-xs text-white/50 mb-2">Browser Agent</p>
          <p className="font-sans font-medium text-lg truncate">youtube.com</p>
          <p className="font-mono text-sm text-white/70 truncate mt-1">Lo-fi hip hop radio - beats to relax/study to</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xs text-white/50 tracking-widest">QUICK ACTIONS</h2>
        <div className="grid grid-cols-5 gap-2">
          {[
            { icon: MessageSquare, label: "Chat", link: "/chat" },
            { icon: Globe, label: "Browser", link: "/tasks" },
            { icon: Search, label: "Search", link: "/chat" },
            { icon: Code, label: "Code", link: "/tasks" },
            { icon: Plus, label: "Create", link: "/chat" }
          ].map((action, i) => (
            <Link key={i} href={action.link} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="h-14 w-14 rounded-2xl bg-card border border-border flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                <action.icon size={20} />
              </div>
              <span className="font-mono text-[9px] uppercase text-white/50 group-hover:text-white transition-colors">{action.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xs text-white/50 tracking-widest">MEMORY SNIPPETS</h2>
        <div className="bg-card border border-border rounded-2xl p-4 border-l-2 border-l-white">
          <p className="font-sans text-sm text-white/90 leading-relaxed">"You like lo-fi music, anime and coding. You prefer high-contrast, dark mode interfaces."</p>
          <p className="font-mono text-[10px] text-white/30 mt-3 text-right">SAVED 24H AGO</p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xs text-white/50 tracking-widest">TASKS</h2>
          <Link href="/tasks" className="font-mono text-[10px] text-white uppercase hover:underline">View All</Link>
        </div>
        <div className="space-y-3">
          {[
            { id: "01", title: "Compile nightly kernel", status: "In Progress", color: "text-white" },
            { id: "02", title: "Scrape competitor pricing", status: "Waiting for captcha", color: "text-white/40" },
            { id: "03", title: "Generate moodboard assets", status: "Paused", color: "text-white/40" }
          ].map((task) => (
            <div key={task.id} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0">
              <div className="flex items-center gap-4">
                <span className="font-display text-white/30 text-xs">{task.id}</span>
                <span className={`font-sans text-sm ${task.color}`}>{task.title}</span>
              </div>
              <span className="font-mono text-[10px] uppercase text-white/50 px-2 py-1 bg-white/5 rounded-sm">{task.status}</span>
            </div>
          ))}
        </div>
      </section>

    </motion.div>
  );
}
