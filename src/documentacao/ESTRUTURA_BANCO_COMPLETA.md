# 🗄️ Estrutura Completa do Banco de Dados - Integra Recife

## 📋 Visão Geral

Este documento descreve a estrutura completa do banco de dados da Plataforma Integra Recife, com todas as tabelas, relacionamentos e campos em **português**.

---

## 🎯 Arquivos SQL Disponíveis

### 1. Schema Completo (Recomendado)
- **Arquivo**: `/database/schema-completo.sql`
- **Descrição**: Contém TODAS as tabelas do sistema
- **Uso**: Execute este arquivo para criar toda a estrutura de uma vez

### 2. Tabelas do Chat (Legado)
- **Arquivo**: `/database/chat-tables.sql`
- **Descrição**: Apenas tabelas de chat/fórum
- **Uso**: Apenas se você quiser criar somente o chat

---

## 📊 Tabelas do Sistema

### 1️⃣ Tabela: `usuarios`
**Descrição**: Armazena informações dos usuários da plataforma

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| `id` | UUID | Identificador único | Primary Key, Auto-gerado |
| `email` | TEXT | Email do usuário | Único, Obrigatório |
| `nome` | TEXT | Nome completo | Obrigatório |
| `avatar` | TEXT | URL da foto de perfil | Opcional |
| `tipo` | TEXT | Tipo de usuário | 'admin' ou 'cidadao' |
| `telefone` | TEXT | Telefone de contato | Opcional |
| `bio` | TEXT | Biografia do usuário | Opcional |
| `criado_em` | TIMESTAMPTZ | Data de criação | Auto-preenchido |
| `atualizado_em` | TIMESTAMPTZ | Data da última atualização | Auto-atualizado |

---

### 2️⃣ Tabela: `eventos`
**Descrição**: Armazena os eventos da cidade do Recife

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| `id` | UUID | Identificador único | Primary Key, Auto-gerado |
| `titulo` | TEXT | Título do evento | Obrigatório |
| `descricao` | TEXT | Descrição detalhada | Obrigatório |
| `data_inicio` | TIMESTAMPTZ | Data e hora de início | Obrigatório |
| `data_fim` | TIMESTAMPTZ | Data e hora de término | Opcional |
| `localizacao` | TEXT | Nome do local | Obrigatório |
| `endereco_completo` | TEXT | Endereço completo | Opcional |
| `latitude` | DECIMAL(10,8) | Coordenada de latitude | Opcional |
| `longitude` | DECIMAL(11,8) | Coordenada de longitude | Opcional |
| `imagem` | TEXT | URL da imagem do evento | Opcional |
| `categoria` | TEXT | Categoria do evento | Obrigatório |
| `cor_categoria` | TEXT | Cor da categoria (hex) | Opcional |
| `capacidade` | INTEGER | Capacidade máxima | Opcional |
| `preco` | DECIMAL(10,2) | Preço do ingresso | Padrão: 0 |
| `organizador_id` | UUID | Referência ao organizador | FK → usuarios(id) |
| `status` | TEXT | Status do evento | 'ativo', 'cancelado', 'concluido', 'adiado' |
| `destaque` | BOOLEAN | Se está em destaque | Padrão: false |
| `criado_em` | TIMESTAMPTZ | Data de criação | Auto-preenchido |
| `atualizado_em` | TIMESTAMPTZ | Data da última atualização | Auto-atualizado |

**Categorias Comuns**: Música, Teatro, Gastronomia, Festival, Arte, Cultura, Esporte

---

### 3️⃣ Tabela: `favoritos`
**Descrição**: Armazena os eventos favoritados pelos usuários

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| `id` | UUID | Identificador único | Primary Key, Auto-gerado |
| `usuario_id` | UUID | Referência ao usuário | FK → usuarios(id), Obrigatório |
| `evento_id` | UUID | Referência ao evento | FK → eventos(id), Obrigatório |
| `criado_em` | TIMESTAMPTZ | Data que favoritou | Auto-preenchido |

**Restrição Única**: Um usuário não pode favoritar o mesmo evento duas vezes

---

### 4️⃣ Tabela: `avaliacoes`
**Descrição**: Armazena as avaliações dos eventos pelos usuários

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| `id` | UUID | Identificador único | Primary Key, Auto-gerado |
| `evento_id` | UUID | Referência ao evento | FK → eventos(id), Obrigatório |
| `usuario_id` | UUID | Referência ao usuário | FK → usuarios(id), Obrigatório |
| `nota` | INTEGER | Nota de 1 a 5 estrelas | 1 ≤ nota ≤ 5 |
| `comentario` | TEXT | Comentário da avaliação | Opcional |
| `criado_em` | TIMESTAMPTZ | Data da avaliação | Auto-preenchido |
| `atualizado_em` | TIMESTAMPTZ | Data da última edição | Auto-atualizado |

**Restrição Única**: Um usuário só pode avaliar cada evento uma vez

---

### 5️⃣ Tabela: `projetos`
**Descrição**: Armazena projetos conjuntos entre organizadores

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| `id` | UUID | Identificador único | Primary Key, Auto-gerado |
| `titulo` | TEXT | Título do projeto | Obrigatório |
| `descricao` | TEXT | Descrição do projeto | Obrigatório |
| `categoria` | TEXT | Categoria do projeto | Obrigatório |
| `status` | TEXT | Status do projeto | 'planejamento', 'em-andamento', 'concluido', 'cancelado' |
| `prioridade` | TEXT | Prioridade do projeto | 'baixa', 'media', 'alta' |
| `data_inicio` | DATE | Data de início | Opcional |
| `data_fim` | DATE | Data de término | Opcional |
| `orcamento` | DECIMAL(12,2) | Orçamento do projeto | Opcional |
| `progresso` | INTEGER | Porcentagem de conclusão | 0 ≤ progresso ≤ 100 |
| `criado_por` | UUID | Referência ao criador | FK → usuarios(id) |
| `criado_em` | TIMESTAMPTZ | Data de criação | Auto-preenchido |
| `atualizado_em` | TIMESTAMPTZ | Data da última atualização | Auto-atualizado |

---

### 6️⃣ Tabela: `membros_projeto`
**Descrição**: Relaciona usuários com projetos (equipe do projeto)

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| `id` | UUID | Identificador único | Primary Key, Auto-gerado |
| `projeto_id` | UUID | Referência ao projeto | FK → projetos(id), Obrigatório |
| `usuario_id` | UUID | Referência ao usuário | FK → usuarios(id), Obrigatório |
| `papel` | TEXT | Papel no projeto | Opcional (ex: 'Coordenador', 'Designer') |
| `adicionado_em` | TIMESTAMPTZ | Data que entrou no projeto | Auto-preenchido |

**Restrição Única**: Um usuário não pode ser adicionado ao mesmo projeto duas vezes

---

### 7️⃣ Tabela: `canais_chat`
**Descrição**: Armazena os canais do sistema de chat/fórum

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| `id` | UUID | Identificador único | Primary Key, Auto-gerado |
| `nome` | TEXT | Nome do canal | Obrigatório |
| `descricao` | TEXT | Descrição do canal | Obrigatório |
| `tipo` | TEXT | Tipo do canal | 'geral', 'evento', 'projeto' |
| `evento_id` | UUID | Se for canal de evento | FK → eventos(id), Opcional |
| `projeto_id` | UUID | Se for canal de projeto | FK → projetos(id), Opcional |
| `criado_em` | TIMESTAMPTZ | Data de criação | Auto-preenchido |

**Canais Padrão**:
- 🔷 geral
- 🎉 festival-rec-beat
- 📁 projetos-culturais
- 🎭 carnaval-olinda
- 🍽️ gastronomia

---

### 8️⃣ Tabela: `mensagens_chat`
**Descrição**: Armazena as mensagens enviadas nos canais

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| `id` | UUID | Identificador único | Primary Key, Auto-gerado |
| `canal_id` | UUID | Referência ao canal | FK → canais_chat(id), Obrigatório |
| `usuario_id` | UUID | Referência ao usuário | FK → usuarios(id), Obrigatório |
| `usuario_nome` | TEXT | Nome do usuário (cache) | Obrigatório |
| `usuario_avatar` | TEXT | Avatar do usuário (cache) | Obrigatório |
| `conteudo` | TEXT | Conteúdo da mensagem | Obrigatório |
| `fixada` | BOOLEAN | Se está fixada no topo | Padrão: false |
| `criado_em` | TIMESTAMPTZ | Data e hora do envio | Auto-preenchido |

---

### 9️⃣ Tabela: `notificacoes`
**Descrição**: Armazena as notificações dos usuários

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| `id` | UUID | Identificador único | Primary Key, Auto-gerado |
| `usuario_id` | UUID | Referência ao usuário | FK → usuarios(id), Obrigatório |
| `tipo` | TEXT | Tipo da notificação | 'info', 'sucesso', 'alerta', 'erro' |
| `titulo` | TEXT | Título da notificação | Obrigatório |
| `mensagem` | TEXT | Mensagem da notificação | Obrigatório |
| `lida` | BOOLEAN | Se foi lida | Padrão: false |
| `link` | TEXT | Link relacionado | Opcional |
| `criado_em` | TIMESTAMPTZ | Data da notificação | Auto-preenchido |

---

### 🔟 Tabela: `inscricoes`
**Descrição**: Armazena inscrições de usuários em eventos

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| `id` | UUID | Identificador único | Primary Key, Auto-gerado |
| `evento_id` | UUID | Referência ao evento | FK → eventos(id), Obrigatório |
| `usuario_id` | UUID | Referência ao usuário | FK → usuarios(id), Obrigatório |
| `status` | TEXT | Status da inscrição | 'confirmada', 'pendente', 'cancelada' |
| `criado_em` | TIMESTAMPTZ | Data da inscrição | Auto-preenchido |

**Restrição Única**: Um usuário não pode se inscrever no mesmo evento duas vezes

---

## 🔗 Diagrama de Relacionamentos

```
usuarios
  ├── eventos (organizador_id)
  ├── favoritos (usuario_id)
  ├── avaliacoes (usuario_id)
  ├── projetos (criado_por)
  ├── membros_projeto (usuario_id)
  ├── mensagens_chat (usuario_id)
  ├── notificacoes (usuario_id)
  └── inscricoes (usuario_id)

eventos
  ├── favoritos (evento_id)
  ├── avaliacoes (evento_id)
  ├── canais_chat (evento_id)
  └── inscricoes (evento_id)

projetos
  ├── membros_projeto (projeto_id)
  └── canais_chat (projeto_id)

canais_chat
  └── mensagens_chat (canal_id)
```

---

## 🚀 Como Executar o Schema

### Opção 1: Via SQL Editor do Supabase (Recomendado)

1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto "Integra Recife"
3. Clique em **SQL Editor** no menu lateral
4. Clique em **New Query**
5. Copie todo o conteúdo do arquivo `/database/schema-completo.sql`
6. Cole no editor
7. Clique em **Run** (ou `Ctrl/Cmd + Enter`)
8. Aguarde a mensagem de sucesso

### Opção 2: Via Interface da Aplicação

1. Faça login como administrador
2. Vá para **Admin** no menu lateral
3. Clique em **Config. Banco** 
4. Clique em **Criar Todas as Tabelas**
5. Aguarde a confirmação

---

## 🔒 Segurança (RLS)

Todas as tabelas têm **Row Level Security (RLS)** ativado com políticas que permitem:

### Leitura (SELECT)
✅ **Públicas**: eventos, avaliacoes, canais_chat, mensagens_chat, projetos, usuarios  
🔒 **Restritas**: favoritos, notificacoes, inscricoes (apenas do próprio usuário)

### Escrita (INSERT/UPDATE/DELETE)
✅ **Permitido para todos**: criar eventos, avaliacoes, favoritos, inscrições  
🔒 **Restrito ao proprietário**: atualizar/deletar seus próprios registros

> **Nota**: As políticas atuais são permissivas para desenvolvimento. Em produção, ajuste conforme necessário.

---

## 📈 Views Automáticas

O schema cria automaticamente 2 views úteis:

### 1. `estatisticas_eventos`
Mostra estatísticas agregadas de cada evento:
- Total de favoritos
- Total de inscrições
- Total de avaliações
- Média de avaliações

```sql
SELECT * FROM estatisticas_eventos WHERE id = 'evento-id';
```

### 2. `projetos_com_equipe`
Mostra projetos com informação da equipe:
- Total de membros
- Nomes de todos os membros

```sql
SELECT * FROM projetos_com_equipe WHERE status = 'em-andamento';
```

---

## ⚡ Triggers Automáticos

### Atualização de Timestamp
As seguintes tabelas têm trigger para atualizar `atualizado_em` automaticamente:
- ✅ usuarios
- ✅ eventos
- ✅ avaliacoes
- ✅ projetos

Você **não precisa** definir `atualizado_em` manualmente ao fazer UPDATE.

---

## 🧪 Testes e Verificação

### Verificar se as tabelas foram criadas:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

### Contar registros:
```sql
SELECT 
  'usuarios' as tabela, COUNT(*) as total FROM usuarios
UNION ALL
SELECT 'eventos', COUNT(*) FROM eventos
UNION ALL
SELECT 'canais_chat', COUNT(*) FROM canais_chat;
```

### Ver estrutura de uma tabela:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'eventos'
ORDER BY ordinal_position;
```

---

## 🎯 Exemplos de Uso

### Criar um novo evento:
```sql
INSERT INTO eventos (
  titulo, 
  descricao, 
  data_inicio, 
  localizacao, 
  categoria, 
  organizador_id
) VALUES (
  'Festival de Frevo 2026',
  'Celebração da cultura pernambucana',
  '2026-02-15 18:00:00',
  'Marco Zero',
  'Festival',
  'uuid-do-organizador'
);
```

### Favoritar um evento:
```sql
INSERT INTO favoritos (usuario_id, evento_id)
VALUES ('uuid-usuario', 'uuid-evento');
```

### Avaliar um evento:
```sql
INSERT INTO avaliacoes (evento_id, usuario_id, nota, comentario)
VALUES (
  'uuid-evento',
  'uuid-usuario',
  5,
  'Evento incrível! Muito bem organizado.'
);
```

### Criar um projeto:
```sql
INSERT INTO projetos (
  titulo, 
  descricao, 
  categoria, 
  status, 
  criado_por
) VALUES (
  'Revitalização do Pátio de São Pedro',
  'Modernização do espaço cultural',
  'Infraestrutura',
  'planejamento',
  'uuid-usuario'
);
```

### Adicionar membro ao projeto:
```sql
INSERT INTO membros_projeto (projeto_id, usuario_id, papel)
VALUES (
  'uuid-projeto',
  'uuid-usuario',
  'Coordenador de Produção'
);
```

---

## 📝 Notas Importantes

⚠️ **Antes de Executar em Produção**:
- Faça backup do banco de dados existente
- Teste em ambiente de desenvolvimento primeiro
- Ajuste as políticas RLS conforme suas necessidades
- Configure índices adicionais se necessário

⚠️ **Campos Obrigatórios**:
- Sempre preencha campos marcados como NOT NULL
- UUIDs são gerados automaticamente
- Timestamps são preenchidos automaticamente

⚠️ **Relacionamentos**:
- Ao deletar um usuário, seus favoritos e avaliações são deletados (CASCADE)
- Ao deletar um evento, seus favoritos e avaliações são deletados (CASCADE)
- Ao deletar um projeto, seus membros são removidos (CASCADE)

---

## 🆘 Solução de Problemas

### Erro: "relation already exists"
**Solução**: As tabelas já existem. Use `DROP TABLE nome_tabela CASCADE;` para deletar antes de recriar.

### Erro: "permission denied"
**Solução**: Verifique se você está usando as credenciais corretas do Supabase.

### Erro: "violates foreign key constraint"
**Solução**: Certifique-se de que os registros referenciados existem antes de criar relacionamentos.

### Políticas RLS bloqueando acesso
**Solução**: 
1. Verifique se RLS está ativado: `ALTER TABLE nome_tabela ENABLE ROW LEVEL SECURITY;`
2. Verifique as políticas: `SELECT * FROM pg_policies WHERE tablename = 'nome_tabela';`

---

## 📚 Referências

- [Documentação PostgreSQL](https://www.postgresql.org/docs/)
- [Supabase Database](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Foreign Keys](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK)

---

**Última atualização**: 20 de Outubro de 2025  
**Versão**: 1.0  
**Total de Tabelas**: 10  
**Idioma**: 🇧🇷 Português
