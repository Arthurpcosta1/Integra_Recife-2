import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { format, isSameDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

  // Converter string de data para Date object
  const parseEventDate = (dateStr: string): Date => {
    // Formato esperado: "15 de Outubro, 2025"
    const months: { [key: string]: number } = {
      'Janeiro': 0, 'Fevereiro': 1, 'Março': 2, 'Abril': 3,
      'Maio': 4, 'Junho': 5, 'Julho': 6, 'Agosto': 7,
      'Setembro': 8, 'Outubro': 9, 'Novembro': 10, 'Dezembro': 11
    };
    
    const parts = dateStr.split(' ');
    if (parts.length >= 4) {
      const day = parseInt(parts[0]);
      const month = months[parts[2]];
      const year = parseInt(parts[3]);
      return new Date(year, month, day);
    }
    return new Date();
  };

  // Filtrar eventos por tipo
  const filteredEvents = useMemo(() => {
    let filtered = events;

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
  }, [events, eventType, secretaria]);

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

  const modifiersStyles = {
    hasEvent: {
      position: 'relative' as const,
    }
  };

  const modifiersClassNames = {
    hasEvent: 'has-event-day',
  };

  return (
    <div className="main-screen">
      {/* Header */}
      <div className="screen-header">
        <h1 className="screen-title">Calendário de Eventos</h1>
        <p className="screen-subtitle">Visualize todos os eventos e atrações em um calendário interativo</p>
      </div>

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
            Clique em um dia com eventos (marcado com •) para ver os detalhes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="calendar-wrapper">
            <style>{`
              .has-event-day::after {
                content: '';
                position: absolute;
                bottom: 2px;
                left: 50%;
                transform: translateX(-50%);
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background-color: hsl(var(--primary));
              }
              .has-event-day {
                font-weight: 600;
                position: relative;
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
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span>Dias com eventos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent"></div>
              <span>Hoje</span>
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
