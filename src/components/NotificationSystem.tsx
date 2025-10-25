import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationSystemProps {
  currentUser: { id: string; name: string } | null;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({ currentUser }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      title: 'Novo Evento Adicionado',
      message: 'O evento "Workshop de Frevo" foi adicionado ao calendário.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false
    },
    {
      id: '2',
      type: 'success',
      title: 'Inscrição Confirmada',
      message: 'Sua inscrição no Festival Rec-Beat 2025 foi confirmada.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false
    },
    {
      id: '3',
      type: 'warning',
      title: 'Evento Próximo',
      message: 'O evento "Teatro de Santa Isabel" acontece amanhã às 20:30.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: true
    },
    {
      id: '4',
      type: 'info',
      title: 'Novo Comentário',
      message: 'Você recebeu um novo comentário na sua avaliação do Carnaval de Olinda.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true
    }
  ]);

  const [showPanel, setShowPanel] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('Todas as notificações foram marcadas como lidas');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notificação removida');
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="notification-icon success" />;
      case 'warning':
        return <AlertCircle size={20} className="notification-icon warning" />;
      case 'error':
        return <AlertCircle size={20} className="notification-icon error" />;
      default:
        return <Info size={20} className="notification-icon info" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `${minutes} min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  // Simular novas notificações
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ['info', 'success', 'warning'][Math.floor(Math.random() * 3)] as Notification['type'],
          title: 'Nova Notificação',
          message: 'Você tem uma nova atualização no sistema.',
          timestamp: new Date(),
          read: false
        };
        setNotifications(prev => [newNotification, ...prev]);
        toast.info(newNotification.title, { description: newNotification.message });
      }
    }, 30000); // A cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Botão de Notificações */}
      <button 
        className="notification-bell"
        onClick={() => setShowPanel(!showPanel)}
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {/* Painel de Notificações */}
      {showPanel && (
        <>
          <div className="notification-overlay" onClick={() => setShowPanel(false)} />
          <div className="notification-panel">
            <div className="notification-header">
              <h2>Notificações</h2>
              <div className="notification-actions">
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="mark-all-read">
                    <Check size={16} />
                    Marcar todas como lidas
                  </button>
                )}
                <button onClick={() => setShowPanel(false)} className="close-panel">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="notifications-list">
              {notifications.length === 0 ? (
                <div className="empty-notifications">
                  <Bell size={48} />
                  <p>Nenhuma notificação</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  >
                    <div className="notification-content">
                      {getIcon(notification.type)}
                      <div className="notification-text">
                        <h3>{notification.title}</h3>
                        <p>{notification.message}</p>
                        <span className="notification-time">{formatTimestamp(notification.timestamp)}</span>
                      </div>
                    </div>
                    <div className="notification-item-actions">
                      {!notification.read && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="mark-read-btn"
                          title="Marcar como lida"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="delete-notification-btn"
                        title="Remover"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};
