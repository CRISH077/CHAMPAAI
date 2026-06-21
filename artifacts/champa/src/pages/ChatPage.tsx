import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, ChevronDown, Check } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import ChatMessage from '@/components/ChatMessage';
import AgentProgress from '@/components/AgentProgress';
import { streamChatCompletion } from '@/services/openrouter';
import { useVoice } from '@/hooks/useVoice';

const FREE_MODELS = [
  { id: 'meta-llama/llama-3.1-8b-instruct:free', label: 'Llama 3.1 8B', tag: 'FREE' },
  { id: 'meta-llama/llama-3.2-11b-vision-instruct:free', label: 'Llama 3.2 11B', tag: 'FREE' },
  { id: 'mistralai/mistral-7b-instruct:free', label: 'Mistral 7B', tag: 'FREE' },
  { id: 'google/gemma-2-9b-it:free', label: 'Gemma 2 9B', tag: 'FREE' },
  { id: 'deepseek/deepseek-r1:free', label: 'DeepSeek R1', tag: 'FREE' },
  { id: 'qwen/qwen-2.5-72b-instruct:free', label: 'Qwen 2.5 72B', tag: 'FREE' },
  { id: 'microsoft/phi-3-mini-128k-instruct:free', label: 'Phi-3 Mini', tag: 'FREE' },
];

export default function ChatPage() {
  const { messages, addMessage, updateMessage, isLoading, setLoading, selectedModel, setSelectedModel, isGeneratingImage, setGeneratingImage } = useChatStore();
  const [input, setInput] = useState('');
  const [showModels, setShowModels] = useState(false);
  const [agentStep, setAgentStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modelMenuRef = useRef<HTMLDivElement>(null);
  const { isListening, transcript, toggleListening, setTranscript } = useVoice();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, isGeneratingImage, agentStep]);
  useEffect(() => { if (transcript) setInput(transcript); }, [transcript]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(e.target as Node)) {
        setShowModels(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const currentModel = FREE_MODELS.find(m => m.id === selectedModel) || FREE_MODELS[0];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input,
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    const sentInput = input;
    setInput('');
    setTranscript('');
    setLoading(true);

    if (sentInput.toLowerCase().includes('generate image') || sentInput.toLowerCase().includes('create image')) {
      setGeneratingImage(true);
      const steps = ['Finding best AI service', 'Opening Leonardo.AI', 'Writing optimized prompt', 'Generating image', 'Almost done...'];
      for (let i = 0; i < steps.length; i++) {
        setAgentStep(i);
        await new Promise(r => setTimeout(r, 1400));
      }
      setGeneratingImage(false);
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '[IMAGE_GENERATED]',
        timestamp: Date.now(),
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
      isGenerating: true,
    });

    let fullResponse = '';
    await streamChatCompletion([...messages, userMessage], selectedModel, (chunk) => {
      fullResponse += chunk;
      updateMessage(assistantMsgId, fullResponse);
    });

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <header className="px-5 py-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          <span className="font-display tracking-widest text-xs text-white">CHAMPA — ONLINE</span>
        </div>

        {/* Model selector */}
        <div className="relative" ref={modelMenuRef}>
          <button
            data-testid="model-selector"
            onClick={() => setShowModels(!showModels)}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/30 rounded-lg px-3 py-1.5 transition-all"
          >
            <span className="font-mono">{currentModel.label}</span>
            <ChevronDown size={12} className={`transition-transform ${showModels ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showModels && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl"
              >
                <div className="px-3 py-2 border-b border-white/5">
                  <span className="text-[10px] text-white/30 font-mono tracking-widest">SELECT MODEL</span>
                </div>
                {FREE_MODELS.map(model => (
                  <button
                    key={model.id}
                    data-testid={`model-option-${model.id}`}
                    onClick={() => { setSelectedModel(model.id); setShowModels(false); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
                  >
                    <span className="text-xs text-white/80 font-mono">{model.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-white/30 border border-white/10 rounded px-1 py-0.5">FREE</span>
                      {selectedModel === model.id && <Check size={12} className="text-white" />}
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((msg) =>
            msg.content === '[IMAGE_GENERATED]' ? (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[85%]"
              >
                <div className="bg-[#111] border border-white/10 rounded-2xl p-3">
                  <div className="aspect-square bg-zinc-900 rounded-xl flex flex-col items-center justify-center text-white/20 relative overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black rounded-xl flex items-center justify-center">
                      <span className="font-mono text-xs text-white/30">[IMAGE GENERATED]</span>
                    </div>
                  </div>
                  <p className="text-xs text-white/40 font-mono mt-2 text-center">Here is your image.</p>
                </div>
              </motion.div>
            ) : (
              <ChatMessage key={msg.id} message={msg} />
            )
          )}
        </AnimatePresence>

        {isGeneratingImage && (
          <AgentProgress
            steps={['Finding best AI service', 'Opening Leonardo.AI', 'Writing optimized prompt', 'Generating image', 'Almost done...']}
            currentStep={agentStep}
          />
        )}

        {isLoading && !isGeneratingImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 px-1">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-white/40 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
            <span className="text-xs text-white/30 font-mono">Thinking...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-black">
        <div className="flex items-end gap-2 bg-[#0d0d0d] border border-white/10 rounded-2xl p-2 focus-within:border-white/30 transition-colors">
          <button
            data-testid="voice-input-btn"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${isListening ? 'bg-white text-black animate-pulse' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <Mic size={18} />
          </button>
          <textarea
            data-testid="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isListening ? 'Listening...' : 'Command CHAMPA...'}
            className="flex-1 bg-transparent border-0 outline-none resize-none max-h-32 min-h-[40px] py-2.5 text-sm font-sans placeholder:text-white/25 text-white"
            rows={1}
          />
          <button
            data-testid="send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-white text-black rounded-xl disabled:opacity-30 flex-shrink-0 transition-opacity"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-[10px] text-white/20 font-mono mt-2">
          {currentModel.label} · FREE
        </p>
      </div>
    </div>
  );
}
