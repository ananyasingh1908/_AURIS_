import React, { useState, useRef, useEffect } from 'react';
import { useAuris } from '../store/AurisContext';
import { sendGeminiMessage, ChatMessage } from '../services/aiChatService';
import {
  Sparkles,
  X,
  Send,
  BrainCircuit,
  MapPin,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Activity,
  Bot,
  Loader2,
  AlertCircle,
  RefreshCcw,
  Zap,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AiAssistantDrawer: React.FC = () => {
  const {
    aiDrawerOpen,
    setAiDrawerOpen,
    currentRole,
    currentCity,
    currentCountry,
    selectedIncident
  } = useAuris() as any;

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const defaultSuggestedPrompts = [
    'Explain AURIS',
    'What critical incidents are active?',
    'Why is the water incident high risk?',
    'Which departments are affected?'
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'auris',
      text: `Hello! I am the **AURIS Autonomous Intelligence Assistant**, powered by Google Gemini and connected to the real-time multi-agent urban operational pipeline for **${currentCity || 'Mumbai'}, ${currentCountry || 'India'}**.\n\nAsk me about live incidents, mathematical risk formulas, department responses, or cross-domain intelligence.`,
      timestamp: 'Just now',
      model: 'gemini-2.5-flash'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (aiDrawerOpen) {
      scrollToBottom();
    }
  }, [messages, aiDrawerOpen, isLoading]);

  if (!aiDrawerOpen) return null;

  const handleSendPrompt = async (promptText: string) => {
    const textToSend = promptText.trim();
    if (!textToSend || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setErrorMessage('');

    // Format previous messages for Gemini context
    const historyPayload = messages
      .filter((m) => m.id !== 'm1' || m.sender === 'user')
      .map((m) => ({ sender: m.sender, text: m.text }));

    const chatContext = {
      role: currentRole,
      city: currentCity,
      country: currentCountry,
      selectedIncident: selectedIncident
        ? {
            id: selectedIncident.id,
            title: selectedIncident.title,
            category: selectedIncident.category,
            severity: selectedIncident.severity,
            city: selectedIncident.city,
            department: selectedIncident.department
          }
        : undefined
    };

    try {
      const response = await sendGeminiMessage(textToSend, historyPayload, chatContext);

      const aiMsg: ChatMessage = {
        id: `auris-${Date.now()}`,
        sender: 'auris',
        text: response.reply,
        timestamp: 'Just now',
        model: response.model || 'gemini-2.5-flash'
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('AURIS Gemini AI error:', err);
      setErrorMessage(err.message || 'Failed to connect to AURIS Gemini AI. Please check your backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to render full markdown without any length cutoffs or truncation
  const renderFormattedText = (rawText: string) => {
    if (!rawText) return null;
    const lines = rawText.split('\n');

    return (
      <div className="space-y-2.5 text-xs leading-relaxed text-slate-800 break-words">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }

          // Horizontal rule
          if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
            return <hr key={idx} className="my-2 border-slate-200/80" />;
          }

          // Headers
          if (trimmed.startsWith('#### ')) {
            return (
              <h5 key={idx} className="font-bold text-slate-900 text-xs mt-2 text-sky-800">
                {parseInlineStyles(trimmed.replace('#### ', ''))}
              </h5>
            );
          }
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-slate-900 text-sm mt-3 pt-1 border-b border-slate-200/60 pb-1">
                {parseInlineStyles(trimmed.replace('### ', ''))}
              </h4>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={idx} className="font-extrabold text-slate-900 text-sm mt-3.5 text-slate-900">
                {parseInlineStyles(trimmed.replace('## ', ''))}
              </h3>
            );
          }
          if (trimmed.startsWith('# ')) {
            return (
              <h2 key={idx} className="font-extrabold text-slate-900 text-base mt-4">
                {parseInlineStyles(trimmed.replace('# ', ''))}
              </h2>
            );
          }

          // Blockquotes
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote key={idx} className="border-l-2 border-sky-400 pl-3 py-1 bg-sky-50/50 rounded-r-xl text-slate-700 italic text-[11px] my-1">
                {parseInlineStyles(trimmed.replace('> ', ''))}
              </blockquote>
            );
          }

          // Bullet points
          if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
            const clean = trimmed.replace(/^[-•*]\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-1.5 my-1">
                <span className="text-sky-600 font-bold shrink-0 mt-0.5">•</span>
                <span className="flex-1 leading-relaxed">{parseInlineStyles(clean)}</span>
              </div>
            );
          }

          // Numbered lists
          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1.5 my-1">
                <span className="text-sky-700 font-bold text-[11px] shrink-0 mt-0.5">{numMatch[1]}.</span>
                <span className="flex-1 leading-relaxed">{parseInlineStyles(numMatch[2])}</span>
              </div>
            );
          }

          return (
            <p key={idx} className="leading-relaxed">
              {parseInlineStyles(line)}
            </p>
          );
        })}
      </div>
    );
  };

  const parseInlineStyles = (text: string) => {
    if (!text) return text;

    // Process backtick inline code `code` and bold **text**
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-slate-200/70 font-mono text-[10px] text-sky-900 font-semibold">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-slate-950">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 z-[1050] flex justify-end bg-slate-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        className="w-full max-w-md sm:max-w-xl bg-white h-full shadow-floating border-l border-slate-200 flex flex-col justify-between"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-teal-400 p-[2px] shadow-sm">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-sky-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">AURIS City Assistant</h3>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-md uppercase">
                  Gemini AI Live
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Grounded in multi-agent city data & telemetry
              </p>
            </div>
          </div>
          <button
            onClick={() => setAiDrawerOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread with Full Vertical Scrolling and Expanding Bubble Width */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 min-w-0">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`w-full max-w-[96%] sm:max-w-[94%] p-3.5 sm:p-4 rounded-2xl leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-sm shadow-sm ml-auto max-w-[85%]'
                    : 'bg-slate-50 text-slate-800 rounded-tl-sm border border-slate-200/80 shadow-subtle'
                }`}
              >
                {msg.sender === 'user' ? (
                  <p className="whitespace-pre-wrap text-xs font-medium text-white">{msg.text}</p>
                ) : (
                  renderFormattedText(msg.text)
                )}

                {msg.model && msg.sender === 'auris' && (
                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Sparkles className="w-3 h-3 text-sky-500" />
                      {msg.model}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Thinking / Loading Animation */}
          {isLoading && (
            <div className="flex items-start gap-2 max-w-[90%]">
              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200/80 rounded-tl-sm text-xs text-sky-900 flex items-center gap-2.5 shadow-subtle">
                <Loader2 className="w-4 h-4 text-sky-600 animate-spin" />
                <span className="font-semibold animate-pulse">
                  Gemini AI analyzing cross-department intelligence...
                </span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">AURIS AI Connection Error</p>
                <p className="text-[11px] text-red-700 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Action Chips */}
        <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex flex-wrap gap-1.5 shrink-0">
          {defaultSuggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(prompt)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-sky-700 text-[11px] font-medium shadow-subtle hover:bg-sky-50 transition-all flex items-center gap-1 disabled:opacity-50"
            >
              <span>{prompt}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          ))}
        </div>

        {/* Prompt Input */}
        <div className="p-4 border-t border-slate-100 bg-white shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Ask AURIS about incidents, risk, departments..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition-all disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
              title="Send to Gemini AI"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
          <div className="mt-2 text-center">
            <span className="text-[10px] text-slate-400">
              AURIS Gemini AI synthesizes spatial telemetry & civic signals in real-time
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
