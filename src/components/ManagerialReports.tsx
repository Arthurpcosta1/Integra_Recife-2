import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Calendar, 
  Users, 
  TrendingUp, 
  Star,
  Folder,
  BarChart3,
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig 
} from './ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts@2.15.2';

interface Event {
  id: number;
  title: string;
  date: string;
  category: string;
  categoryColor: string;
  rating: number;
  reviewCount: number;
  liked: boolean;
}

interface ManagerialReportsProps {
  events: Event[];
}

export const ManagerialReports: React.FC<ManagerialReportsProps> = ({ events }) => {
  // Calcular estatísticas
  const stats = useMemo(() => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    // Eventos do último mês (simplificado - contando todos para demo)
    const eventsLastMonth = events.length;
    
    // Média de avaliações
    const avgRating = events.reduce((acc, e) => acc + e.rating, 0) / events.length || 0;
    
    // Total de usuários (mockado)
    const totalUsers = 245;
    
    // Projetos ativos (mockado)
    const activeProjects = 8;
    
    return {
      eventsLastMonth,
      totalUsers,
      avgRating,
      activeProjects
    };
  }, [events]);

  // Dados para gráfico de eventos por categoria nos últimos 6 meses
  const categoryChartData = useMemo(() => {
    const months = ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'];
    const categories = ['Música', 'Teatro', 'Gastronomia', 'Festival'];
    
    // Dados simulados de eventos por categoria por mês
    return months.map((month, idx) => ({
      month,
      Música: Math.floor(Math.random() * 10) + 3,
      Teatro: Math.floor(Math.random() * 8) + 2,
      Gastronomia: Math.floor(Math.random() * 6) + 2,
      Festival: Math.floor(Math.random() * 5) + 1,
    }));
  }, []);

  // Configuração do gráfico
  const chartConfig: ChartConfig = {
    Música: {
      label: "Música",
      color: "#e48e2c",
    },
    Teatro: {
      label: "Teatro",
      color: "#b31a4d",
    },
    Gastronomia: {
      label: "Gastronomia",
      color: "#4a920f",
    },
    Festival: {
      label: "Festival",
      color: "#582bac",
    },
  };

  // Eventos mais populares (ordenados por favoritos e avaliações)
  const popularEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => {
        // Simular número de favoritos baseado em rating e reviewCount
        const scoreA = a.rating * a.reviewCount;
        const scoreB = b.rating * b.reviewCount;
        return scoreB - scoreA;
      })
      .slice(0, 10)
      .map((event, index) => ({
        ...event,
        position: index + 1,
        favorites: Math.floor(Math.random() * 500) + 100, // Simulado
      }));
  }, [events]);

  // Função de exportação
  const handleExportReport = () => {
    // Preparar dados para CSV
    const csvData = popularEvents.map(event => ({
      Posição: event.position,
      Evento: event.title,
      Data: event.date,
      Categoria: event.category,
      'Média Avaliação': event.rating.toFixed(1),
      'Num. Avaliações': event.reviewCount,
      Favoritos: event.favorites
    }));

    // Converter para CSV
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-gerencial-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="main-screen">
      {/* Header */}
      <div className="screen-header mb-6">
        <div>
          <h1 className="screen-title">Relatórios Gerenciais</h1>
          <p className="screen-subtitle">Análise completa de métricas e desempenho da plataforma</p>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total de Eventos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Eventos (último mês)</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.eventsLastMonth}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+15%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>

        {/* Total de Usuários */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Usuários Cadastrados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+28%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>

        {/* Média de Avaliações */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Média de Avaliações</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)} ⭐</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+0.3</span> vs mês anterior
            </p>
          </CardContent>
        </Card>

        {/* Projetos Ativos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+2</span> vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Barras */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Eventos por Categoria (Últimos 6 Meses)
          </CardTitle>
          <CardDescription>
            Distribuição de eventos cadastrados por categoria nos últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={categoryChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="Música" fill="var(--color-Música)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Teatro" fill="var(--color-Teatro)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Gastronomia" fill="var(--color-Gastronomia)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Festival" fill="var(--color-Festival)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Tabela de Eventos Mais Populares */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Eventos Mais Populares
            </CardTitle>
            <CardDescription>
              Ranking dos 10 eventos com melhor desempenho
            </CardDescription>
          </div>
          <Button onClick={handleExportReport} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Relatório
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Nome do Evento</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-center">Média</TableHead>
                <TableHead className="text-center">Avaliações</TableHead>
                <TableHead className="text-center">Favoritos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {popularEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">
                    {event.position}
                  </TableCell>
                  <TableCell className="font-medium max-w-[250px]">
                    {event.title}
                  </TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>
                    <Badge style={{ backgroundColor: event.categoryColor }}>
                      {event.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{event.rating.toFixed(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {event.reviewCount}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {event.favorites}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
