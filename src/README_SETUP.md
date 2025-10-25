# 🚀 Setup Completo - Integra Recife

## ⚡ Início Rápido (10 minutos)

### 1. Configuração do Supabase

#### Criar as Tabelas do Chat

**Passo 1:** Acesse seu projeto no [Supabase Dashboard](https://supabase.com/dashboard)

**Passo 2:** Vá em **SQL Editor** e execute:

```sql
-- Tabela de canais
CREATE TABLE canais_chat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(20) DEFAULT 'general',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de mensagens
CREATE TABLE mensagens_chat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canal_id UUID REFERENCES canais_chat(id) ON DELETE CASCADE,
  usuario_id VARCHAR(255) NOT NULL,
  usuario_nome VARCHAR(255) NOT NULL,
  usuario_avatar TEXT,
  conteudo TEXT NOT NULL,
  fixada BOOLEAN DEFAULT false,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices
CREATE INDEX idx_mensagens_canal ON mensagens_chat(canal_id);
CREATE INDEX idx_mensagens_usuario ON mensagens_chat(usuario_id);
CREATE INDEX idx_mensagens_criado ON mensagens_chat(criado_em DESC);

-- RLS
ALTER TABLE canais_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens_chat ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Todos podem ler canais" ON canais_chat FOR SELECT USING (true);
CREATE POLICY "Todos podem ler mensagens" ON mensagens_chat FOR SELECT USING (true);
CREATE POLICY "Usuários podem enviar mensagens" ON mensagens_chat FOR INSERT WITH CHECK (true);

-- Inserir canais padrão
INSERT INTO canais_chat (nome, descricao, tipo) VALUES
  ('geral', 'Discussões gerais sobre eventos do Recife', 'general'),
  ('festival-rec-beat', 'Tudo sobre o Festival Rec-Beat 2025', 'event'),
  ('projetos-culturais', 'Discussões sobre projetos conjuntos', 'project'),
  ('carnaval-olinda', 'Planejamento e dicas para o Carnaval', 'event'),
  ('gastronomia', 'Eventos gastronômicos e culinária', 'general');
```

### 2. Verificar Setup

✅ Vá em **Table Editor** e confirme:
- Tabela `canais_chat` com 5 registros
- Tabela `mensagens_chat` (vazia)

### 3. Testar Aplicação

1. Faça login como admin: `admin@integra.com` / `admin123`
2. Navegue até **Chat/Fórum**
3. Envie uma mensagem
4. Abra em outra aba e veja a mensagem aparecer em tempo real!

## 📋 Funcionalidades Implementadas

### ✅ Módulos Principais

1. **Dashboard de Eventos**
   - Visualização de eventos
   - Calendário interativo
   - Sistema de favoritos
   - Avaliações e comentários

2. **Painel Administrativo**
   - Gestão de eventos (criar, editar, excluir)
   - Gestão de usuários (visualizar, excluir)
   - Estatísticas da plataforma

3. **Chat/Fórum** ⭐ NOVO
   - Mensagens em tempo real
   - Canais temáticos
   - Histórico salvo no banco
   - Mensagens fixadas

4. **Sistema de Notificações** ⭐ NOVO
   - Notificações em tempo real
   - Badge com contador
   - Marcar como lido
   - Diversos tipos (info, success, warning, error)

5. **Sistema de Relatórios** ⭐ NOVO (Apenas Admin)
   - Gráficos de crescimento
   - Analytics detalhado
   - Exportação CSV/PDF
   - Métricas de eventos populares

6. **Módulo de Projetos** ⭐ NOVO (Apenas Admin)
   - Gestão de projetos culturais
   - Acompanhamento de progresso
   - Orçamento e equipe
   - Status e prioridades

7. **Sistema de Autenticação**
   - Login/Cadastro com Supabase Auth
   - Dois níveis de acesso (Admin e Cidadão)
   - JWT tokens
   - Perfil de usuário

8. **Roteiros Turísticos**
   - Pontos turísticos do Recife
   - Descrições detalhadas
   - Imagens e mapas

## 🎯 Níveis de Acesso

### 👤 Cidadão
- ✅ Ver eventos
- ✅ Favoritar eventos
- ✅ Avaliar eventos
- ✅ Chat/Fórum
- ✅ Notificações
- ✅ Ver roteiros
- ❌ Criar eventos
- ❌ Relatórios
- ❌ Projetos

### 👨‍💼 Administrador
- ✅ Tudo que o Cidadão pode
- ✅ Criar/Editar/Excluir eventos
- ✅ Gerenciar usuários
- ✅ Ver relatórios completos
- ✅ Exportar dados
- ✅ Gerenciar projetos culturais

## 🎨 Recursos Visuais

- 🌓 Dark/Light Mode
- 📱 Design Responsivo
- 🎨 Animações suaves
- 🔔 Notificações toast
- 📊 Gráficos interativos
- 💬 Chat em tempo real

## 📚 Documentação Adicional

- `APRESENTACAO_BANCO_DADOS.md` - Estrutura completa do banco
- `GUIA_RAPIDO_DEMONSTRACAO.md` - Roteiro para apresentação
- `SETUP_CHAT_BANCO.md` - Setup específico do chat
- `ESTRUTURA_BANCO_CHAT.md` - Detalhes técnicos do chat

## 🧪 Contas de Teste

### Administrador
- **Email:** `admin@integra.com`
- **Senha:** `admin123`
- **Acesso:** Completo

### Cidadão (criar durante a apresentação)
- **Email:** `maria@cidada.com`
- **Senha:** `maria123`
- **Acesso:** Limitado

## 🔧 Tecnologias Utilizadas

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **Autenticação:** Supabase Auth
- **Tempo Real:** Supabase Realtime
- **UI Components:** shadcn/ui
- **Ícones:** Lucide React
- **Gráficos:** Recharts
- **Notificações:** Sonner

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique o console do navegador (F12)
2. Verifique os logs do Supabase
3. Consulte a documentação dos arquivos `.md`

---

**Desenvolvido para o projeto de conclusão - Integra Recife** 🏖️✨
