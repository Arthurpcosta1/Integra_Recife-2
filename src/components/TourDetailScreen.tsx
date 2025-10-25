import React from 'react';
import { ArrowLeft, MapPin, Clock, Navigation } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PointOfInterest {
  id: number;
  name: string;
  description: string;
  image: string;
  order: number;
}

interface TourDetailScreenProps {
  tour: {
    id: number;
    title: string;
    duration: string;
    description: string;
    points: PointOfInterest[];
  };
  onBack: () => void;
}

export const TourDetailScreen: React.FC<TourDetailScreenProps> = ({ tour, onBack }) => {
  return (
    <div className="detail-screen">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={20} />
        Voltar
      </button>

      <div className="detail-header">
        <h1 className="detail-title">{tour.title}</h1>
        <div className="tour-meta">
          <span>
            <Clock size={18} />
            {tour.duration}
          </span>
          <span>
            <MapPin size={18} />
            {tour.points.length} pontos de interesse
          </span>
        </div>
      </div>

      <p className="detail-description">{tour.description}</p>

      {/* Mapa Interativo Placeholder */}
      <div className="map-container">
        <div className="map-placeholder">
          <MapPin size={48} />
          <p>Mapa Interativo do Roteiro</p>
          <p className="map-subtext">Visualização dos {tour.points.length} pontos de interesse</p>
        </div>
      </div>

      {/* Pontos de Interesse */}
      <div className="points-section">
        <h2>Pontos de Interesse</h2>
        <div className="points-list">
          {tour.points.map((point) => (
            <div key={point.id} className="point-item">
              <div className="point-number">{point.order}</div>
              <div className="point-image-wrapper">
                <ImageWithFallback 
                  src={point.image} 
                  alt={point.name}
                  className="point-image"
                />
              </div>
              <div className="point-content">
                <h3 className="point-name">{point.name}</h3>
                <p className="point-description">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="detail-actions">
        <button className="primary-btn full-width">
          <Navigation size={20} />
          Iniciar Navegação
        </button>
      </div>
    </div>
  );
};
