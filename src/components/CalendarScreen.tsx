import React, { useState, useMemo, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Loader2 } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { format, isSameDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  categoryColor: string;
  liked: boolean;
}

interface CalendarScreenProps {
  events: Event[];
  onEventClick: (eventId: number) => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ events, onEventClick }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [eventType, setEventType] = useState<string>('todos');
  const [secretaria, setSecretaria] = useState<string>('todas');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [customDateOpen, setCustomDateOpen] = useState(false);
  const [dbEvents, setDbEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingDatabase, setUsingDatabase] = useState(false);

  // Carregar eventos do banco de dados
  useEffect(() => {
    loadEventsFromDatabase();
  }, []);

  // Recarregar eventos quando os eventos do props mudarem
  useEffect(() => {
    if (events.length > 0 && !usingDatabase) {
      console.log('Eventos atualizados via props:', events.length);
    }
  }, [events]);

  const loadEventsFromDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .order('data_inicio', { ascending: true });

      if (error) {
        console.log('Usando eventos locais (banco não disponível)');
        setUsingDatabase(false);
      } else if (data && data.length > 0) {
        console.log('✅ Eventos carregados do banco:', data.length);
        setDbEvents(data);
        setUsingDatabase(true);
        toast.success(`Calendário conectado! ${data.length} eventos encontrados`);
      } else {
        console.log('Nenhum evento no banco, usando locais');
        setUsingDatabase(false);
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      setUsingDatabase(false);
    } finally {
      setLoading(false);
    }
  };

  // Converter string de data ou timestamp para Date object
  const parseEventDate = (dateStr: string | Date): Date => {
    // Se já é um Date, retornar
    if (dateStr instanceof Date) {
      return dateStr;
    }

    // Tentar formato ISO/timestamp primeiro (do banco de dados)
    try {
      const isoDate = parseISO(dateStr);
      if (!isNaN(isoDate.getTime())) {
        return isoDate;
      }
    } catch (e) {
      // Continuar para outros formatos
    }

    // Formato: "15 de Outubro, 2025" ou "15 de outubro, 2025"
    const months: { [key: string]: number } = {
      'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3,
      'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7,
      'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11,
      // Também aceitar maiúsculas
      'Janeiro': 0, 'Fevereiro': 1, 'Março': 2, 'Abril': 3,
      'Maio': 4, 'Junho': 5, 'Julho': 6, 'Agosto': 7,
      'Setembro': 8, 'Outubro': 9, 'Novembro': 10, 'Dezembro': 11
    };
    
    const parts = dateStr.split(' ');
    if (parts.length >= 4) {
      const day = parseInt(parts[0]);
      const monthName = parts[2].replace(',', '');
      const month = months[monthName];
      const year = parseInt(parts[3].replace(',', ''));
      
      if (!isNaN(day) && month !== undefined && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }

    // Formato: "DD/MM/YYYY" ou "DD-MM-YYYY"
    const dateRegex = /(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/;
    const match = dateStr.match(dateRegex);
    if (match) {
      const day = parseInt(match[1]);
      const month = parseInt(match[2]) - 1; // Meses em JS são 0-indexed
      const year = parseInt(match[3]);
      return new Date(year, month, day);
    }

    // Formato: "YYYY-MM-DD" (padrão do input date)
    const isoRegex = /(\d{4})-(\d{1,2})-(\d{1,2})/;
    const isoMatch = dateStr.match(isoRegex);
    if (isoMatch) {
      const year = parseInt(isoMatch[1]);
      const month = parseInt(isoMatch[2]) - 1;
      const day = parseInt(isoMatch[3]);
      return new Date(year, month, day);
    }

    console.warn('Formato de data não reconhecido:', dateStr);
    return new Date();
  };

  // Combinar eventos locais e do banco
  const allEvents = useMemo(() => {
    if (usingDatabase && dbEvents.length > 0) {
      // Converter eventos do banco para o formato local
      return dbEvents.map(dbEvent => ({
        id: Math.floor(Math.random() * 100000),
        title: dbEvent.titulo,
        date: dbEvent.data_inicio,
        time: format(parseISO(dbEvent.data_inicio), 'HH:mm'),
        location: dbEvent.localizacao,
        image: dbEvent.imagem || 'https://images.unsplash.com/photo-1672841821756-fc04525771c2',
        category: dbEvent.categoria,
        categoryColor: dbEvent.cor_categoria || '#e48e2c',
        liked: false
      }));
    }
    return events;
  }, [events, dbEvents, usingDatabase]);

  // Filtrar eventos por tipo
  const filteredEvents = useMemo(() => {
    let filtered = allEvents;

    // Filtro por tipo
    if (eventType !== 'todos') {
      filtered = filtered.filter(event => {
        const category = event.category.toLowerCase();
        return category === eventType.toLowerCase();
      });
    }

    // Filtro por secretaria (baseado na categoria)
    if (secretaria !== 'todas') {
      if (secretaria === 'cultura') {
        filtered = filtered.filter(e => 
          ['música', 'teatro', 'festival'].includes(e.category.toLowerCase())
        );
      } else if (secretaria === 'turismo') {
        filtered = filtered.filter(e => 
          ['gastronomia'].includes(e.category.toLowerCase())
        );
      }
    }

    return filtered;
  }, [allEvents, eventType, secretaria]);

  // Dias com eventos
  const daysWithEvents = useMemo(() => {
    return filteredEvents.map(event => parseEventDate(event.date));
  }, [filteredEvents]);

  // Eventos do dia selecionado
  const selectedDayEvents = useMemo(() => {
    if (!selectedDay) return [];
    return filteredEvents.filter(event => 
      isSameDay(parseEventDate(event.date), selectedDay)
    );
  }, [selectedDay, filteredEvents]);

  // Aplicar filtros de período
  const applyPeriodFilter = (period: 'today' | 'week' | 'month') => {
    const today = new Date();
    
    switch (period) {
      case 'today':
        setDateRange({ from: today, to: today });
        setSelectedDate(today);
        break;
      case 'week':
        setDateRange({ 
          from: startOfWeek(today, { locale: ptBR }),
          to: endOfWeek(today, { locale: ptBR })
        });
        break;
      case 'month':
        setDateRange({ 
          from: startOfMonth(today),
          to: endOfMonth(today)
        });
        break;
    }
  };

  // Customizar dias com eventos no calendário
  const modifiers = {
    hasEvent: daysWithEvents,
  };

  const modifiersClassNames = {
    hasEvent: 'has-event-day',
  };

  if (loading) {
    return (
      <div className="main-screen">
        <div className="screen-header">
          <h1 className="screen-title">Calendário de Eventos</h1>
          <p className="screen-subtitle">Carregando eventos...</p>
        </div>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="main-screen">
      {/* Header */}
      <div className="screen-header">
        <h1 className="screen-title">Calendário de Eventos</h1>
        <p className="screen-subtitle">Visualize todos os eventos e atrações em um calendário interativo</p>
      </div>

      {/* Status do banco de dados */}
      {usingDatabase && (
        <Card className="mb-4 border-l-4 border-l-green-500">
          <CardContent className="pt-4 pb-4">
            <p className="text-sm text-muted-foreground">
              ✅ <strong>Conectado ao banco de dados</strong> - Mostrando {allEvents.length} eventos
            </p>
          </CardContent>
        </Card>
      )}

      {/* Info sobre projetos */}
      <Card className="mb-6 border-l-4 border-l-blue-500">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Dica:</strong> Os eventos culturais são exibidos neste calendário. Para visualizar projetos conjuntos e suas datas de execução, acesse a seção "Projetos" no menu lateral.
          </p>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Personalize sua visualização de eventos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro de Tipo de Evento */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Evento</label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="música">Música</SelectItem>
                  <SelectItem value="teatro">Teatro</SelectItem>
                  <SelectItem value="gastronomia">Gastronomia</SelectItem>
                  <SelectItem value="festival">Festival</SelectItem>
                  <SelectItem value="oficina">Oficina</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro de Secretaria */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Secretaria</label>
              <Select value={secretaria} onValueChange={setSecretaria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a secretaria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="cultura">Cultura</SelectItem>
                  <SelectItem value="turismo">Turismo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botões de Período */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Período Rápido</label>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => applyPeriodFilter('today')}
                  className="flex-1"
                >
                  Hoje
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => applyPeriodFilter('week')}
                  className="flex-1"
                >
                  Semana
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => applyPeriodFilter('month')}
                  className="flex-1"
                >
                  Mês
                </Button>
              </div>
            </div>

            {/* Seletor de Data Personalizado */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Personalizada</label>
              <Popover open={customDateOpen} onOpenChange={setCustomDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yy")} - {format(dateRange.to, "dd/MM/yy")}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span>Escolher intervalo</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => {
                      if (range) {
                        setDateRange(range as { from: Date | undefined; to: Date | undefined });
                      }
                    }}
                    numberOfMonths={2}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendário Principal */}
      <Card>
        <CardHeader>
          <CardTitle>Calendário Mensal</CardTitle>
          <CardDescription>
            Clique em um dia com eventos (marcado com •) para ver os detalhes. {filteredEvents.length} eventos encontrados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="calendar-wrapper">
            <style>{`
              .has-event-day {
                position: relative;
                font-weight: 700;
                color: hsl(var(--primary)) !important;
              }
              
              .has-event-day::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: linear-gradient(135deg, rgba(194, 33, 105, 0.15), rgba(194, 33, 105, 0.25));
                border: 2px solid rgba(194, 33, 105, 0.4);
                z-index: -1;
              }
              
              .has-event-day::after {
                content: '•';
                position: absolute;
                bottom: 4px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 18px;
                line-height: 1;
                color: hsl(var(--primary));
                font-weight: 900;
              }
              
              .has-event-day:hover::before {
                background: linear-gradient(135deg, rgba(194, 33, 105, 0.25), rgba(194, 33, 105, 0.35));
                border-color: rgba(194, 33, 105, 0.6);
              }
              
              /* Adicionar cursor pointer para dias com eventos */
              .has-event-day {
                cursor: pointer !important;
              }
              
              /* Melhorar visualização do dia selecionado */
              [data-selected="true"] {
                background-color: hsl(var(--primary)) !important;
                color: white !important;
              }
              
              [data-selected="true"].has-event-day::before {
                border-color: white;
              }
            `}</style>
            
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              onDayClick={(day) => {
                const hasEvents = daysWithEvents.some(eventDate => 
                  isSameDay(eventDate, day)
                );
                if (hasEvents) {
                  setSelectedDay(day);
                }
              }}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              className="rounded-md border mx-auto"
              locale={ptBR}
            />
          </div>

          {/* Legenda */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-3">Legenda do Calendário:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-full flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, rgba(194, 33, 105, 0.15), rgba(194, 33, 105, 0.25))',
                  border: '2px solid rgba(194, 33, 105, 0.4)'
                }}>
                  <span className="text-primary font-bold">15</span>
                  <span className="absolute bottom-0 text-primary text-lg font-black">•</span>
                </div>
                <span><strong>Dias com eventos</strong> - Clique para ver detalhes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  20
                </div>
                <span><strong>Dia selecionado</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-bold">
                  {new Date().getDate()}
                </div>
                <span><strong>Hoje</strong></span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sheet lateral com eventos do dia */}
      <Sheet open={selectedDay !== null} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              Eventos de {selectedDay && format(selectedDay, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </SheetTitle>
            <SheetDescription>
              {selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {selectedDayEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="mx-auto h-12 w-12 mb-2 opacity-50" />
                <p>Nenhum evento neste dia</p>
              </div>
            ) : (
              selectedDayEvents.map((event) => (
                <Card 
                  key={event.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    onEventClick(event.id);
                    setSelectedDay(null);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-2 line-clamp-2">{event.title}</h3>
                        
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                        </div>

                        <Badge 
                          className="mt-2"
                          style={{ backgroundColor: event.categoryColor }}
                        >
                          {event.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
