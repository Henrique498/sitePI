import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { ThemeProvider } from '@/hooks/useTheme';
import { useNotifications } from '@/hooks/useNotifications';
import { useChatbot } from '@/hooks/useChatbot';
import { Navigation } from '@/components/Navigation';
import { NotificationPanel } from '@/components/NotificationPanel';
import { Chatbot } from '@/components/Chatbot';
import { AuthPage } from '@/pages/AuthPage';
import { HomePage } from '@/pages/HomePage';
import { AdoptionPage } from '@/pages/AdoptionPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { LocationsPage } from '@/pages/LocationsPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

type Page = 'home' | 'adoption' | 'favorites' | 'locations' | 'about' | 'contact';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    removeNotification,
    clearAll
  } = useNotifications();

  const {
    messages,
    isOpen: chatbotOpen,
    sendMessage,
    toggleChat,
    closeChat,
    clearMessages
  } = useChatbot();

  // Welcome notification on first login
  useEffect(() => {
    if (isAuthenticated) {
      const hasSeenWelcome = sessionStorage.getItem('petconectta_welcome');
      if (!hasSeenWelcome) {
        setTimeout(() => {
          addNotification(
            'Bem-vindo ao PETCONECTTA!',
            'Estamos felizes em tê-lo aqui. Explore nossos cães disponíveis para adoção.',
            'success'
          );
          toast.success('Bem-vindo ao PETCONECTTA!', {
            description: 'Explore nossos cães disponíveis para adoção.'
          });
          sessionStorage.setItem('petconectta_welcome', 'true');
        }, 1000);
      }
    }
  }, [isAuthenticated, addNotification]);

  // Periodic notifications
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const random = Math.random();
      if (random < 0.1) {
        const messages = [
          { title: 'Novo cachorro disponível!', msg: 'Um novo amigo acabou de chegar na nossa plataforma.' },
          { title: 'Dica de cuidado', msg: 'Cães especiais precisam de atenção redobrada. Saiba mais!' },
          { title: 'ONG próxima de você', msg: 'Tem uma ONG parceira na sua cidade. Confira!' }
        ];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        addNotification(randomMsg.title, randomMsg.msg, 'info');
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isAuthenticated, addNotification]);

  const handlePageChange = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={handlePageChange} />;
      case 'adoption':
        return <AdoptionPage />;
      case 'favorites':
        return <FavoritesPage onPageChange={handlePageChange} />;
      case 'locations':
        return <LocationsPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage onPageChange={handlePageChange} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <AuthPage />
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Navigation
          currentPage={currentPage}
          onPageChange={handlePageChange}
          notificationCount={unreadCount}
          onOpenNotifications={() => setNotificationsOpen(true)}
        />
        
        <main className="min-h-[calc(100vh-64px)]">
          {renderPage()}
        </main>

        {/* Notification Panel */}
        <NotificationPanel
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onRemove={removeNotification}
          onClearAll={clearAll}
        />

        {/* Chatbot */}
        <Chatbot
          isOpen={chatbotOpen}
          messages={messages}
          onToggle={toggleChat}
          onClose={closeChat}
          onSendMessage={sendMessage}
          onClear={clearMessages}
        />

        {/* Toast notifications */}
        <Toaster position="top-right" richColors />
      </div>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
