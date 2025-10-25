import React, { useState } from 'react';
import { Plus, Calendar, MapPin, Clock, Image as ImageIcon, Tag, FileText, Users, LayoutDashboard } from 'lucide-react';
import { UserManagement } from './UserManagement';

interface Event {
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
}

interface AdminDashboardProps {
  events: Event[];
  onAddEvent: (event: Omit<Event, 'id' | 'rating' | 'reviewCount'>) => void;
  onDeleteEvent: (eventId: number) => void;
  accessToken?: string;
}

type AdminTab = 'eventos' | 'usuarios';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ events, onAddEvent, onDeleteEvent, accessToken }) => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('eventos');
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    image: '',
    category: 'Música',
    description: ''
  });

  const categories = [
    { name: 'Música', color: '#e48e2c' },
    { name: 'Teatro', color: '#b31a4d' },
    { name: 'Gastronomia', color: '#4a920f' },
    { name: 'Festival', color: '#582bac' },
    { name: 'Esportes', color: '#2c5aa0' },
    { name: 'Arte', color: '#8e44ad' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.time || !formData.location || !formData.description) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const selectedCategory = categories.find(c => c.name === formData.category);
    
    onAddEvent({
      title: formData.title,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      image: formData.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      category: formData.category,
      categoryColor: selectedCategory?.color || '#e48e2c',
      description: formData.description,
      liked: false
    });

    // Reset form
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      image: '',
      category: 'Música',
      description: ''
    });
    
    setShowForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1 className="screen-title">Painel Administrativo</h1>
          <p className="screen-subtitle">Gerencie eventos, usuários e conteúdo da plataforma</p>
        </div>
        {activeTab === 'eventos' && (
          <button 
            className="primary-btn"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={20} />
            Novo Evento
          </button>
        )}
      </div>

      {/* Abas de Navegação */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'eventos' ? 'active' : ''}`}
          onClick={() => setActiveTab('eventos')}
        >
          <LayoutDashboard size={20} />
          Eventos
        </button>
        <button 
          className={`admin-tab ${activeTab === 'usuarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('usuarios')}
        >
          <Users size={20} />
          Usuários
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'usuarios' ? (
        accessToken ? (
          <UserManagement accessToken={accessToken} />
        ) : (
          <div className="empty-message">
            Faça login para gerenciar usuários.
          </div>
        )
      ) : (
        <div className="eventos-content">

      {/* Estatísticas */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(194, 33, 105, 0.1)' }}>
            <Calendar size={24} style={{ color: 'var(--accent-color)' }} />
          </div>
          <div className="stat-content">
            <h3>Total de Eventos</h3>
            <p>{events.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(228, 142, 44, 0.1)' }}>
            <Tag size={24} style={{ color: '#e48e2c' }} />
          </div>
          <div className="stat-content">
            <h3>Categorias</h3>
            <p>{categories.length}</p>
          </div>
        </div>
      </div>

      {/* Formulário de Criar Evento */}
      {showForm && (
        <div className="event-form-container">
          <div className="form-header">
            <h2>Criar Novo Evento</h2>
          </div>
          <form onSubmit={handleSubmit} className="event-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">
                  <FileText size={18} />
                  Título do Evento *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Ex: Festival de Música do Recife"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">
                  <Tag size={18} />
                  Categoria *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location">
                  <MapPin size={18} />
                  Local *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Ex: Teatro de Santa Isabel"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">
                  <Calendar size={18} />
                  Data *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">
                  <Clock size={18} />
                  Horário *
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="image">
                <ImageIcon size={18} />
                URL da Imagem (opcional)
              </label>
              <input
                type="url"
                id="image"
                name="image"
                placeholder="https://exemplo.com/imagem.jpg"
                value={formData.image}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">
                <FileText size={18} />
                Descrição *
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Descreva o evento em detalhes..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
              <button type="submit" className="primary-btn">
                Criar Evento
              </button>
            </div>
          </form>
        </div>
      )}

        {/* Lista de Eventos */}
        <div className="admin-events-list">
          <h2>Eventos Criados</h2>
          <div className="events-table">
            {events.length === 0 ? (
              <div className="empty-message">
                Nenhum evento cadastrado ainda. Clique em "Novo Evento" para começar!
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Categoria</th>
                    <th>Data</th>
                    <th>Local</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(event => (
                    <tr key={event.id}>
                      <td>{event.title}</td>
                      <td>
                        <span className="category-badge" style={{ backgroundColor: event.categoryColor }}>
                          {event.category}
                        </span>
                      </td>
                      <td>{event.date}</td>
                      <td>{event.location}</td>
                      <td>
                        <button 
                          className="delete-btn"
                          onClick={() => onDeleteEvent(event.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
