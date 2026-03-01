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

  // Função que força o scroll para o final absoluto
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      // Executa imediatamente e 100ms depois para garantir que o DOM atualizou
      scrollToBottom();
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
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
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end text-black">
      {isOpen && (
        <div className="mb-4 w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-slide-up">
          {/* Header Rosa (Igual à imagem) */}
          <div className="bg-[#fc0288] p-4 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-none">
                  Assistente PETCONNECTTA
                </span>
                <span className="text-[10px] opacity-80 mt-1">
                  Sempre online para ajudar
                </span>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={onClear}
                className="hover:bg-white/20 p-1.5 rounded-md transition-colors"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={onClose}
                className="hover:bg-white/20 p-1.5 rounded-md transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Área de Mensagens com scroll forçado */}
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
                  className={`max-w-[85%] p-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                    m.isUser
                      ? "bg-[#fc0288] text-white rounded-br-none"
                      : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Rosa */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t flex gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-gray-100 rounded-lg px-4 py-2.5 text-sm outline-none border-none focus:ring-2 focus:ring-[#fc0288]/30 text-black"
            />
            <button
              type="submit"
              className="bg-[#fc0288] p-2.5 rounded-lg text-white hover:brightness-110 transition-all active:scale-95 shadow-md"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Botão flutuante Rosa */}
      <button
        onClick={onToggle}
        className="bg-[#fc0288] p-4 rounded-full shadow-lg text-white hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <MessageCircle size={32} />
      </button>
    </div>
  );
}
