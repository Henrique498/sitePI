import React, { useState, useRef, useLayoutEffect } from "react";
import { MessageCircle, X, Send, Trash2, Bot } from "lucide-react";
import type { ChatMessage } from "@/types";

interface ChatbotProps {
  isOpen: boolean;
  messages: ChatMessage[];
  onToggle: () => void;
  onClose: () => void;
  onSendMessage: (text: string) => void;
  onClear: () => void;
}

export function Chatbot({
  isOpen,
  messages,
  onToggle,
  onClose,
  onSendMessage,
  onClear,
}: ChatbotProps) {
  const [inputValue, setInputValue] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(scrollToBottom, 50);
    }
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[380px] h-[550px] bg-white rounded-[20px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-slide-up">
          {/* HEADER ROSA FIEL */}
          <div className="bg-[#fc0288] p-4 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot size={22} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[14px] leading-tight">
                  Assistente PETCONNECTTA
                </span>
                <span className="text-[11px] opacity-90">
                  Sempre online para ajudar
                </span>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={onClear}
                className="hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={onClose}
                className="hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* ÁREA DE MENSAGENS COM FORMATO CIRCULAR PARA O USUÁRIO */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fa] flex flex-col"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 text-[14px] leading-relaxed shadow-sm ${
                    m.isUser
                      ? "bg-[#fc0288] text-white rounded-[25px] px-5 py-2 min-w-[40px] text-center" // Formato redondo da imagem
                      : "bg-white text-gray-700 border border-gray-100 rounded-[18px] rounded-tl-none" // Formato do Bot
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* INPUT AREA */}
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-white border-t flex gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-gray-100 rounded-full px-5 py-2.5 text-sm outline-none border-none focus:ring-1 focus:ring-[#fc0288]/50 text-black"
            />
            <button
              type="submit"
              className="bg-[#fc0288] p-2.5 rounded-full text-white hover:brightness-110 active:scale-90 transition-all shadow-md"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}

      {/* BOTÃO FLUTUANTE */}
      <button
        onClick={onToggle}
        className="bg-[#fc0288] p-4 rounded-full shadow-lg text-white hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <MessageCircle size={30} />
      </button>
    </div>
  );
}
