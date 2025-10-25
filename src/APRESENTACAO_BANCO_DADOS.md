# 📊 Apresentação do Banco de Dados - Integra Recife

## 📌 Visão Geral do Projeto

O **Integra Recife** é uma plataforma web desenvolvida para conectar cidadãos aos eventos culturais e turísticos da cidade do Recife. A aplicação utiliza **Supabase** como backend, oferecendo autenticação, banco de dados PostgreSQL e armazenamento em tempo real.

---

## 🗄️ Estrutura do Banco de Dados

O sistema utiliza o **Supabase** com duas abordagens de armazenamento:

### 1. **Supabase Auth** (Sistema de Autenticação)
Gerencia usuários de forma nativa e segura.

### 2. **KV Store (Key-Value Store)**
Armazenamento de dados estruturados usando a tabela `kv_store_2afcbce1`.

---

## 📋 Modelo de Dados em Português

### **Tabela: Usuários**
Armazena informações dos usuários cadastrados na plataforma.

**Chave KV:** `usuario:{id}`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único do usuário (gerado pelo Supabase Auth) |
| `email` | String | E-mail do usuário |
| `nome` | String | Nome completo do usuário |
| `tipo` | String | Tipo de conta: "admin" ou "citizen" |
| `dataCriacao` | DateTime | Data e hora do cadastro (formato ISO) |

**Exemplo de dados:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "joao.silva@email.com",
  "nome": "João Silva",
  "tipo": "citizen",
  "dataCriacao": "2025-10-19T14:30:00.000Z"
}
```

---

### **Tabela: Eventos**
Contém informações sobre os eventos culturais e turísticos do Recife.

**Chave KV:** `evento:{id}`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | String | Identificador único do evento |
| `titulo` | String | Título do evento |
| `data` | String | Data do evento (formato: "DD de MMMM, YYYY") |
| `horario` | String | Horário de início |
| `local` | String | Local onde será realizado |
| `imagem` | URL | Link da imagem do evento |
| `categoria` | String | Categoria (Música, Teatro, Gastronomia, etc.) |
| `corCategoria` | String | Cor hexadecimal da categoria |
| `descricao` | String | Descrição completa do evento |
| `dataCriacao` | DateTime | Data de criação do registro |
| `criadoPor` | UUID | ID do administrador que criou o evento |
| `mediaAvaliacoes` | Number | Média das avaliações (0-5) |
| `totalAvaliacoes` | Number | Total de avaliações recebidas |

**Exemplo de dados:**
```json
{
  "id": "evento_1697745600000",
  "titulo": "Festival Rec-Beat 2025",
  "data": "15 de Outubro, 2025",
  "horario": "18:00",
  "local": "Cais da Alfândega",
  "imagem": "https://...",
  "categoria": "Música",
  "corCategoria": "#e48e2c",
  "descricao": "O maior festival de música independente do Nordeste...",
  "dataCriacao": "2025-10-19T14:30:00.000Z",
  "criadoPor": "550e8400-e29b-41d4-a716-446655440000",
  "mediaAvaliacoes": 4.5,
  "totalAvaliacoes": 328
}
```

---

### **Tabela: Avaliações**
Armazena as avaliações e comentários dos usuários sobre os eventos.

**Chave KV:** `avaliacao:{id}`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | String | Identificador único da avaliação |
| `eventoId` | String | ID do evento avaliado |
| `usuarioId` | UUID | ID do usuário que avaliou |
| `nomeUsuario` | String | Nome do usuário (para exibição) |
| `nota` | Number | Nota de 1 a 5 estrelas |
| `comentario` | String | Comentário opcional do usuário |
| `dataAvaliacao` | DateTime | Data e hora da avaliação |

**Exemplo de dados:**
```json
{
  "id": "avaliacao_1697745700000",
  "eventoId": "evento_1697745600000",
  "usuarioId": "550e8400-e29b-41d4-a716-446655440000",
  "nomeUsuario": "João Silva",
  "nota": 5,
  "comentario": "Evento incrível! Adorei a organização e os artistas.",
  "dataAvaliacao": "2025-10-19T20:15:00.000Z"
}
```

---

## 🔐 Sistema de Autenticação

O sistema utiliza o **Supabase Auth** com as seguintes funcionalidades:

- ✅ **Cadastro de usuários** com e-mail e senha
- ✅ **Login/Logout** com tokens JWT
- ✅ **Níveis de acesso** (Admin e Cidadão)
- ✅ **Confirmação automática de e-mail** (para ambiente de desenvolvimento)

### Metadados do Usuário (user_metadata)
Armazenados automaticamente no Supabase Auth:
- `nome`: Nome do usuário
- `tipo`: Tipo de conta (admin/citizen)

---

## 🔄 Fluxo de Dados

### 1. **Cadastro de Usuário**
```
Frontend → POST /cadastro → Backend → Supabase Auth + KV Store
```

### 2. **Login de Usuário**
```
Frontend → Supabase Auth (signInWithPassword) → Retorna Access Token
```

### 3. **Criação de Evento (Admin)**
```
Frontend → POST /eventos (com token) → Backend verifica permissão → KV Store
```

### 4. **Exclusão de Usuário (Admin)**
```
Frontend → DELETE /usuarios/:id (com token) → Backend → Supabase Auth + KV Store
```

### 5. **Avaliação de Evento**
```
Frontend → POST /avaliacoes (com token) → Backend → KV Store
```

---

## 🎯 Como Apresentar o Banco de Dados ao Professor

### **1. Acesse o Painel do Supabase**
1. Abra o navegador e vá para: [https://supabase.com](https://supabase.com)
2. Faça login com sua conta
3. Selecione o projeto **Integra Recife**

### **2. Visualize a Tabela de Autenticação**
1. No menu lateral, clique em **Authentication** → **Users**
2. Aqui você verá todos os usuários cadastrados
3. Mostre os campos: E-mail, Data de criação, Metadados

### **3. Visualize o KV Store**
1. No menu lateral, clique em **Table Editor**
2. Selecione a tabela `kv_store_2afcbce1`
3. Mostre os dados armazenados em formato JSON
4. Explique a estrutura de chave-valor (`usuario:`, `evento:`, `avaliacao:`)

### **4. Execute Queries SQL (Opcional)**
1. Clique em **SQL Editor** no menu lateral
2. Execute queries para demonstrar os dados:

```sql
-- Ver todos os registros do KV Store
SELECT * FROM kv_store_2afcbce1;

-- Ver apenas usuários
SELECT * FROM kv_store_2afcbce1 
WHERE key LIKE 'usuario:%';

-- Ver apenas eventos
SELECT * FROM kv_store_2afcbce1 
WHERE key LIKE 'evento:%';

-- Ver apenas avaliações
SELECT * FROM kv_store_2afcbce1 
WHERE key LIKE 'avaliacao:%';

-- Contar total de registros por tipo
SELECT 
  CASE 
    WHEN key LIKE 'usuario:%' THEN 'Usuários'
    WHEN key LIKE 'evento:%' THEN 'Eventos'
    WHEN key LIKE 'avaliacao:%' THEN 'Avaliações'
    ELSE 'Outros'
  END AS tipo,
  COUNT(*) as total
FROM kv_store_2afcbce1
GROUP BY tipo;
```

### **5. Demonstre a API Backend**
1. Abra o navegador em modo desenvolvedor (F12)
2. Vá para a aba **Network** (Rede)
3. Use a aplicação Integra Recife:
   - Cadastre um usuário
   - Faça login
   - Crie um evento (como admin)
   - Avalie um evento
4. Mostre as requisições HTTP sendo feitas para o backend
5. Mostre as respostas JSON retornadas

### **6. Mostre os Logs do Servidor**
1. No Supabase, vá em **Edge Functions**
2. Selecione a função `make-server-2afcbce1`
3. Clique em **Logs**
4. Mostre os logs de requisições em tempo real

---

## 📊 Estatísticas para Apresentação

Ao apresentar, mostre:

- ✅ **Total de usuários cadastrados**
- ✅ **Divisão entre administradores e cidadãos**
- ✅ **Total de eventos criados**
- ✅ **Total de avaliações**
- ✅ **Eventos mais bem avaliados**

---

## 🛡️ Segurança Implementada

1. **Autenticação JWT**: Todos os endpoints protegidos requerem token válido
2. **Autorização por Nível**: Apenas admins podem criar/excluir eventos e gerenciar usuários
3. **Validação de Dados**: Todos os campos obrigatórios são validados
4. **CORS Habilitado**: Permite acesso apenas de origens autorizadas
5. **Service Role Key**: Não exposta ao frontend (apenas no backend)

---

## 🚀 Funcionalidades do Sistema de Gerenciamento

### **Para Administradores:**
- ✅ Criar novos eventos
- ✅ Excluir eventos
- ✅ Visualizar todos os usuários cadastrados
- ✅ Excluir usuários (exceto a própria conta)
- ✅ Ver estatísticas da plataforma
- ✅ **Sistema de Relatórios** com gráficos e exportação CSV/PDF
- ✅ **Módulo de Projetos Conjuntos** para gerenciar projetos culturais
- ✅ **Análise de Dados** com métricas detalhadas

### **Para Cidadãos:**
- ✅ Visualizar eventos
- ✅ Avaliar eventos passados
- ✅ Adicionar comentários
- ✅ Favoritar eventos
- ✅ Explorar roteiros turísticos

### **Para Todos os Usuários:**
- ✅ **Chat/Fórum** para comunicação entre membros da comunidade
- ✅ **Sistema de Notificações** em tempo real
- ✅ Notificações de novos eventos, confirmações e lembretes
- ✅ Canais temáticos de discussão

---

## 📝 Observações Importantes

1. **Banco de Dados em Português**: Todos os nomes de campos e tabelas estão em português para facilitar a compreensão
2. **Formato de Datas**: Utiliza ISO 8601 para compatibilidade internacional
3. **Exclusão em Cascata**: Ao excluir um usuário, suas avaliações também são removidas
4. **Ambiente de Desenvolvimento**: E-mails são confirmados automaticamente (sem servidor de e-mail configurado)

---

## 🎓 Pontos para Destacar na Apresentação

1. **Arquitetura Moderna**: Frontend (React) + Backend (Supabase Edge Functions) + Banco de Dados (PostgreSQL)
2. **Escalabilidade**: Supabase permite crescimento sem necessidade de gerenciar infraestrutura
3. **Segurança**: Implementação de autenticação e autorização robusta
4. **UX/UI**: Interface intuitiva e responsiva
5. **Documentação**: Código bem documentado e estruturado
6. **Localização**: Sistema totalmente em português (PT-BR)
7. **Comunicação em Tempo Real**: Chat/Fórum com canais temáticos
8. **Analytics Avançado**: Sistema completo de relatórios com visualizações
9. **Gestão de Projetos**: Módulo exclusivo para administradores gerenciarem projetos culturais
10. **Sistema de Notificações**: Alertas em tempo real para engajamento dos usuários

---

## 📞 Suporte

Para dúvidas sobre o banco de dados durante a apresentação, consulte este documento ou acesse a documentação oficial do Supabase: [https://supabase.com/docs](https://supabase.com/docs)

---

**Boa apresentação! 🎉**
