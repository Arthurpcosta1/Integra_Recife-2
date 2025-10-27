import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { 
  Plus, 
  Folder, 
  Users, 
  Calendar as CalendarIcon, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter,
  MoreVertical,
  ArrowLeft,
  Edit,
  Trash2,
  DollarSign,
  Target,
  ListTodo
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ProjectsHelp } from './ProjectsHelp';

interface Task {
  id: string;
  description: string;
  responsible: string;
  deadline: string;
  status: 'pendente' | 'em-andamento' | 'concluida';
  createdAt: Date;
}

interface Project {
  id: string;
  title: string;
  description: string;
  objectives: string;
  category: string;
  status: 'planejamento' | 'em-andamento' | 'concluido' | 'cancelado';
  priority: 'baixa' | 'media' | 'alta';
  startDate: string;
  endDate?: string;
  budget: number;
  team: string[];
  progress: number;
  createdBy: string;
  createdAt: Date;
  tasks: Task[];
}

interface ProjectsModuleEnhancedProps {
  currentUser: {
    id: string;
    name: string;
    type: 'admin' | 'cidadao';
  };
}

type View = 'list' | 'detail';

export const ProjectsModuleEnhanced: React.FC<ProjectsModuleEnhancedProps> = ({ currentUser }) => {
  const [view, setView] = useState<View>('list');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');

  // Form states
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    objectives: '',
    category: 'Música',
    status: 'planejamento' as Project['status'],
    priority: 'media' as Project['priority'],
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    budget: '',
    team: ''
  });

  const [taskForm, setTaskForm] = useState({
    description: '',
    responsible: '',
    deadline: undefined as Date | undefined
  });

  const categories = ['Música', 'Teatro', 'Gastronomia', 'Arte', 'Infraestrutura', 'Educação', 'Turismo'];

  const selectedProject = selectedProjectId ? projects.find(p => p.id === selectedProjectId) : null;

  // Carregar projetos do banco de dados
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projetos')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('❌ Erro ao carregar projetos:', error);
        toast.error('Erro ao carregar projetos');
        return;
      }

      if (data && data.length > 0) {
        // Converter dados do banco para formato do componente
        const projectsFromDB: Project[] = data.map((proj: any) => ({
          id: proj.id,
          title: proj.titulo || '',
          description: proj.descricao || '',
          objectives: proj.descricao || '',
          category: proj.categoria || 'Geral',
          status: proj.status || 'planejamento',
          priority: proj.prioridade || 'media',
          startDate: proj.data_inicio || new Date().toISOString().split('T')[0],
          endDate: proj.data_fim || undefined,
          budget: Number(proj.orcamento) || 0,
          team: [],
          progress: Number(proj.progresso) || 0,
          createdBy: currentUser.name,
          createdAt: new Date(proj.criado_em),
          tasks: []
        }));

        setProjects(projectsFromDB);
        console.log('✅ Projetos carregados:', projectsFromDB.length);
      } else {
        // Se não houver projetos, iniciar com projetos de exemplo
        setProjects([
          {
            id: Date.now().toString(),
            title: 'Exemplo: Festival de Música do Recife Antigo',
            description: 'Organização de festival cultural com múltiplos palcos',
            objectives: 'Promover a cultura local através de eventos musicais.',
            category: 'Música',
            status: 'planejamento',
            priority: 'media',
            startDate: new Date().toISOString().split('T')[0],
            budget: 250000,
            team: [],
            progress: 0,
            createdBy: currentUser.name,
            createdAt: new Date(),
            tasks: []
          }
        ]);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar projetos:', error);
      toast.error('Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  // Handlers para Projeto
  const handleOpenProjectDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setProjectForm({
        title: project.title,
        description: project.description,
        objectives: project.objectives,
        category: project.category,
        status: project.status,
        priority: project.priority,
        startDate: new Date(project.startDate),
        endDate: project.endDate ? new Date(project.endDate) : undefined,
        budget: project.budget.toString(),
        team: project.team.join(', ')
      });
    } else {
      setEditingProject(null);
      setProjectForm({
        title: '',
        description: '',
        objectives: '',
        category: 'Música',
        status: 'planejamento',
        priority: 'media',
        startDate: undefined,
        endDate: undefined,
        budget: '',
        team: ''
      });
    }
    setShowProjectDialog(true);
  };

  const handleSaveProject = async () => {
    if (!projectForm.title || !projectForm.startDate || !projectForm.budget) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const projectDataDB = {
        titulo: projectForm.title,
        descricao: projectForm.description,
        categoria: projectForm.category,
        status: projectForm.status,
        prioridade: projectForm.priority,
        data_inicio: format(projectForm.startDate, 'yyyy-MM-dd'),
        data_fim: projectForm.endDate ? format(projectForm.endDate, 'yyyy-MM-dd') : null,
        orcamento: Number(projectForm.budget),
        progresso: editingProject?.progress || 0,
        criado_por: currentUser.id
      };

      if (editingProject) {
        // Atualizar projeto existente
        const { error } = await supabase
          .from('projetos')
          .update(projectDataDB)
          .eq('id', editingProject.id);

        if (error) {
          console.error('❌ Erro ao atualizar projeto:', error);
          toast.error('Erro ao atualizar projeto');
          return;
        }

        toast.success('Projeto atualizado com sucesso!');
      } else {
        // Criar novo projeto
        const { data, error } = await supabase
          .from('projetos')
          .insert(projectDataDB)
          .select()
          .single();

        if (error) {
          console.error('❌ Erro ao criar projeto:', error);
          toast.error('Erro ao criar projeto');
          return;
        }

        toast.success('Projeto criado com sucesso!');
      }

      // Recarregar projetos
      await loadProjects();
      setShowProjectDialog(false);
    } catch (error) {
      console.error('❌ Erro ao salvar projeto:', error);
      toast.error('Erro ao salvar projeto');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;

    try {
      const { error } = await supabase
        .from('projetos')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('❌ Erro ao deletar projeto:', error);
        toast.error('Erro ao deletar projeto');
        return;
      }

      toast.success('Projeto excluído com sucesso!');
      await loadProjects();

      if (selectedProjectId === projectId) {
        setView('list');
        setSelectedProjectId(null);
      }
    } catch (error) {
      console.error('❌ Erro ao deletar projeto:', error);
      toast.error('Erro ao deletar projeto');
    }
  };

  // Handlers para Tarefa
  const handleOpenTaskDialog = () => {
    setTaskForm({
      description: '',
      responsible: '',
      deadline: undefined
    });
    setShowTaskDialog(true);
  };

  const handleSaveTask = () => {
    if (!selectedProject || !taskForm.description || !taskForm.responsible || !taskForm.deadline) return;

    const newTask: Task = {
      id: Date.now().toString(),
      description: taskForm.description,
      responsible: taskForm.responsible,
      deadline: format(taskForm.deadline, 'yyyy-MM-dd'),
      status: 'pendente',
      createdAt: new Date()
    };

    setProjects(projects.map(p => 
      p.id === selectedProject.id 
        ? { ...p, tasks: [...p.tasks, newTask] }
        : p
    ));

    setShowTaskDialog(false);
  };

  const handleToggleTaskStatus = (taskId: string) => {
    if (!selectedProject) return;

    setProjects(projects.map(p => 
      p.id === selectedProject.id
        ? {
            ...p,
            tasks: p.tasks.map(t => {
              if (t.id === taskId) {
                const newStatus: Task['status'] = 
                  t.status === 'pendente' ? 'em-andamento' :
                  t.status === 'em-andamento' ? 'concluida' : 'pendente';
                return { ...t, status: newStatus };
              }
              return t;
            })
          }
        : p
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    if (!selectedProject) return;

    setProjects(projects.map(p => 
      p.id === selectedProject.id
        ? { ...p, tasks: p.tasks.filter(t => t.id !== taskId) }
        : p
    ));
  };

  // Funções auxiliares
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'concluido': return 'bg-green-500';
      case 'em-andamento': return 'bg-blue-500';
      case 'planejamento': return 'bg-yellow-500';
      case 'cancelado': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'concluido': return 'Concluído';
      case 'em-andamento': return 'Em Andamento';
      case 'planejamento': return 'Planejamento';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const getTaskStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'concluida': return 'Concluída';
      case 'em-andamento': return 'Em Andamento';
      case 'pendente': return 'Pendente';
      default: return status;
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: projects.length,
    planejamento: projects.filter(p => p.status === 'planejamento').length,
    emAndamento: projects.filter(p => p.status === 'em-andamento').length,
    concluidos: projects.filter(p => p.status === 'concluido').length,
  };

  if (currentUser.type !== 'admin') {
    return (
      <div className="main-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Apenas administradores podem acessar o módulo de projetos conjuntos.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="main-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-current border-t-transparent rounded-full mb-4" style={{ borderTopColor: 'transparent', borderColor: 'var(--accent-color)' }} role="status" aria-label="loading">
            <span className="sr-only">Carregando...</span>
          </div>
          <p style={{ color: 'var(--primary-color)', opacity: 0.7 }}>Carregando projetos do banco de dados...</p>
        </div>
      </div>
    );
  }

  // Vista de Lista
  if (view === 'list') {
    return (
      <div className="main-screen">
        {/* Header */}
        <div className="screen-header mb-6">
          <div>
            <h1 className="screen-title">Projetos Conjuntos</h1>
            <p className="screen-subtitle">Gerencie projetos culturais e colaborativos da cidade</p>
          </div>
          <Button onClick={() => handleOpenProjectDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto Conjunto
          </Button>
        </div>

        {/* Componente de Ajuda */}
        <ProjectsHelp />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Em Planejamento</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.planejamento}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.emAndamento}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.concluidos}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar projetos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="planejamento">Planejamento</SelectItem>
              <SelectItem value="em-andamento">Em Andamento</SelectItem>
              <SelectItem value="concluido">Concluídos</SelectItem>
              <SelectItem value="cancelado">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid de Projetos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Nenhum projeto encontrado. Clique em "Novo Projeto Conjunto" para começar!
            </div>
          ) : (
            filteredProjects.map(project => (
              <Card 
                key={project.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setView('detail');
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-2 mb-2">{project.title}</CardTitle>
                      <Badge variant="outline">{project.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {project.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(project.startDate).toLocaleDateString('pt-BR')}</span>
                      {project.endDate && (
                        <>
                          <span>-</span>
                          <span>{new Date(project.endDate).toLocaleDateString('pt-BR')}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{project.team.length} membros</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progresso</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusLabel(project.status)}
                      </Badge>
                      <span className="text-sm font-medium">
                        R$ {project.budget.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Dialog de Criar/Editar Projeto */}
        <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Editar Projeto' : 'Criar Novo Projeto Conjunto'}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do projeto colaborativo
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Nome do Projeto *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Festival Cultural do Recife"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  placeholder="Breve descrição do projeto..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objectives">Objetivos *</Label>
                <Textarea
                  id="objectives"
                  placeholder="Descreva os objetivos e metas do projeto..."
                  value={projectForm.objectives}
                  onChange={(e) => setProjectForm({ ...projectForm, objectives: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={projectForm.category} onValueChange={(value) => setProjectForm({ ...projectForm, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade *</Label>
                  <Select value={projectForm.priority} onValueChange={(value: any) => setProjectForm({ ...projectForm, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data de Início *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={projectForm.startDate ? format(projectForm.startDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value + 'T00:00:00') : undefined;
                      setProjectForm({ ...projectForm, startDate: date });
                    }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Data de Término</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={projectForm.endDate ? format(projectForm.endDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value + 'T00:00:00') : undefined;
                      setProjectForm({ ...projectForm, endDate: date });
                    }}
                    min={projectForm.startDate ? format(projectForm.startDate, 'yyyy-MM-dd') : undefined}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Orçamento (R$) *</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="50000"
                  value={projectForm.budget}
                  onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="team">Membros da Equipe</Label>
                <Input
                  id="team"
                  placeholder="Separe os nomes por vírgula: João Silva, Maria Santos"
                  value={projectForm.team}
                  onChange={(e) => setProjectForm({ ...projectForm, team: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Digite os nomes ou emails dos membros, separados por vírgula
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowProjectDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveProject}>
                Salvar Projeto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Vista de Detalhes do Projeto
  return (
    <div className="main-screen">
      {selectedProject && (
        <>
          {/* Header com botão voltar */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => {
                setView('list');
                setSelectedProjectId(null);
              }}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Projetos
            </Button>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="screen-title mb-2">{selectedProject.title}</h1>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(selectedProject.status)}>
                    {getStatusLabel(selectedProject.status)}
                  </Badge>
                  <Badge variant="outline">{selectedProject.category}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleOpenProjectDialog(selectedProject)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDeleteProject(selectedProject.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Informações do Projeto */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Informações do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Descrição</Label>
                  <p className="mt-1">{selectedProject.description}</p>
                </div>

                <Separator />

                <div>
                  <Label className="text-muted-foreground">Objetivos</Label>
                  <p className="mt-1">{selectedProject.objectives}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Data de Início</Label>
                    <p className="mt-1 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {new Date(selectedProject.startDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  {selectedProject.endDate && (
                    <div>
                      <Label className="text-muted-foreground">Data de Término</Label>
                      <p className="mt-1 flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(selectedProject.endDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <Label className="text-muted-foreground">Orçamento</Label>
                  <p className="mt-1 flex items-center gap-2 text-lg font-semibold">
                    <DollarSign className="h-5 w-5" />
                    R$ {selectedProject.budget.toLocaleString('pt-BR')}
                  </p>
                </div>

                <Separator />

                <div>
                  <Label className="text-muted-foreground mb-2 block">Progresso do Projeto</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Conclusão</span>
                      <span className="font-medium">{selectedProject.progress}%</span>
                    </div>
                    <Progress value={selectedProject.progress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Equipe do Projeto
                </CardTitle>
                <CardDescription>
                  {selectedProject.team.length} {selectedProject.team.length === 1 ? 'membro' : 'membros'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedProject.team.map((member, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {member.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member}</p>
                      </div>
                    </div>
                  ))}
                  {selectedProject.team.length === 0 && (
                    <p className="text-sm text-muted-foreground">Nenhum membro adicionado ainda</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tarefas */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ListTodo className="h-5 w-5" />
                    Tarefas do Projeto
                  </CardTitle>
                  <CardDescription>
                    {selectedProject.tasks.length} {selectedProject.tasks.length === 1 ? 'tarefa' : 'tarefas'}
                  </CardDescription>
                </div>
                <Button onClick={handleOpenTaskDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Tarefa
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {selectedProject.tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma tarefa cadastrada. Clique em "Adicionar Tarefa" para começar!
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Prazo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedProject.tasks.map(task => (
                      <TableRow key={task.id}>
                        <TableCell>
                          <Checkbox
                            checked={task.status === 'concluida'}
                            onCheckedChange={() => handleToggleTaskStatus(task.id)}
                          />
                        </TableCell>
                        <TableCell className={task.status === 'concluida' ? 'line-through text-muted-foreground' : ''}>
                          {task.description}
                        </TableCell>
                        <TableCell>{task.responsible}</TableCell>
                        <TableCell>{new Date(task.deadline).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <Badge variant={task.status === 'concluida' ? 'default' : 'outline'}>
                            {getTaskStatusLabel(task.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Dialog de Adicionar Tarefa */}
          <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
                <DialogDescription>
                  Crie uma nova tarefa para este projeto
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="task-description">Descrição da Tarefa *</Label>
                  <Textarea
                    id="task-description"
                    placeholder="Descreva a tarefa..."
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-responsible">Responsável *</Label>
                  <Select 
                    value={taskForm.responsible} 
                    onValueChange={(value) => setTaskForm({ ...taskForm, responsible: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProject.team.map(member => (
                        <SelectItem key={member} value={member}>{member}</SelectItem>
                      ))}
                      {selectedProject.team.length === 0 && (
                        <SelectItem value="sem-equipe" disabled>
                          Adicione membros à equipe primeiro
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-deadline">Prazo *</Label>
                  <Input
                    id="task-deadline"
                    type="date"
                    value={taskForm.deadline ? format(taskForm.deadline, 'yyyy-MM-dd') : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value + 'T00:00:00') : undefined;
                      setTaskForm({ ...taskForm, deadline: date });
                    }}
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowTaskDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveTask}>
                  Salvar Tarefa
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};