import { useState, useCallback } from 'react';
import type { ChatMessage } from '@/types';

const botResponses: Record<string, string> = {
  'oi': 'Olá! Bem-vindo ao PETCONECTTA! Como posso ajudar você hoje?',
  'ola': 'Olá! Bem-vindo ao PETCONECTTA! Como posso ajudar você hoje?',
  'eai': 'E aí! Pronto para encontrar um amigo de quatro patas?',
  'ajuda': 'Posso ajudar com: \n- Como adotar\n- Informações sobre ONGs\n- Cães com deficiência\n- Processo de adoção\nO que você gostaria de saber?',
  'adotar': 'Para adotar um cachorro, siga estes passos:\n1. Navegue na aba "Adoção"\n2. Escolha um cachorro que você se identifique\n3. Clique em "Quero Adotar"\n4. Preencha o formulário\n5. Aguarde contato da ONG',
  'ong': 'Temos várias ONGs parceiras em diferentes cidades. Você pode ver todas na aba "Localizações" ou filtrar por ONG na página de adoção.',
  'deficiencia': 'Cães com deficiência são super especiais! Eles precisam de cuidados específicos, mas retribuem com muito amor. Temos cadeiras de rodas, cegos, surdos e amputados esperando um lar.',
  'cadeira de rodas': 'Cães com cadeira de rodas levam uma vida normal! Eles correm, brincam e são muito felizes. O custo da cadeira é geralmente absorvido pela ONG.',
  'custo': 'A adoção é gratuita! Algumas ONGs pedem uma contribuição simbólica para custos veterinários, mas isso varia.',
  'vacina': 'Todos os nossos cães são vacinados e vermifugados antes da adoção. A maioria também já é castrada.',
  'castracao': 'Sim! A maioria dos nossos cães já é castrada. Isso ajuda no controle populacional e na saúde do animal.',
  'favoritos': 'Para salvar um cachorro nos favoritos, clique no coração no canto do card. Você pode ver todos os favoritos na aba "Favoritos".',
  'contato': 'Você pode entrar em contato conosco pela página de Contato ou diretamente com a ONG responsável pelo cachorro.',
  'tchau': 'Até mais! Espero que encontre seu novo melhor amigo!',
  'obrigado': 'Por nada! Estou aqui para ajudar. Qualquer dúvida é só chamar!',
  'valeu': 'De nada! Boa sorte na adoção!'
};

function findBestResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  for (const [key, response] of Object.entries(botResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  return 'Desculpe, não entendi muito bem. Posso ajudar com:\n- Como adotar\n- Informações sobre ONGs\n- Cães com deficiência\n- Processo de adoção\nO que você gostaria de saber?';
}

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Olá! Sou o assistente virtual do PETCONECTTA! Como posso ajudar você hoje?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = useCallback((text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: findBestResponse(text),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: '1',
        text: 'Olá! Sou o assistente virtual do PETCONECTTA! Como posso ajudar você hoje?',
        isUser: false,
        timestamp: new Date()
      }
    ]);
  }, []);

  return {
    messages,
    isOpen,
    sendMessage,
    toggleChat,
    closeChat,
    openChat,
    clearMessages
  };
}
