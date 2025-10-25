import React, { useState } from 'react';
import { Download, FileText, BarChart3, Calendar, Users, TrendingUp, Filter, PieChart } from 'lucide-react';
import { SimpleChart } from './SimpleChart';

interface ReportsScreenProps {
  events: any[];
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({ events }) => {
  const [reportType, setReportType] = useState<'eventos' | 'usuarios' | 'avaliacoes' | 'geral'>('geral');
  const [dateRange, setDateRange] = useState<'7dias' | '30dias' | '90dias' | 'ano'>('30dias');

  // Dados mockados para relatórios
  const analyticsData = {
    totalEventos: events.length,
    totalUsuarios: 245,
    totalAvaliacoes: 1892,
    mediaAvaliacoes: 4.3,
    eventosProximos: 12,
    eventosMaisPopulares: [
      { nome: 'Carnaval de Olinda 2026', participantes: 1203, avaliacoes: 5.0 },
      { nome: 'Festival Gastronômico', participantes: 445, avaliacoes: 4.8 },
      { nome: 'Festival Rec-Beat 2025', participantes: 328, avaliacoes: 4.5 }
    ],
    categoriasMaisPopulares: [
      { categoria: 'Festival', eventos: 8, porcentagem: 35 },
      { categoria: 'Música', eventos: 6, porcentagem: 26 },
      { categoria: 'Gastronomia', eventos: 4, porcentagem: 17 },
      { categoria: 'Teatro', eventos: 3, porcentagem: 13 },
      { categoria: 'Arte', eventos: 2, porcentagem: 9 }
    ],
    crescimentoMensal: [
      { mes: 'Jun', eventos: 12, usuarios: 45 },
      { mes: 'Jul', eventos: 18, usuarios: 67 },
      { mes: 'Ago', eventos: 25, usuarios: 89 },
      { mes: 'Set', eventos: 31, usuarios: 134 },
      { mes: 'Out', eventos: 42, usuarios: 245 }
    ]
  };

  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    alert('Funcionalidade de exportação para PDF será implementada em breve!');
    // Aqui você integraria com uma biblioteca como jsPDF
  };

  return (
    <div className="reports-screen">
      <div className="reports-header">
        <div>
          <h1 className="screen-title">Sistema de Relatórios</h1>
          <p className="screen-subtitle">Análise completa de dados e métricas da plataforma</p>
        </div>
        <div className="reports-actions">
          <button 
            className="secondary-btn"
            onClick={() => exportToCSV(analyticsData.eventosProximos as any, 'relatorio-eventos')}
          >
            <Download size={20} />
            Exportar CSV
          </button>
          <button className="primary-btn" onClick={exportToPDF}>
            <FileText size={20} />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="reports-filters">
        <div className="filter-group">
          <label>Tipo de Relatório:</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value as any)}>
            <option value="geral">Visão Geral</option>
            <option value="eventos">Eventos</option>
            <option value="usuarios">Usuários</option>
            <option value="avaliacoes">Avaliações</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Período:</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value as any)}>
            <option value="7dias">Últimos 7 dias</option>
            <option value="30dias">Últimos 30 dias</option>
            <option value="90dias">Últimos 90 dias</option>
            <option value="ano">Último ano</option>
          </select>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card-large">
          <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Calendar size={28} />
          </div>
          <div className="stat-details">
            <h3>Total de Eventos</h3>
            <p className="stat-value">{analyticsData.totalEventos}</p>
            <span className="stat-change positive">
              <TrendingUp size={14} /> +15% este mês
            </span>
          </div>
        </div>

        <div className="stat-card-large">
          <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <Users size={28} />
          </div>
          <div className="stat-details">
            <h3>Total de Usuários</h3>
            <p className="stat-value">{analyticsData.totalUsuarios}</p>
            <span className="stat-change positive">
              <TrendingUp size={14} /> +28% este mês
            </span>
          </div>
        </div>

        <div className="stat-card-large">
          <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <BarChart3 size={28} />
          </div>
          <div className="stat-details">
            <h3>Total de Avaliações</h3>
            <p className="stat-value">{analyticsData.totalAvaliacoes}</p>
            <span className="stat-change positive">
              <TrendingUp size={14} /> +12% este mês
            </span>
          </div>
        </div>

        <div className="stat-card-large">
          <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            <TrendingUp size={28} />
          </div>
          <div className="stat-details">
            <h3>Média de Avaliações</h3>
            <p className="stat-value">{analyticsData.mediaAvaliacoes.toFixed(1)} ⭐</p>
            <span className="stat-change positive">
              Excelente desempenho
            </span>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h2>Crescimento Mensal</h2>
            <button className="icon-btn">
              <Filter size={18} />
            </button>
          </div>
          <div className="chart-container">
            <SimpleChart 
              data={analyticsData.crescimentoMensal}
              xKey="mes"
              yKey="eventos"
              color="var(--accent-color)"
            />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h2>Eventos Mais Populares</h2>
            <button className="icon-btn">
              <Filter size={18} />
            </button>
          </div>
          <div className="popular-events-list">
            {analyticsData.eventosMaisPopulares.map((event, index) => (
              <div key={index} className="popular-event-item">
                <div className="event-rank">#{index + 1}</div>
                <div className="event-info-report">
                  <h4>{event.nome}</h4>
                  <div className="event-stats-row">
                    <span>{event.participantes} participantes</span>
                    <span>⭐ {event.avaliacoes.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categorias Mais Populares */}
      <div className="categories-report-card">
        <div className="chart-header">
          <h2>
            <PieChart size={24} />
            Distribuição por Categoria
          </h2>
        </div>
        <div className="categories-grid">
          {analyticsData.categoriasMaisPopulares.map((cat, index) => (
            <div key={index} className="category-report-item">
              <div className="category-bar-container">
                <div className="category-label">
                  <span className="category-name">{cat.categoria}</span>
                  <span className="category-count">{cat.eventos} eventos</span>
                </div>
                <div className="category-bar-wrapper">
                  <div 
                    className="category-bar-fill"
                    style={{ width: `${cat.porcentagem}%` }}
                  />
                </div>
                <span className="category-percentage">{cat.porcentagem}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabela de Dados Detalhados */}
      <div className="detailed-table-card">
        <div className="chart-header">
          <h2>Dados Detalhados de Eventos</h2>
          <button 
            className="secondary-btn"
            onClick={() => exportToCSV(
              events.map(e => ({
                titulo: e.title,
                categoria: e.category,
                data: e.date,
                local: e.location,
                avaliacoes: e.reviewCount,
                media: e.rating
              })),
              'eventos-detalhados'
            )}
          >
            <Download size={18} />
            Exportar Tabela
          </button>
        </div>
        <div className="table-responsive">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Categoria</th>
                <th>Data</th>
                <th>Local</th>
                <th>Avaliações</th>
                <th>Média</th>
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
                  <td>{event.reviewCount}</td>
                  <td>
                    <span className="rating-badge">⭐ {event.rating.toFixed(1)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
