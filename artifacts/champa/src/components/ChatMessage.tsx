import { motion } from 'framer-motion';
import { Message } from '@/types';

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[85%] rounded-2xl p-4 ${isUser ? 'bg-white text-black rounded-br-sm' : 'bg-card border border-border rounded-bl-sm text-white'}`}>
        {message.role === 'system' ? (
          <p className="font-display text-xs uppercase tracking-widest text-white/50">{message.content}</p>
        ) : (
          <div className="font-sans text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
            {message.isGenerating && (
              <span className="inline-block w-2 h-4 bg-white/50 ml-1 animate-pulse align-middle" />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
