import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Mic, Send, Image as ImageIcon, Download } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import ChatMessage from '@/components/ChatMessage';
import AgentProgress from '@/components/AgentProgress';
import { streamChatCompletion } from '@/services/openrouter';
import { useVoice } from '@/hooks/useVoice';

export default function ChatPage() {
  const { messages, addMessage, updateMessage, isLoading, setLoading, isGeneratingImage, setGeneratingImage } = useChatStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isListening, transcript, toggleListening, setTranscript } = useVoice();
  const [agentStep, setAgentStep] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGeneratingImage, agentStep]);

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input,
      timestamp: Date.now()
    };
    
    addMessage(userMessage);
    setInput('');
    setTranscript('');
    setLoading(true);

    if (input.toLowerCase().includes('generate image') || input.toLowerCase().includes('create image')) {
      setGeneratingImage(true);
      const steps = ['Finding best AI service', 'Opening Leonardo.AI', 'Writing optimized prompt', 'Generating image', 'Almost done...'];
      for (let i = 0; i < steps.length; i++) {
        setAgentStep(i);
        await new Promise(r => setTimeout(r, 1500));
      }
      setGeneratingImage(false);
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '[IMAGE_GENERATED]',
        timestamp: Date.now()
      });
      setLoading(false);
      return;
    }

    const assistantMsgId = (Date.now() + 1).toString();
    addMessage({
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isGenerating: true
    });

    let fullResponse = '';
    await streamChatCompletion([...messages, userMessage], 'claude-3-haiku', (chunk) => {
      fullResponse += chunk;
      updateMessage(assistantMsgId, fullResponse);
    });
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-black">
      <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="font-display tracking-widest text-sm">CHAMPA — ONLINE</span>
        </div>
        <Settings size={18} className="text-white/50" />
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          msg.content === '[IMAGE_GENERATED]' ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={msg.id} className="bg-card border border-border rounded-2xl p-2 mb-4 max-w-[85%]">
              <div className="aspect-square bg-zinc-900 rounded-xl flex flex-col items-center justify-center text-white/30 mb-2 relative overflow-hidden group">
                <ImageIcon size={32} className="mb-2 opacity-50" />
                <span className="font-mono text-xs">Generated Asset</span>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-white text-black p-3 rounded-full"><Download size={20} /></button>
                </div>
              </div>
            </motion.div>
          ) : (
            <ChatMessage key={msg.id} message={msg} />
          )
        ))}
        {isGeneratingImage && (
          <AgentProgress 
            steps={['Finding best AI service', 'Opening Leonardo.AI', 'Writing optimized prompt', 'Generating image', 'Almost done...']} 
            currentStep={agentStep} 
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10 bg-black">
        <div className="flex items-end gap-2 bg-card border border-border rounded-2xl p-2 focus-within:border-white/50 transition-colors">
          <button 
            onClick={toggleListening}
            className={`p-3 rounded-xl transition-colors flex-shrink-0 ${isListening ? 'bg-white text-black animate-pulse' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
          >
            <Mic size={20} />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isListening ? "Listening..." : "Command CHAMPA..."}
            className="flex-1 bg-transparent border-0 outline-none resize-none max-h-32 min-h-[44px] py-3 text-sm font-sans placeholder:text-white/30"
            rows={1}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-white text-black rounded-xl disabled:opacity-50 disabled:bg-white/20 disabled:text-white flex-shrink-0"
          >
            <Send size={20} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
