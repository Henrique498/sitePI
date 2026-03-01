import { useState, useCallback } from "react"; // useEffect removido daqui
import type { ChatMessage } from "@/types";

const menuMessage =
  "Como posso ajudar? Digite o número da opção:\n1 - Como adotar\n2 - Informações sobre ONGs\n3 - Cães com deficiência\n4 - Processo de adoção\n\nOu digite sua dúvida:";

const botResponses: Record<string, string> = {
  oi: "Olá! Bem-vindo ao PETCONNECTTA! Como posso ajudar você hoje?",
  ola: "Olá! Bem-vindo ao PETCONNECTTA! Como posso ajudar você hoje?",
  ajuda: menuMessage,
  adotar:
    'Para adotar, navegue na aba "Adoção", escolha um cão e clique em "Quero Adotar".',
  ong: 'Temos várias ONGs parceiras! Confira na aba "Localizações".',
  deficiencia:
    "Cães com deficiência são muito especiais e estão prontos para receber amor!",
  tchau: "Até mais! Espero que encontre seu novo melhor amigo!",
};

function findBestResponse(message: string): string {
  const input = message.trim().toLowerCase();
  if (input === "1" || input === "4") return botResponses.adotar;
  if (input === "2") return botResponses.ong;
  if (input === "3") return botResponses.deficiencia;

  for (const [key, response] of Object.entries(botResponses)) {
    if (input.includes(key)) return response;
  }
  return `Não entendi muito bem. 🐾\n\n${menuMessage}`;
}

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Olá! Sou o assistente do PETCONNECTTA!\n\n" + menuMessage,
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
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: findBestResponse(text),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  }, []);

  return {
    messages,
    isOpen,
    setIsOpen,
    sendMessage,
    toggleChat: () => setIsOpen((prev) => !prev),
    closeChat: () => setIsOpen(false),
    clearMessages: () =>
      setMessages([
        {
          id: "1",
          text: "Conversa reiniciada.\n\n" + menuMessage,
          isUser: false,
          timestamp: new Date(),
        },
      ]),
  };
}
