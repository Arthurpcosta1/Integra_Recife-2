import React from 'react';
import { Calendar, Clock, MapPin, Share2, Star, ArrowLeft, Navigation } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface EventDetailScreenProps {
  event: {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    image: string;
    category: string;
    categoryColor: string;
    description: string;
    rating: number;
    reviewCount: number;
  };
  onBack: () => void;
  onRate: () => void;
}

export const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ event, onBack, onRate }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={18} 
          fill={i <= rating ? '#ffd700' : 'none'}
          stroke={i <= rating ? '#ffd700' : '#ccc'}
        />
      );
    }
    return stars;
  };

  return (
    <div className="detail-screen">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={20} />
        Voltar
      </button>

      <div className="detail-image-container">
        <ImageWithFallback 
          src={event.image} 
          alt={event.title}
          className="detail-image"
        />
      </div>

      <div className="detail-content">
        <div className="detail-header">
          <h1 className="detail-title">{event.title}</h1>
          <div className="detail-category" style={{ backgroundColor: event.categoryColor }}>
            {event.category}
          </div>
        </div>

        <div className="detail-info-grid">
          <div className="info-item">
            <Calendar size={24} className="info-icon" />
            <div>
              <div className="info-label">Data</div>
              <div className="info-value">{event.date}</div>
            </div>
          </div>
          <div className="info-item">
            <Clock size={24} className="info-icon" />
            <div>
              <div className="info-label">Horário</div>
              <div className="info-value">{event.time}</div>
            </div>
          </div>
          <div className="info-item">
            <MapPin size={24} className="info-icon" />
            <div>
              <div className="info-label">Local</div>
              <div className="info-value">{event.location}</div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h2>Descrição</h2>
          <p className="detail-description">{event.description}</p>
        </div>

        <div className="detail-section">
          <h2>Avaliações</h2>
          <div className="rating-container">
            <div className="stars-display">
              {renderStars(event.rating)}
            </div>
            <span className="rating-text">{event.rating.toFixed(1)} ({event.reviewCount} avaliações)</span>
          </div>
          <button className="secondary-btn" onClick={onRate}>
            Avaliar Evento
          </button>
        </div>

        <div className="detail-actions">
          <button className="primary-btn">
            <Navigation size={20} />
            Como Chegar
          </button>
          <button className="primary-btn">
            <Share2 size={20} />
            Compartilhar
          </button>
        </div>
      </div>
    </div>
  );
};
