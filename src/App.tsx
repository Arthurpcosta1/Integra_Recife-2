import React, { useState } from 'react';
import { MainScreen } from './components/MainScreen';
import { EventDetailScreen } from './components/EventDetailScreen';
import { ToursScreen } from './components/ToursScreen';
import { TourDetailScreen } from './components/TourDetailScreen';
import { RatingScreen } from './components/RatingScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { LoginScreen } from './components/LoginScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { ChatForum } from './components/ChatForum';
import { ReportsScreen } from './components/ReportsScreen';
import { ProjectsModule } from './components/ProjectsModule';
import { NotificationSystem } from './components/NotificationSystem';
import { CalendarScreen } from './components/CalendarScreen';
import { ManagerialReports } from './components/ManagerialReports';
import { Toaster } from './components/ui/sonner';
import { Calendar, MapPin, Heart, User, Menu, X, LogOut, Settings, MessageSquare, BarChart3, Folder, Database, FileText } from 'lucide-react';
import { DatabaseSetup } from './components/DatabaseSetup';

type Screen = 'main' | 'eventDetail' | 'tours' | 'tourDetail' | 'profile' | 'admin' | 'chat' | 'reports' | 'projects' | 'database' | 'calendar' | 'managerialReports';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; type: 'admin' | 'cidadao'; accessToken?: string } | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedTourId, setSelectedTourId] = useState<number | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingEventName, setRatingEventName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [nextEventId, setNextEventId] = useState(5);

  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Festival Rec-Beat 2025",
      date: "15 de Outubro, 2025",
      time: "18:00",
      location: "Cais da Alfândega",
      image: "https://images.unsplash.com/photo-1672841821756-fc04525771c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbXVzaWMlMjBmZXN0aXZhbHxlbnwxfHx8fDE3NjAwMjAyODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Música",
      categoryColor: "#e48e2c",
      liked: false,
      description: "O maior festival de música independente do Nordeste retorna ao Recife! Três dias de shows com artistas nacionais e internacionais, food trucks e muito mais. Uma celebração da cultura musical brasileira no coração do Recife Antigo.",
      rating: 4.5,
      reviewCount: 328
    },
    {
      id: 2,
      title: "Teatro de Santa Isabel - Ariano Suassuna",
      date: "20 de Outubro, 2025",
      time: "20:30",
      location: "Teatro de Santa Isabel",
      image: "https://images.unsplash.com/photo-1539964604210-db87088e0c2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwc3RhZ2UlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NjAwMDM1MTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Teatro",
      categoryColor: "#b31a4d",
      liked: true,
      description: "Espetáculo emocionante baseado na obra do mestre Ariano Suassuna. Uma homenagem ao maior dramaturgo nordestino, apresentando elementos do teatro de cordel e da cultura popular brasileira.",
      rating: 5,
      reviewCount: 156
    },
    {
      id: 3,
      title: "Festival Gastronômico do Recife",
      date: "25 de Outubro, 2025",
      time: "17:00",
      location: "Parque Dona Lindu",
      image: "https://images.unsplash.com/photo-1742646802610-9d4c9628b793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZ2FzdHJvbm9teSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYwMDUzOTc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Gastronomia",
      categoryColor: "#4a920f",
      liked: false,
      description: "Descubra os sabores do Recife! Festival com mais de 50 restaurantes participantes, workshops de culinária, degustações e apresentações de chefs renomados. Uma verdadeira festa para os amantes da boa comida.",
      rating: 4.8,
      reviewCount: 445
    },
    {
      id: 4,
      title: "Carnaval de Olinda 2026",
      date: "14 de Fevereiro, 2026",
      time: "08:00",
      location: "Ladeiras de Olinda",
      image: "https://images.unsplash.com/photo-1681830059111-0600ef0c4958?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNpZmUlMjBicmF6aWwlMjBiZWFjaHxlbnwxfHx8fDE3NjAwNTM5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Festival",
      categoryColor: "#582bac",
      liked: true,
      description: "O melhor carnaval de rua do Brasil! Blocos tradicionais, frevo no pé e muita alegria pelas ladeiras históricas de Olinda. Uma experiência cultural única e inesquecível.",
      rating: 5,
      reviewCount: 1203
    }
  ]);

  const [tours, setTours] = useState([
    {
      id: 1,
      title: "Roteiro das Pontes do Recife",
      description: "Conheça as famosas pontes que conectam o Recife e fazem da cidade a 'Veneza Brasileira'",
      duration: "2-3 horas",
      image: "https://images.unsplash.com/photo-1713108535704-d5616dace24b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlkZ2UlMjBhcmNoaXRlY3R1cmUlMjBjaXR5fGVufDF8fHx8MTc2MDA1Mzk3OHww&ixlib=rb-4.1.0&q=80&w=1080",
      pointsOfInterest: 5,
      fullDescription: "Um passeio pelas principais pontes da cidade do Recife, descobrindo a história e arquitetura que tornam essas estruturas tão especiais.",
      points: [
        {
          id: 1,
          name: "Ponte Maurício de Nassau",
          description: "A ponte mais antiga do Recife, construída em 1643 pelo conde holandês.",
          image: "https://images.unsplash.com/photo-1713108535704-d5616dace24b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlkZ2UlMjBhcmNoaXRlY3R1cmUlMjBjaXR5fGVufDF8fHx8MTc2MDA1Mzk3OHww&ixlib=rb-4.1.0&q=80&w=1080",
          order: 1
        },
        {
          id: 2,
          name: "Ponte Buarque de Macedo",
          description: "Ponte histórica que liga o bairro de Santo Antônio ao Recife.",
          image: "https://images.unsplash.com/photo-1713108535704-d5616dace24b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlkZ2UlMjBhcmNoaXRlY3R1cmUlMjBjaXR5fGVufDF8fHx8MTc2MDA1Mzk3OHww&ixlib=rb-4.1.0&q=80&w=1080",
          order: 2
        },
        {
          id: 3,
          name: "Ponte da Boa Vista",
          description: "Uma das pontes mais movimentadas, oferece vista panorâmica do Rio Capibaribe.",
          image: "https://images.unsplash.com/photo-1713108535704-d5616dace24b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlkZ2UlMjBhcmNoaXRlY3R1cmUlMjBjaXR5fGVufDF8fHx8MTc2MDA1Mzk3OHww&ixlib=rb-4.1.0&q=80&w=1080",
          order: 3
        },
        {
          id: 4,
          name: "Ponte Limoeiro",
          description: "Conecta os bairros de São José e Santo Amaro.",
          image: "https://images.unsplash.com/photo-1713108535704-d5616dace24b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlkZ2UlMjBhcmNoaXRlY3R1cmUlMjBjaXR5fGVufDF8fHx8MTc2MDA1Mzk3OHww&ixlib=rb-4.1.0&q=80&w=1080",
          order: 4
        },
        {
          id: 5,
          name: "Ponte Giratória",
          description: "Ponte móvel única no Brasil, permite a passagem de embarcações.",
          image: "https://images.unsplash.com/photo-1713108535704-d5616dace24b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlkZ2UlMjBhcmNoaXRlY3R1cmUlMjBjaXR5fGVufDF8fHx8MTc2MDA1Mzk3OHww&ixlib=rb-4.1.0&q=80&w=1080",
          order: 5
        }
      ]
    },
    {
      id: 2,
      title: "Roteiro do Recife Antigo",
      description: "Viaje no tempo e conheça a história do bairro mais antigo da cidade",
      duration: "3-4 horas",
      image: "https://images.unsplash.com/photo-1661721097539-44f58bb849d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3JpY2FsJTIwYnVpbGRpbmclMjBjaHVyY2h8ZW58MXx8fHwxNzYwMDUzOTc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      pointsOfInterest: 7,
      fullDescription: "Explore o coração histórico do Recife, visitando igrejas centenárias, praças e construções que contam a história da cidade.",
      points: [
        {
          id: 1,
          name: "Marco Zero",
          description: "Praça principal do Recife Antigo, ponto de partida ideal para explorar a região.",
          image: "https://images.unsplash.com/photo-1661721097539-44f58bb849d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3JpY2FsJTIwYnVpbGRpbmclMjBjaHVyY2h8ZW58MXx8fHwxNzYwMDUzOTc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
          order: 1
        },
        {
          id: 2,
          name: "Torre Malakoff",
          description: "Antigo observatório astronômico, hoje centro cultural.",
          image: "https://images.unsplash.com/photo-1661721097539-44f58bb849d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3JpY2FsJTIwYnVpbGRpbmclMjBjaHVyY2h8ZW58MXx8fHwxNzYwMDUzOTc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
          order: 2
        },
        {
          id: 3,
          name: "Sinagoga Kahal Zur Israel",
          description: "Primeira sinagoga das Américas, construída em 1636.",
          image: "https://images.unsplash.com/photo-1661721097539-44f58bb849d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3JpY2FsJTIwYnVpbGRpbmclMjBjaHVyY2h8ZW58MXx8fHwxNzYwMDUzOTc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
          order: 3
        },
        {
          id: 4,
          name: "Rua do Bom Jesus",
          description: "Rua charmosa com casarões coloridos e vida noturna agitada.",
          image: "https://images.unsplash.com/photo-1661721097539-44f58bb849d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3JpY2FsJTIwYnVpbGRpbmclMjBjaHVyY2h8ZW58MXx8fHwxNzYwMDUzOTc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
          order: 4
        },
        {
          id: 5,
          name: "Paço do Frevo",
          description: "Museu dedicado ao frevo, patrimônio imaterial da humanidade.",
          image: "https://images.unsplash.com/photo-1661721097539-44f58bb849d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3JpY2FsJTIwYnVpbGRpbmclMjBjaHVyY2h8ZW58MXx8fHwxNzYwMDUzOTc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
          order: 5
        },
        {
          id: 6,
          name: "Embaixada dos Bonecos Gigantes",
          description: "Centro de preservação dos famosos bonecos gigantes de Olinda.",
          image: "https://images.unsplash.com/photo-1661721097539-44f58bb849d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3JpY2FsJTIwYnVpbGRpbmclMjBjaHVyY2h8ZW58MXx8fHwxNzYwMDUzOTc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
          order: 6
        },
        {
          id: 7,
          name: "Cais da Alfândega",
          description: "Antigo porto, hoje área de lazer com bares e restaurantes.",
          image: "https://images.unsplash.com/photo-1661721097539-44f58bb849d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3JpY2FsJTIwYnVpbGRpbmclMjBjaHVyY2h8ZW58MXx8fHwxNzYwMDUzOTc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
          order: 7
        }
      ]
    }
  ]);

  const handleLogin = (userData: { email: string; name: string; type: 'admin' | 'cidadao'; accessToken?: string }) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    if (userData.type === 'admin') {
      setCurrentScreen('admin');
    } else {
      setCurrentScreen('main');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentScreen('main');
  };

  const handleAddEvent = (newEvent: Omit<typeof events[0], 'id' | 'rating' | 'reviewCount' | 'liked'>) => {
    const event = {
      ...newEvent,
      id: nextEventId,
      rating: 0,
      reviewCount: 0,
      liked: false
    };
    setEvents([...events, event]);
    setNextEventId(nextEventId + 1);
  };

  const handleDeleteEvent = (eventId: number) => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      setEvents(events.filter(e => e.id !== eventId));
    }
  };

  const user = {
    name: currentUser?.name || "Arthur Costa",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
  };

  const [pastEventsState, setPastEvents] = useState([
    {
      id: 101,
      title: "Carnaval de Olinda 2025",
      date: "10 de Fevereiro, 2025",
      image: "https://images.unsplash.com/photo-1681830059111-0600ef0c4958?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNpZmUlMjBicmF6aWwlMjBiZWFjaHxlbnwxfHx8fDE3NjAwNTM5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      hasRated: false
    },
    {
      id: 102,
      title: "Festival Rec-Beat 2024",
      date: "15 de Setembro, 2024",
      image: "https://images.unsplash.com/photo-1672841821756-fc04525771c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbXVzaWMlMjBmZXN0aXZhbHxlbnwxfHx8fDE3NjAwMjAyODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      hasRated: true
    }
  ]);

  const favoriteEvents = events.filter(e => e.liked);
  const pastEvents = pastEventsState;

  const handleToggleLike = (eventId: number) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, liked: !event.liked } : event
    ));
  };

  const handleEventClick = (eventId: number) => {
    setSelectedEventId(eventId);
    setCurrentScreen('eventDetail');
  };

  const handleTourClick = (tourId: number) => {
    setSelectedTourId(tourId);
    setCurrentScreen('tourDetail');
  };

  const handleBack = () => {
    if (currentScreen === 'eventDetail') {
      setCurrentScreen('main');
    } else if (currentScreen === 'tourDetail') {
      setCurrentScreen('tours');
    }
  };

  const handleOpenRating = (eventName?: string) => {
    setRatingEventName(eventName || 'este evento');
    setShowRatingModal(true);
  };

  const handleSubmitRating = async (rating: number, comment: string) => {
    if (!currentUser) return;

    try {
      const ratingData = {
        usuario_id: currentUser.email,
        usuario_nome: currentUser.name,
        evento_nome: ratingEventName,
        nota: rating,
        comentario: comment,
        data_avaliacao: new Date().toISOString()
      };

      // Salvar no KV Store do Supabase
      const response = await fetch('https://lymkwugkfeamqkiybntd.supabase.co/functions/v1/kv_store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          key: `avaliacao_${Date.now()}_${currentUser.email}`,
          value: ratingData
        })
      });

      if (response.ok) {
        // Atualizar evento com a nova avaliação
        const eventToUpdate = pastEvents.find(e => e.title === ratingEventName);
        if (eventToUpdate) {
          setPastEvents(pastEvents.map(e => 
            e.id === eventToUpdate.id ? { ...e, hasRated: true } : e
          ));
        }

        // Também atualizar nos eventos principais se existir
        const mainEvent = events.find(e => e.title === ratingEventName);
        if (mainEvent) {
          setEvents(events.map(e => 
            e.id === mainEvent.id 
              ? { 
                  ...e, 
                  rating: ((e.rating * e.reviewCount) + rating) / (e.reviewCount + 1),
                  reviewCount: e.reviewCount + 1
                } 
              : e
          ));
        }

        console.log('✅ Avaliação salva no banco de dados:', ratingData);
        alert('Avaliação enviada com sucesso! ⭐');
      } else {
        throw new Error('Erro ao salvar avaliação');
      }
    } catch (error) {
      console.error('❌ Erro ao salvar avaliação:', error);
      alert('Erro ao enviar avaliação. Tente novamente.');
    }
  };

  const selectedEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : null;
  const selectedTour = selectedTourId ? tours.find(t => t.id === selectedTourId) : null;

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      {/* Toaster para notificações */}
      <Toaster position="top-right" richColors />
      
      {/* Sistema de Notificações */}
      <NotificationSystem currentUser={currentUser ? { id: currentUser.email, name: currentUser.name } : null} />
      
      {/* Mobile Header */}
      <div className="mobile-header">
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1>Integra Recife</h1>
        <div className="header-spacer"></div>
      </div>

      {/* Navigation Bar */}
      <nav className={`app-nav ${menuOpen ? 'open' : ''}`}>
        <div className="nav-header">
          <h2>Integra Recife</h2>
          <button className="close-menu" onClick={() => setMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* User Info */}
        <div className="nav-user-info">
          <div className="nav-avatar">
            <User size={24} />
          </div>
          <div className="nav-user-details">
            <p className="nav-user-name">{currentUser?.name}</p>
            <span className="nav-user-type">
              {currentUser?.type === 'admin' ? 'Administrador' : 'Cidadão'}
            </span>
          </div>
        </div>

        <ul className="nav-list">
          {currentUser?.type === 'admin' ? (
            <li 
              className={currentScreen === 'admin' ? 'active' : ''}
              onClick={() => {
                setCurrentScreen('admin');
                setMenuOpen(false);
              }}
            >
              <Settings size={20} />
              <span>Painel Admin</span>
            </li>
          ) : null}
          <li 
            className={currentScreen === 'main' ? 'active' : ''}
            onClick={() => {
              setCurrentScreen('main');
              setMenuOpen(false);
            }}
          >
            <Calendar size={20} />
            <span>Eventos</span>
          </li>
          <li 
            className={currentScreen === 'tours' ? 'active' : ''}
            onClick={() => {
              setCurrentScreen('tours');
              setMenuOpen(false);
            }}
          >
            <MapPin size={20} />
            <span>Roteiros</span>
          </li>
          <li 
            className={currentScreen === 'calendar' ? 'active' : ''}
            onClick={() => {
              setCurrentScreen('calendar');
              setMenuOpen(false);
            }}
          >
            <Calendar size={20} />
            <span>Calendário</span>
          </li>
          <li 
            className={currentScreen === 'chat' ? 'active' : ''}
            onClick={() => {
              setCurrentScreen('chat');
              setMenuOpen(false);
            }}
          >
            <MessageSquare size={20} />
            <span>Chat/Fórum</span>
          </li>
          {currentUser?.type === 'admin' && (
            <>
              <li 
                className={currentScreen === 'reports' ? 'active' : ''}
                onClick={() => {
                  setCurrentScreen('reports');
                  setMenuOpen(false);
                }}
              >
                <BarChart3 size={20} />
                <span>Relatórios</span>
              </li>
              <li 
                className={currentScreen === 'projects' ? 'active' : ''}
                onClick={() => {
                  setCurrentScreen('projects');
                  setMenuOpen(false);
                }}
              >
                <Folder size={20} />
                <span>Projetos</span>
              </li>
              <li 
                className={currentScreen === 'database' ? 'active' : ''}
                onClick={() => {
                  setCurrentScreen('database');
                  setMenuOpen(false);
                }}
              >
                <Database size={20} />
                <span>Config. Banco</span>
              </li>
              <li 
                className={currentScreen === 'managerialReports' ? 'active' : ''}
                onClick={() => {
                  setCurrentScreen('managerialReports');
                  setMenuOpen(false);
                }}
              >
                <FileText size={20} />
                <span>Relatórios Gerenciais</span>
              </li>
            </>
          )}
          {currentUser?.type === 'cidadao' && (
            <li 
              className={currentScreen === 'profile' ? 'active' : ''}
              onClick={() => {
                setCurrentScreen('profile');
                setMenuOpen(false);
              }}
            >
              <User size={20} />
              <span>Perfil</span>
            </li>
          )}
        </ul>

        <div className="nav-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="app-main">
        {currentScreen === 'admin' && currentUser?.type === 'admin' && (
          <AdminDashboard 
            events={events}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
            accessToken={currentUser?.accessToken}
          />
        )}

        {currentScreen === 'main' && (
          <MainScreen 
            events={events}
            onEventClick={handleEventClick}
            onToggleLike={handleToggleLike}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {currentScreen === 'eventDetail' && selectedEvent && (
          <EventDetailScreen 
            event={selectedEvent}
            onBack={handleBack}
            onRate={() => handleOpenRating(selectedEvent.title)}
          />
        )}

        {currentScreen === 'tours' && (
          <ToursScreen 
            tours={tours}
            onTourClick={handleTourClick}
          />
        )}

        {currentScreen === 'tourDetail' && selectedTour && (
          <TourDetailScreen 
            tour={{
              id: selectedTour.id,
              title: selectedTour.title,
              duration: selectedTour.duration,
              description: selectedTour.fullDescription,
              points: selectedTour.points
            }}
            onBack={handleBack}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen 
            user={user}
            favoriteEvents={favoriteEvents}
            pastEvents={pastEvents}
            onEventClick={handleEventClick}
            onRateEvent={(eventId) => {
              const event = pastEvents.find(e => e.id === eventId);
              handleOpenRating(event?.title);
            }}
          />
        )}

        {currentScreen === 'chat' && currentUser && (
          <ChatForum 
            currentUser={{
              id: currentUser.email,
              name: currentUser.name,
              avatar: user.avatar
            }}
          />
        )}

        {currentScreen === 'reports' && currentUser?.type === 'admin' && (
          <ReportsScreen events={events} />
        )}

        {currentScreen === 'projects' && currentUser && (
          <ProjectsModule 
            currentUser={{
              id: currentUser.email,
              name: currentUser.name,
              type: currentUser.type
            }}
          />
        )}

        {currentScreen === 'database' && currentUser?.type === 'admin' && (
          <DatabaseSetup />
        )}

        {currentScreen === 'calendar' && (
          <CalendarScreen 
            events={events}
            onEventClick={handleEventClick}
          />
        )}

        {currentScreen === 'managerialReports' && currentUser?.type === 'admin' && (
          <ManagerialReports events={events} />
        )}
      </main>

      {/* Rating Modal */}
      {showRatingModal && (
        <RatingScreen 
          eventName={ratingEventName}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleSubmitRating}
        />
      )}
    </div>
  );
}