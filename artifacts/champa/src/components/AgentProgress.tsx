import { motion } from 'framer-motion';

export default function AgentProgress({ steps, currentStep }: { steps: string[], currentStep: number }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 mb-4 max-w-[85%]">
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <span className="font-display text-[10px] text-white/70 tracking-widest uppercase">AGENT ACTIVE</span>
      </div>
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-3">
            {idx < currentStep ? (
              <span className="text-white text-xs">✓</span>
            ) : idx === currentStep ? (
              <motion.span 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-3 h-3 border-t-2 border-white rounded-full block"
              />
            ) : (
              <span className="w-3 h-3 border border-white/20 rounded-full block" />
            )}
            <span className={`font-mono text-xs ${idx === currentStep ? 'text-white' : idx < currentStep ? 'text-white/50' : 'text-white/20'}`}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
