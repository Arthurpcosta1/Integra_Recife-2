import React from 'react';
import { Heart, Calendar, Bell, Settings as SettingsIcon, User } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProfileEvent {
  id: number;
  title: string;
  date: string;
  image: string;
  hasRated?: boolean;
}

interface ProfileScreenProps {
  user: {
    name: string;
    avatar: string;
  };
  favoriteEvents: ProfileEvent[];
  pastEvents: ProfileEvent[];
  onEventClick: (eventId: number) => void;
  onRateEvent: (eventId: number) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  user, 
  favoriteEvents, 
  pastEvents,
  onEventClick,
  onRateEvent 
}) => {
  return (
    <div className="profile-screen">
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <ImageWithFallback 
            src={user.avatar} 
            alt={user.name}
            className="profile-avatar"
          />
        </div>
        <h1 className="profile-name">{user.name}</h1>
        <p className="profile-subtitle">Amante da cultura do Recife</p>
      </div>

      {/* Meus Eventos Favoritos */}
      <div className="profile-section">
        <div className="section-header">
          <Heart size={24} className="section-icon" />
          <h2>Meus Eventos Favoritos</h2>
        </div>
        <div className="profile-events-list">
          {favoriteEvents.length === 0 ? (
            <p className="empty-message">Você ainda não favoritou nenhum evento</p>
          ) : (
            favoriteEvents.map((event) => (
              <div 
                key={event.id} 
                className="profile-event-item"
                onClick={() => onEventClick(event.id)}
              >
                <ImageWithFallback 
                  src={event.image} 
                  alt={event.title}
                  className="profile-event-image"
                />
                <div className="profile-event-info">
                  <h3>{event.title}</h3>
                  <p>{event.date}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Meus Eventos Passados */}
      <div className="profile-section">
        <div className="section-header">
          <Calendar size={24} className="section-icon" />
          <h2>Meus Eventos Passados</h2>
        </div>
        <div className="profile-events-list">
          {pastEvents.length === 0 ? (
            <p className="empty-message">Você ainda não participou de nenhum evento</p>
          ) : (
            pastEvents.map((event) => (
              <div 
                key={event.id} 
                className="profile-event-item"
              >
                <ImageWithFallback 
                  src={event.image} 
                  alt={event.title}
                  className="profile-event-image"
                />
                <div className="profile-event-info">
                  <h3>{event.title}</h3>
                  <p>{event.date}</p>
                </div>
                {!event.hasRated && (
                  <button 
                    className="rate-btn"
                    onClick={() => onRateEvent(event.id)}
                  >
                    Avaliar
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Configurações de Notificações */}
      <div className="profile-section">
        <div className="section-header">
          <Bell size={24} className="section-icon" />
          <h2>Configurações de Notificações</h2>
        </div>
        <div className="notification-settings">
          <p className="settings-description">
            Escolha as categorias de eventos para receber alertas
          </p>
          <div className="category-toggles">
            <label className="toggle-item">
              <input type="checkbox" defaultChecked />
              <span>Música</span>
            </label>
            <label className="toggle-item">
              <input type="checkbox" defaultChecked />
              <span>Teatro</span>
            </label>
            <label className="toggle-item">
              <input type="checkbox" />
              <span>Gastronomia</span>
            </label>
            <label className="toggle-item">
              <input type="checkbox" defaultChecked />
              <span>Festivais</span>
            </label>
            <label className="toggle-item">
              <input type="checkbox" />
              <span>Esportes</span>
            </label>
            <label className="toggle-item">
              <input type="checkbox" defaultChecked />
              <span>Arte e Cultura</span>
            </label>
          </div>
        </div>
      </div>

      <button className="secondary-btn full-width" style={{ marginTop: '20px' }}>
        <SettingsIcon size={20} />
        Configurações da Conta
      </button>
    </div>
  );
};
