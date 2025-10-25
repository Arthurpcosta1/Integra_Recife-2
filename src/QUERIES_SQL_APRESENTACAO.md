# 📊 Queries SQL para Apresentação

## Queries Rápidas e Impressionantes

### 1. Estatísticas Gerais

```sql
-- Ver total de usuários por tipo
SELECT 
  raw_user_meta_data->>'tipo' as tipo_usuario,
  COUNT(*) as total
FROM auth.users
GROUP BY tipo_usuario;
```

**Use quando:** Quiser mostrar quantos admins e cidadãos existem.

---

### 2. Mensagens do Chat

```sql
-- Ver últimas mensagens do chat com detalhes
SELECT 
  m.usuario_nome,
  m.conteudo,
  c.nome as canal,
  m.criado_em
FROM mensagens_chat m
JOIN canais_chat c ON m.canal_id = c.id
ORDER BY m.criado_em DESC
LIMIT 10;
```

**Use quando:** Quiser mostrar o histórico completo do chat.

---

### 3. Canais Mais Ativos

```sql
-- Ranking de canais por número de mensagens
SELECT 
  c.nome as canal,
  c.descricao,
  COUNT(m.id) as total_mensagens
FROM canais_chat c
LEFT JOIN mensagens_chat m ON c.id = m.canal_id
GROUP BY c.id, c.nome, c.descricao
ORDER BY total_mensagens DESC;
```

**Use quando:** Quiser mostrar qual canal tem mais interação.

---

### 4. Usuários Mais Ativos no Chat

```sql
-- Top usuários que mais enviam mensagens
SELECT 
  usuario_nome,
  COUNT(*) as total_mensagens,
  MAX(criado_em) as ultima_mensagem
FROM mensagens_chat
GROUP BY usuario_nome
ORDER BY total_mensagens DESC
LIMIT 5;
```

**Use quando:** Quiser mostrar engajamento dos usuários.

---

### 5. Dados do KV Store (Eventos e Avaliações)

```sql
-- Ver todos os registros por tipo
SELECT 
  key,
  CASE 
    WHEN key LIKE 'evento_%' THEN 'Evento'
    WHEN key LIKE 'avaliacao_%' THEN 'Avaliação'
    WHEN key LIKE 'user_%' THEN 'Usuário'
    ELSE 'Outro'
  END as tipo,
  value->>'titulo' as titulo,
  created_at
FROM kv_store_2afcbce1
ORDER BY created_at DESC
LIMIT 10;
```

**Use quando:** Quiser mostrar a estrutura do KV Store.

---

### 6. Timeline de Atividades

```sql
-- Últimas atividades no sistema
SELECT 
  'Chat' as tipo,
  usuario_nome as usuario,
  conteudo as acao,
  criado_em as data
FROM mensagens_chat
ORDER BY criado_em DESC
LIMIT 5;
```

**Use quando:** Quiser mostrar atividade recente.

---

### 7. Mensagens Fixadas

```sql
-- Ver mensagens fixadas em todos os canais
SELECT 
  c.nome as canal,
  m.usuario_nome,
  m.conteudo,
  m.criado_em
FROM mensagens_chat m
JOIN canais_chat c ON m.canal_id = c.id
WHERE m.fixada = true
ORDER BY m.criado_em DESC;
```

**Use quando:** Quiser mostrar mensagens importantes.

---

### 8. Análise de Crescimento

```sql
-- Novos usuários por dia (últimos 7 dias)
SELECT 
  DATE(created_at) as data,
  COUNT(*) as novos_usuarios
FROM auth.users
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY data DESC;
```

**Use quando:** Quiser mostrar crescimento da plataforma.

---

### 9. Verificar Integridade

```sql
-- Verificar se todas as mensagens têm canal válido
SELECT 
  COUNT(*) as total_mensagens,
  COUNT(DISTINCT canal_id) as canais_unicos,
  COUNT(CASE WHEN canal_id IS NULL THEN 1 END) as mensagens_orfas
FROM mensagens_chat;
```

**Use quando:** Quiser mostrar integridade referencial.

---

### 10. Detalhes Completos de um Canal

```sql
-- Ver tudo sobre um canal específico
SELECT 
  c.nome,
  c.descricao,
  c.tipo,
  COUNT(m.id) as total_mensagens,
  COUNT(DISTINCT m.usuario_id) as usuarios_unicos,
  MAX(m.criado_em) as ultima_mensagem
FROM canais_chat c
LEFT JOIN mensagens_chat m ON c.id = m.canal_id
WHERE c.nome = 'geral'
GROUP BY c.id, c.nome, c.descricao, c.tipo;
```

**Use quando:** Quiser análise detalhada de um canal.

---

## 🎯 Queries para Demonstração ao Vivo

### Query 1: Mais Simples (Para Começar)
```sql
-- Ver todos os canais
SELECT * FROM canais_chat;
```

### Query 2: Intermediária (Para Impressionar)
```sql
-- Ver mensagens com nome do canal
SELECT 
  m.usuario_nome,
  c.nome as canal,
  m.conteudo,
  m.criado_em
FROM mensagens_chat m
JOIN canais_chat c ON m.canal_id = c.id
ORDER BY m.criado_em DESC
LIMIT 5;
```

### Query 3: Avançada (Para Mostrar Domínio)
```sql
-- Estatísticas completas do chat
SELECT 
  c.nome as canal,
  COUNT(m.id) as mensagens,
  COUNT(DISTINCT m.usuario_id) as usuarios,
  MIN(m.criado_em) as primeira_msg,
  MAX(m.criado_em) as ultima_msg
FROM canais_chat c
LEFT JOIN mensagens_chat m ON c.id = m.canal_id
GROUP BY c.id, c.nome
ORDER BY mensagens DESC;
```

---

## 💡 Dicas de Apresentação

### Ao Executar Queries:

1. **Fale antes de executar:**
   > "Agora vou mostrar uma query que traz todas as mensagens do chat com o nome dos canais..."

2. **Execute com confiança:**
   - Clique em "Run"
   - Aguarde o resultado
   - Não se apresse

3. **Explique o resultado:**
   > "Vejam: aqui temos as últimas 5 mensagens, com o nome do usuário, canal e horário."

4. **Destaque os detalhes:**
   > "Notem que usamos JOIN para relacionar mensagens com canais. Isso é SQL puro!"

---

## 🔧 Queries de Manutenção (Usar APENAS em Emergência)

### Limpar todas as mensagens de teste:
```sql
DELETE FROM mensagens_chat 
WHERE usuario_nome LIKE '%Teste%';
```

### Resetar um canal:
```sql
DELETE FROM mensagens_chat 
WHERE canal_id = (SELECT id FROM canais_chat WHERE nome = 'geral');
```

### Inserir mensagem de demonstração:
```sql
INSERT INTO mensagens_chat (canal_id, usuario_id, usuario_nome, usuario_avatar, conteudo)
VALUES (
  (SELECT id FROM canais_chat WHERE nome = 'geral' LIMIT 1),
  'demo@example.com',
  'Usuário Demo',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  'Esta é uma mensagem de demonstração!'
);
```

---

## 📚 Explicações para o Professor

### Se perguntarem sobre:

**"Por que usar JOIN?"**
> "Para garantir integridade referencial e evitar duplicação de dados. Cada mensagem referencia um canal através de chave estrangeira."

**"Por que PostgreSQL?"**
> "É enterprise-grade, open-source, suporta JSON nativo e tem excelente performance. Usado por empresas como Instagram e Uber."

**"Como funciona o tempo real?"**
> "Usamos Supabase Realtime, que implementa WebSocket sobre PostgreSQL usando triggers e notify/listen."

**"E a escalabilidade?"**
> "O Supabase gerencia automaticamente. Usa connection pooling, replica reads e pode escalar horizontalmente."

---

## ✅ Checklist de Queries

Antes da apresentação, teste estas queries:

- [ ] Query de canais funciona
- [ ] Query de mensagens funciona
- [ ] JOIN funciona corretamente
- [ ] Estatísticas mostram dados reais
- [ ] Nenhuma query dá erro

---

**Lembre-se:** Mostre que você entende SQL de verdade! 🚀
