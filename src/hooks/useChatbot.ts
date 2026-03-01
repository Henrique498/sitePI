import { useState, useCallback } from "react";
import type { ChatMessage } from "@/types";

const menuMessage =
  "Como posso ajudar? Digite o número:\n1 - Como adotar\n2 - Informações sobre ONGs\n3 - Cães com deficiência\n4 - Processo de adoção";

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
      let response = "Não entendi. Digite 'ajuda' para o menu.";
      const input = text.trim();

      if (input === "1") response = 'Para adotar, acesse a aba "Adoção"!';
      if (input === "2") response = 'Veja as ONGs em "Localizações".';
      if (input === "3") response = "Cães especiais esperam por você!";
      if (input === "4") response = "A adoção requer entrevista e formulário.";
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
