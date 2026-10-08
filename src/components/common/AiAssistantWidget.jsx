import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Volume2,
  Minimize2,
  Maximize2,
  Trash2,
  Info,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { queryAiAssistant, AI_SUGGESTED_QUESTIONS } from '../../services/aiAssistantService';
import { playSpeechBulletin, stopSpeechBulletin } from '../../services/voiceBriefingService';
import { CITIES_DATA } from '../../data/mockData';

export default function AiAssistantWidget({ currentCity }) {
  const { currentLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const city = currentCity || CITIES_DATA[0] || { name: 'Delhi NCR', aqi: 284 };
  const cityName = city?.name || 'Your City';

  const defaultWelcomeMessage = {
    id: 'msg_welcome',
    sender: 'assistant',
    text: currentLang === 'hi'
      ? `नमस्ते! मैं आपका **AeroSense AI सहायक** हूँ। मैं **${cityName}** की हवा, स्वास्थ्य दिशानिर्देश, मास्क और प्यूरीफायर से जुड़े सवालों में आपकी मदद कर सकता हूँ। मुझसे कोई भी सवाल पूछें!`
      : `Hello! I'm your **AeroSense Environmental AI Assistant**. Ask me anything about air quality in **${cityName}**, safe jogging hours, mask recommendations, or home purifier settings!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const [messages, setMessages] = useState([defaultWelcomeMessage]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Clean speech when assistant closes
  useEffect(() => {
    if (!isOpen) {
      stopSpeechBulletin();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    // Add user message
    const userMsg = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate natural AI thinking delay
    setTimeout(() => {
      const response = queryAiAssistant(query, {
        city,
        lang: currentLang
      });

      const assistantMsg = {
        id: `msg_a_${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleSpeakText = (text) => {
    if (isSpeaking) {
      stopSpeechBulletin();
      setIsSpeaking(false);
      return;
    }

    // Strip markdown formatting for voice narration
    const cleanSpeech = text.replace(/[*_#•]/g, '').trim();
    setIsSpeaking(true);
    playSpeechBulletin(cleanSpeech, currentLang, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  const handleClearChat = () => {
    stopSpeechBulletin();
    setIsSpeaking(false);
    setMessages([defaultWelcomeMessage]);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-xl shadow-emerald-700/30 hover:scale-105 active:scale-95 transition-all duration-200 group border border-emerald-400/30"
          aria-label="Open AI Environmental Assistant"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          </div>
          <span>{currentLang === 'hi' ? 'AI सहायक से पूछें' : 'Ask AI Assistant'}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 text-white flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <Bot className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold tracking-tight">
                    {currentLang === 'hi' ? 'AeroSense AI सहायक' : 'AeroSense AI Assistant'}
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase bg-emerald-500/30 border border-emerald-400/40 text-emerald-200">
                    {currentLang === 'hi' ? 'हिन्दी & EN' : 'Online'}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/80 flex items-center gap-1">
                  <span>{city.name}</span>
                  <span>•</span>
                  <span>AQI {city.aqi}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title="Clear conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversation History */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line font-normal">
                    {msg.text}
                  </div>

                  <div className="mt-1.5 flex items-center justify-between gap-2 pt-1 border-t border-slate-100/30 text-[10px] opacity-70">
                    <span>{msg.timestamp}</span>

                    {msg.sender === 'assistant' && (
                      <button
                        type="button"
                        onClick={() => handleSpeakText(msg.text)}
                        className="hover:opacity-100 flex items-center gap-1 font-semibold text-emerald-700 hover:underline"
                        title="Listen to this response"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{currentLang === 'hi' ? 'सुनें' : 'Listen'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500 text-xs pl-9">
                <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-2xl border border-slate-200">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[11px] font-semibold text-slate-500 ml-1">
                    {currentLang === 'hi' ? 'विश्लेषण कर रहा हूँ...' : 'Analyzing telemetry...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompt Chips */}
          <div className="px-3.5 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              {currentLang === 'hi' ? 'सुझाव:' : 'Quick:'}
            </span>
            {AI_SUGGESTED_QUESTIONS.map((s, idx) => {
              const chipLabel = currentLang === 'hi' ? s.hi : s.en;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(chipLabel)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 text-[11px] font-medium border border-slate-200/60 whitespace-nowrap shrink-0 transition-colors"
                >
                  {chipLabel}
                </button>
              );
            })}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                currentLang === 'hi'
                  ? 'हवा, स्वास्थ्य, मास्क या AQI के बारे में पूछें...'
                  : 'Ask about air quality, outdoor safety, masks...'
              }
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold transition-all shadow-xs shrink-0"
              title="Send question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
