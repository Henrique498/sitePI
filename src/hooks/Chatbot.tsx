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

  // Função de scroll que garante ir até o final
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  };

  // Dispara o scroll sempre que as mensagens mudarem
  useLayoutEffect(() => {
    if (isOpen) {
      scrollToBottom();
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
        <div className="mb-4 w-80 h-[480px] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center shrink-0">
            <span className="font-bold">PetConnectta Bot</span>
            <div className="flex gap-2">
              <button
                onClick={onClear}
                className="hover:bg-blue-700 p-1 rounded"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={onClose}
                className="hover:bg-blue-700 p-1 rounded"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 flex flex-col"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                    m.isUser
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 border shadow-sm rounded-tl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t flex gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none text-black"
            />
            <button
              type="submit"
              className="bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 transition"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
      <button
        onClick={onToggle}
        className="bg-blue-600 p-4 rounded-full shadow-lg text-white"
      >
        <MessageCircle size={28} />
      </button>
    </div>
  );
}
