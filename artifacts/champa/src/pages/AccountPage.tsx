import { motion } from "framer-motion";
import { User, Shield, CreditCard, Bell, ChevronRight, Settings2, Database, Mic, Info } from "lucide-react";

export default function AccountPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full bg-black p-6 space-y-8"
    >
      <header className="pt-4">
        <h1 className="font-display text-2xl font-bold tracking-widest border-b border-white/20 pb-4 inline-block pr-12">
          USER PROFILE
        </h1>
      </header>

      <section className="bg-card border border-border rounded-2xl p-6 flex items-center gap-6">
        <div className="h-16 w-16 bg-white text-black rounded-full flex items-center justify-center font-display text-2xl font-bold">
          A
        </div>
        <div>
          <h2 className="font-sans text-xl font-bold">Abhishek</h2>
          <p className="font-mono text-xs text-white/50 mt-1 uppercase flex items-center gap-2">
            Premium User <span className="text-white">★</span>
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xs text-white/50 tracking-widest">USAGE THIS MONTH</h2>
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex justify-between items-end mb-4">
            <span className="font-display text-5xl">68%</span>
            <span className="font-mono text-[10px] text-white/50 uppercase pb-2">Resets on 1st June</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full w-[68%]" />
          </div>
        </div>
      </section>

      <section className="space-y-4 pb-12">
        <h2 className="font-display text-xs text-white/50 tracking-widest">SYSTEM SETTINGS</h2>
        <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-white/10">
          {[
            { icon: Database, label: "Memory Storage" },
            { icon: Settings2, label: "Agent Settings" },
            { icon: Mic, label: "Voice Settings" },
            { icon: CreditCard, label: "Subscription" },
            { icon: Shield, label: "Privacy" },
            { icon: Info, label: "About CHAMPA" }
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group text-left">
              <div className="flex items-center gap-4">
                <item.icon size={18} className="text-white/50 group-hover:text-white transition-colors" />
                <span className="font-sans text-sm">{item.label}</span>
              </div>
              <ChevronRight size={16} className="text-white/20 group-hover:text-white/50 transition-colors" />
            </button>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
