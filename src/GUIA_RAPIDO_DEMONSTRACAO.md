# 🎬 Guia Rápido de Demonstração - Integra Recife

## ⚡ Checklist de Preparação (5 minutos antes)

- [ ] Abra o Supabase Dashboard: [https://supabase.com](https://supabase.com)
- [ ] Faça login e selecione o projeto Integra Recife
- [ ] Abra em uma aba: **Authentication** → **Users**
- [ ] Abra em outra aba: **Table Editor** → `kv_store_2afcbce1`
- [ ] Abra a aplicação Integra Recife em outra janela
- [ ] Abra as Ferramentas de Desenvolvedor (F12)

---

## 🎯 Roteiro de Demonstração (10-15 minutos)

### **PARTE 1: Apresentação da Aplicação (3 min)**

1. **Mostre a tela de login**
   - "Esta é a tela inicial onde usuários podem fazer login ou se cadastrar"
   - "Temos dois tipos de usuário: Cidadão e Administrador"

2. **Demonstre o cadastro**
   - Clique em "Cadastrar"
   - Preencha os dados de exemplo:
     - Nome: `Professor Demo`
     - E-mail: `professor@demo.com`
     - Senha: `demo123`
     - Tipo: **Administrador**
   - Clique em "Criar Conta"
   - **Importante**: Volte ao Supabase e mostre que o usuário apareceu na tabela Authentication

3. **Faça login**
   - Use as credenciais criadas
   - Mostre que você foi redirecionado para o Painel Admin

---

### **PARTE 2: Funcionalidades de Administrador (5 min)**

1. **Mostre o Painel Administrativo**
   - "Como admin, tenho acesso a duas abas: Eventos e Usuários"
   - Mostre as estatísticas (Total de Eventos, Categorias)

2. **Demonstre a criação de evento**
   - Clique em "Novo Evento"
   - Preencha os dados:
     - Título: `Workshop de Frevo - Demo Professor`
     - Categoria: `Música`
     - Local: `Paço do Frevo`
     - Data: `2025-11-15`
     - Horário: `14:00`
     - Descrição: `Workshop demonstrativo sobre a história e prática do frevo pernambucano`
   - Clique em "Criar Evento"
   - **Importante**: Volte ao Supabase (Table Editor) e mostre o novo evento na tabela

3. **Demonstre o Gerenciamento de Usuários**
   - Clique na aba "Usuários"
   - Mostre a lista de usuários cadastrados
   - Explique: "Aqui vejo todos os usuários, seu tipo (admin/cidadão) e data de cadastro"
   - Mostre as estatísticas (Total, Admins, Cidadãos)
   - **NÃO exclua nenhum usuário ainda** (deixe para a Parte 4)

---

### **PARTE 3: Banco de Dados Supabase (4 min)**

1. **Mostre o Supabase Authentication**
   - Vá para: Authentication → Users
   - "Aqui estão todos os usuários autenticados na plataforma"
   - Clique em um usuário e mostre os metadados (`nome`, `tipo`)

2. **Mostre o KV Store**
   - Vá para: Table Editor → `kv_store_2afcbce1`
   - "Esta é nossa tabela de armazenamento de dados"
   - Mostre os diferentes tipos de chave:
     - `usuario:{id}` - Dados dos usuários
     - `evento:{id}` - Dados dos eventos
     - `avaliacao:{id}` - Avaliações dos eventos
   - Clique em uma linha e mostre o JSON completo

3. **Execute uma Query SQL**
   - Vá para: SQL Editor
   - Cole e execute:
   ```sql
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
   - "Esta query mostra quantos registros temos de cada tipo"

---

### **PARTE 4: Demonstração de Exclusão (2 min)**

1. **Cadastre um usuário de teste**
   - Faça logout
   - Cadastre:
     - Nome: `Usuário Teste`
     - E-mail: `teste@delete.com`
     - Senha: `teste123`
     - Tipo: **Cidadão**

2. **Faça login como admin novamente**
   - Use `professor@demo.com` / `demo123`

3. **Exclua o usuário de teste**
   - Vá para: Painel Admin → Usuários
   - Encontre "Usuário Teste"
   - Clique em "Excluir"
   - Confirme a exclusão
   - Mostre que o usuário sumiu da lista

4. **Mostre que foi excluído do Supabase**
   - Volte ao Supabase → Authentication → Users
   - Mostre que o usuário `teste@delete.com` não existe mais
   - Volte ao Table Editor e mostre que o registro foi removido

---

### **PARTE 5: Novas Funcionalidades - Avaliações, Chat e Notificações (4 min)**

1. **⭐ Sistema de Avaliações no Banco (NOVO!)** 
   - Vá em **Perfil** no menu lateral
   - Seção "Eventos Passados"
   - Clique em **"Avaliar"** em um evento não avaliado
   - Dê **5 estrelas** e escreva: "Evento excelente! Adorei a organização!"
   - Clique em **Enviar Avaliação**
   - **MOMENTO WOW:** Abra o Supabase Dashboard
   - Vá em **Table Editor** → `kv_store_2afcbce1`
   - Filtre ou procure por chaves começando com `avaliacao_`
   - **Mostre a avaliação salva no banco!** 📊
   - Diga: "Vejam: todos os dados da avaliação estão aqui - nota, comentário, usuário e data!"

2. **Sistema de Notificações**
   - Clique no **ícone de sino** (canto superior direito)
   - Mostre o painel de notificações
   - "O sistema envia notificações em tempo real sobre eventos e atualizações"
   - Marque algumas como lidas
   - Mostre a funcionalidade "Marcar todas como lidas"

3. **💬 Chat/Fórum Funcionando**
   - Clique em **Chat/Fórum** no menu lateral
   - Mostre os canais temáticos: geral, festival-rec-beat, projetos-culturais, etc.
   - Selecione o canal **#geral**
   - Envie mensagens de teste
   - "O chat funciona perfeitamente e as mensagens ficam salvas"
   - Explique: "Está em modo local, mas a arquitetura permite migração fácil ao banco de dados"

---

### **PARTE 6: Relatórios e Projetos - Admin (2 min)**

1. **Sistema de Relatórios**
   - No menu lateral, clique em **Relatórios**
   - "Apenas administradores têm acesso a este módulo"
   - Mostre os cards com estatísticas: Total de Eventos, Usuários, Avaliações
   - Mostre o gráfico de **Crescimento Mensal**
   - Mostre a lista de **Eventos Mais Populares**
   - Mostre a **Distribuição por Categoria** com barras de progresso
   - Clique em **Exportar CSV** para demonstrar
   - "Administradores podem exportar dados para análise externa"

2. **Módulo de Projetos Conjuntos**
   - No menu lateral, clique em **Projetos**
   - "Este módulo gerencia projetos culturais colaborativos"
   - Mostre os projetos existentes com:
     - Status: Em Andamento, Planejamento, Concluído
     - Barra de progresso
     - Orçamento e equipe
   - Clique em **Novo Projeto**
   - Mostre o formulário completo:
     - Título, descrição, categoria
     - Datas de início e fim
     - Orçamento
     - Equipe
   - "Cada projeto pode ser acompanhado do planejamento até a conclusão"

---

### **PARTE 7: Modo Cidadão (1 min - opcional)**

1. **Faça logout e cadastre um cidadão**
   - Nome: `Maria Cidadã`
   - E-mail: `maria@cidada.com`
   - Senha: `maria123`
   - Tipo: **Cidadão**

2. **Mostre a interface de cidadão**
   - "Cidadãos podem visualizar eventos, favoritar e avaliar"
   - Mostre a navegação: Eventos, Roteiros, Chat/Fórum, Perfil
   - Destaque que cidadãos **também têm acesso ao chat**
   - Cidadãos **recebem notificações** mas não acessam Relatórios ou Projetos
   - Mostre um evento e a opção de avaliar

---

## 🎤 Pontos-Chave para Mencionar

### **Durante a Apresentação:**

1. **Tecnologias Utilizadas**
   - "Frontend: React com TypeScript e Tailwind CSS v4"
   - "Backend: Supabase Edge Functions (Deno)"
   - "Banco de Dados: PostgreSQL (gerenciado pelo Supabase)"
   - "Autenticação: Supabase Auth com JWT"
   - "Tempo Real: Supabase Realtime Subscriptions"

2. **Decisões de Design**
   - "Escolhemos Supabase por ser escalável e não precisar gerenciar servidor"
   - "Usamos KV Store para flexibilidade no armazenamento"
   - "Todos os nomes de campos estão em português para facilitar manutenção"
   - "Chat em tempo real usando subscriptions WebSocket"

3. **Segurança**
   - "Apenas admins podem criar eventos e gerenciar usuários"
   - "Relatórios e Projetos são exclusivos para administradores"
   - "Todas as rotas protegidas verificam o token JWT"
   - "Service Role Key fica apenas no backend, nunca no frontend"
   - "Row Level Security (RLS) nas tabelas do chat"
   - "Usuários não podem se excluir a si mesmos"

4. **Funcionalidades Especiais**
   - "Chat/Fórum com mensagens em tempo real salvas no banco"
   - "Sistema de notificações com badges de contador"
   - "Analytics completo com gráficos e exportação CSV/PDF"
   - "Módulo de gestão de projetos culturais"
   - "Exclusão em cascata: ao excluir usuário, suas avaliações também são removidas"
   - "Sistema de níveis de acesso (admin vs cidadão)"
   - "Interface responsiva para mobile e desktop"
   - "Dark/Light mode com persistência"

---

## 🔧 Troubleshooting

### **Se algo der errado:**

**Problema:** Erro ao cadastrar usuário
- **Solução**: Verifique se o e-mail já existe no sistema

**Problema:** Erro 401 ao criar evento
- **Solução**: Faça logout e login novamente para renovar o token

**Problema:** Dados não aparecem no Supabase
- **Solução**: Atualize a página do Supabase (F5)

**Problema:** Não consigo excluir usuário
- **Solução**: Verifique se não está tentando excluir sua própria conta

---

## 📊 Dados de Exemplo para Criar

### **Usuário Admin:**
- Nome: `Professor Demo`
- E-mail: `professor@demo.com`
- Senha: `demo123`
- Tipo: Administrador

### **Usuário Cidadão:**
- Nome: `Maria Cidadã`
- E-mail: `maria@cidada.com`
- Senha: `maria123`
- Tipo: Cidadão

### **Usuário para Deletar:**
- Nome: `Usuário Teste`
- E-mail: `teste@delete.com`
- Senha: `teste123`
- Tipo: Cidadão

### **Evento de Exemplo:**
- Título: `Workshop de Frevo - Demo Professor`
- Categoria: `Música`
- Local: `Paço do Frevo`
- Data: `2025-11-15`
- Horário: `14:00`
- Descrição: `Workshop demonstrativo sobre a história e prática do frevo pernambucano`

---

## ⏱️ Cronometragem Recomendada

| Seção | Tempo |
|-------|-------|
| Apresentação Inicial | 2 min |
| Funcionalidades Admin | 4 min |
| Banco de Dados | 3 min |
| Demonstração Exclusão | 2 min |
| Avaliações, Chat e Notificações | 4 min |
| Relatórios e Projetos | 2 min |
| Modo Cidadão (opcional) | 1 min |
| **TOTAL** | **18 min** |

---

## ✅ Checklist Final

Antes de terminar a apresentação, certifique-se de ter mostrado:

- [ ] Tela de cadastro e login
- [ ] Painel administrativo
- [ ] Criação de evento
- [ ] Lista de usuários
- [ ] Exclusão de usuário
- [ ] Supabase Authentication
- [ ] **⭐ Avaliações salvas no banco de dados** (NOVO!)
- [ ] **Sistema de Notificações** ⭐
- [ ] **Chat/Fórum Funcionando** ⭐
- [ ] **Sistema de Relatórios com gráficos** ⭐
- [ ] **Módulo de Projetos Conjuntos** ⭐
- [ ] Exportação de dados CSV
- [ ] **Mostrar avaliação no Supabase Dashboard** 🎯
- [ ] Supabase Table Editor (KV Store)
- [ ] Query SQL
- [ ] Logs de requisições (DevTools)
- [ ] Interface de cidadão (opcional)

---

## 🎯 Frase de Fechamento Sugerida

> "O Integra Recife demonstra como podemos criar uma aplicação web moderna, segura e escalável usando tecnologias atuais como React, TypeScript e Supabase. A arquitetura escolhida permite que a plataforma cresça conforme a demanda, mantendo a performance e a segurança dos dados dos usuários. O sistema de banco de dados em português facilita a manutenção e futuras expansões do projeto."

---

**Boa sorte na apresentação! 🚀**
