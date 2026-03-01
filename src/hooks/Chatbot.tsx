import React, { useState, useRef, useLayoutEffect } from "react";
import { MessageCircle, X, Send, Trash2 } from "lucide-react";
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

  // Função de scroll que usa o container de mensagens
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      scrollContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      // Pequeno delay para o navegador renderizar as classes do seu index.css
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
        <div className="mb-4 w-80 h-[500px] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden animate-slide-up">
          {/* Header usando seu gradiente pet do index.css */}
          <div className="bg-gradient-pet p-4 text-white flex justify-between items-center shrink-0">
            <span className="font-bold font-sans">PetConnectta Bot</span>
            <div className="flex gap-2">
              <button
                onClick={onClear}
                className="hover:bg-white/20 p-1 rounded transition-colors"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={onClose}
                className="hover:bg-white/20 p-1 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Área de Mensagens - Aqui usamos as classes do seu index.css */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`chat-message ${m.isUser ? "chat-message-user" : "chat-message-bot"} animate-fade-in`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t flex gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-muted rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-petpink text-black"
            />
            <button
              type="submit"
              className="bg-petpink p-2 rounded-full text-white hover-lift active:scale-95 transition-all"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Botão flutuante com sua animação bounce-soft */}
      <button
        onClick={onToggle}
        className="bg-gradient-pet p-4 rounded-full shadow-lg text-white animate-bounce-soft hover:shadow-xl transition-all"
      >
        <MessageCircle size={28} />
      </button>
    </div>
  );
}
