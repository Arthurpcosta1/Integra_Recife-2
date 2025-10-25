import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Tour {
  id: number;
  title: string;
  description: string;
  duration: string;
  image: string;
  pointsOfInterest: number;
}

interface ToursScreenProps {
  tours: Tour[];
  onTourClick: (tourId: number) => void;
}

export const ToursScreen: React.FC<ToursScreenProps> = ({ tours, onTourClick }) => {
  return (
    <div className="tours-screen">
      <div className="screen-header">
        <h1 className="screen-title">Roteiros Temáticos</h1>
        <p className="screen-subtitle">Explore a cidade de forma guiada com nossos roteiros especiais</p>
      </div>

      <div className="tours-grid">
        {tours.map((tour) => (
          <div 
            key={tour.id} 
            className="tour-card"
            onClick={() => onTourClick(tour.id)}
          >
            <div className="tour-image-wrapper">
              <ImageWithFallback 
                src={tour.image} 
                alt={tour.title}
                className="tour-image"
              />
              <div className="tour-badge">
                <MapPin size={14} />
                {tour.pointsOfInterest} pontos
              </div>
            </div>
            <div className="tour-card-content">
              <h3 className="tour-title">{tour.title}</h3>
              <p className="tour-description">{tour.description}</p>
              <div className="tour-duration">
                <Clock size={16} />
                <span>Duração estimada: {tour.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
