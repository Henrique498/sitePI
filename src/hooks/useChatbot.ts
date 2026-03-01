import { useState, useCallback } from "react";
import type { ChatMessage } from "@/types";

// Adicionei emojis e quebras de linha duplas para parecerem tópicos claros
const menuMessage =
  "Como posso ajudar? Digite o número da opção:\n\n" +
  "📍 1 - Como adotar\n" +
  "📍 2 - Informações sobre ONGs\n" +
  "📍 3 - Cães com deficiência\n" +
  "📍 4 - Processo de adoção\n\n" +
  "Ou digite sua dúvida abaixo:";

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Olá! " + menuMessage,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      let response =
        "Não entendi. 🤔\nDigite 'ajuda' para ver o menu de opções.";
      const input = text.trim();

      if (input === "1")
        response =
          '🐾 Para adotar, acesse a aba "Adoção" e escolha seu novo melhor amigo!';
      if (input === "2")
        response = '🏠 Veja as ONGs parceiras na nossa aba de "Localizações".';
      if (input === "3")
        response =
          "♿ Cães especiais esperam por você! Confira na vitrine de adoção.";
      if (input === "4")
        response =
          "📝 A adoção requer preenchimento de formulário e uma breve entrevista.";
      if (input.toLowerCase().includes("ajuda")) response = menuMessage;

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  }, []);

  return {
    messages,
    isOpen,
    sendMessage,
    toggleChat: () => setIsOpen((prev) => !prev),
    closeChat: () => setIsOpen(false),
    clearMessages: () =>
      setMessages([
        { id: "1", text: menuMessage, isUser: false, timestamp: new Date() },
      ]),
  };
}
