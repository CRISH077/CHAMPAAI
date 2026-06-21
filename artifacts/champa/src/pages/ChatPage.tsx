import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, ChevronDown, Check, Save } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { useMemoryStore } from '@/store/memoryStore';
import ChatMessage from '@/components/ChatMessage';
import AgentProgress from '@/components/AgentProgress';
import { streamChatCompletion } from '@/services/openrouter';
import { useVoice } from '@/hooks/useVoice';

const FREE_MODELS = [
  { id: 'nvidia/nemotron-3-ultra-550b-a55b:free', label: 'Nemotron 3 Ultra', provider: 'NVIDIA' },
  { id: 'nvidia/nemotron-3-super-120b-a12b:free', label: 'Nemotron 3 Super', provider: 'NVIDIA' },
  { id: 'openai/gpt-oss-120b:free', label: 'GPT-OSS 120B', provider: 'OpenAI' },
  { id: 'openrouter/owl-alpha', label: 'Owl Alpha', provider: 'Owl' },
  { id: 'nex-agi/nex-n2-pro:free', label: 'Nex-N2-Pro', provider: 'Nex AGI' },
  { id: 'poolside/laguna-m.1:free', label: 'Laguna M.1', provider: 'Poolside' },
];

export default function ChatPage() {
  const {
    messages, addMessage, updateMessage,
    isLoading, setLoading,
    selectedModel, setSelectedModel,
    isGeneratingImage, setGeneratingImage,
  } = useChatStore();
  const { addMemory } = useMemoryStore();

  const [input, setInput] = useState('');
  const [showModels, setShowModels] = useState(false);
  const [agentStep, setAgentStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modelMenuRef = useRef<HTMLDivElement>(null);
  const { isListening, transcript, toggleListening, setTranscript } = useVoice();

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages, isGeneratingImage, agentStep]);
  useEffect(() => { if (transcript) setInput(transcript); }, [transcript]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(e.target as Node)) setShowModels(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const currentModel = FREE_MODELS.find(m => m.id === selectedModel) || FREE_MODELS[0];

  const saveLastResponseAsMemory = () => {
    const lastAI = [...messages].reverse().find(m => m.role === 'assistant' && m.content);
    if (!lastAI) return;
    addMemory({
      id: Date.now().toString(),
      content: lastAI.content.slice(0, 200),
      timestamp: Date.now(),
      pinned: false,
    });
  };

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
      const steps = ['Finding best AI service', 'Connecting to image model', 'Writing optimized prompt', 'Generating image', 'Almost done...'];
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
          <span className="font-display tracking-widest text-xs">CHAMPA — ONLINE</span>
        </div>

        <div className="flex items-center gap-2">
          {messages.some(m => m.role === 'assistant') && (
            <button
              onClick={saveLastResponseAsMemory}
              title="Save last response to memory"
              className="text-white/30 hover:text-white border border-white/10 hover:border-white/30 rounded-lg p-1.5 transition-all"
            >
              <Save size={13} />
            </button>
          )}

          {/* Model selector */}
          <div className="relative" ref={modelMenuRef}>
            <button
              data-testid="model-selector"
              onClick={() => setShowModels(!showModels)}
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/30 rounded-lg px-3 py-1.5 transition-all"
            >
              <span className="font-mono">{currentModel.label}</span>
              <ChevronDown size={11} className={`transition-transform ${showModels ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showModels && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.13 }}
                  className="absolute right-0 top-full mt-2 w-60 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl"
                >
                  <div className="px-3 py-2 border-b border-white/5">
                    <span className="text-[10px] text-white/30 font-mono tracking-widest">FREE MODELS</span>
                  </div>
                  {FREE_MODELS.map(model => (
                    <button
                      key={model.id}
                      data-testid={`model-${model.label}`}
                      onClick={() => { setSelectedModel(model.id); setShowModels(false); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
                    >
                      <div>
                        <p className="text-xs text-white/80 font-mono">{model.label}</p>
                        <p className="text-[10px] text-white/30">{model.provider}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-white/25 border border-white/10 rounded px-1 py-0.5 font-mono">FREE</span>
                        {selectedModel === model.id && <Check size={12} className="text-white" />}
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center pt-12"
          >
            <p className="font-display text-4xl font-bold tracking-widest text-white/10">CHAMPA</p>
            <p className="font-mono text-xs text-white/25 mt-3">SEND A MESSAGE TO BEGIN</p>
          </motion.div>
        )}

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
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black flex items-center justify-center">
                    <span className="font-mono text-xs text-white/20">[IMAGE GENERATED]</span>
                  </div>
                  <p className="text-xs text-white/30 font-mono mt-2 text-center">IMAGE ASSET READY</p>
                </div>
              </motion.div>
            ) : (
              <ChatMessage key={msg.id} message={msg} />
            )
          )}
        </AnimatePresence>

        {isGeneratingImage && (
          <AgentProgress
            steps={['Finding best AI service', 'Connecting to image model', 'Writing optimized prompt', 'Generating image', 'Almost done...']}
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
            data-testid="voice-btn"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${isListening ? 'bg-white text-black animate-pulse' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <Mic size={18} />
          </button>
          <textarea
            data-testid="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={isListening ? 'Listening...' : 'Command CHAMPA...'}
            className="flex-1 bg-transparent border-0 outline-none resize-none max-h-32 min-h-[40px] py-2.5 text-sm placeholder:text-white/25 text-white"
            rows={1}
          />
          <button
            data-testid="send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-white text-black rounded-xl disabled:opacity-30 flex-shrink-0 transition-opacity hover:bg-white/80"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-[10px] text-white/20 font-mono mt-2">
          {currentModel.provider} · {currentModel.label} · FREE
        </p>
      </div>
    </div>
  );
}
