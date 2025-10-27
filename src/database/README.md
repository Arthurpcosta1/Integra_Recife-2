# 🗄️ Scripts SQL do Banco de Dados

Esta pasta contém os scripts SQL para criar as tabelas do banco de dados Supabase em **português**.

---

## 🚨 CORREÇÕES URGENTES

### 🔧 Problema 1: Erro ao Criar Roteiros

Execute este comando único:

```sql
-- CORREÇÃO COMPLETA (RLS + Foreign Key)
ALTER TABLE roteiros_turisticos DISABLE ROW LEVEL SECURITY;
ALTER TABLE pontos_interesse DISABLE ROW LEVEL SECURITY;
ALTER TABLE roteiros_turisticos DROP CONSTRAINT IF EXISTS roteiros_turisticos_usuario_criador_fkey;
ALTER TABLE roteiros_turisticos ADD CONSTRAINT roteiros_turisticos_usuario_criador_fkey FOREIGN KEY (usuario_criador) REFERENCES usuarios(id) ON DELETE CASCADE;
```

**Erros que isso corrige:**
- ❌ `violates row-level security policy` 
- ❌ `violates foreign key constraint`
- ❌ `Key (...) is not present in table "users"`

📚 Detalhes: `/CORRECAO_ROTEIROS_URGENTE.md`

---

### 🔧 Problema 2: Erro ao Criar Usuários

Execute este comando:

```sql
-- Corrigir usuários com tipo inválido
UPDATE usuarios SET tipo = 'cidadao', atualizado_em = NOW()
WHERE tipo NOT IN ('admin', 'cidadao');
```

**Erros que isso corrige:**
- ❌ `violates check constraint "usuarios_tipo_check"`
- ❌ Formato de data não reconhecido

📚 Detalhes: `/CORRECAO_USUARIOS_TIPO.md`

---

## 📁 Arquivos Disponíveis

### 1. `schema-completo.sql` ⭐ **RECOMENDADO**
**O que contém:**
- ✅ Todas as 10 tabelas do sistema
- ✅ Relacionamentos entre tabelas (Foreign Keys)
- ✅ Índices para performance
- ✅ Políticas RLS (segurança)
- ✅ Triggers automáticos
- ✅ Views para relatórios
- ✅ Dados iniciais (5 canais de chat)

**Quando usar:**
- ✅ Primeira vez configurando o banco
- ✅ Quer todas as funcionalidades da plataforma
- ✅ Apresentação completa do projeto

**Tabelas criadas:**
1. `usuarios` - Usuários da plataforma
2. `eventos` - Eventos do Recife
3. `favoritos` - Eventos favoritados
4. `avaliacoes` - Avaliações de eventos
5. `projetos` - Projetos conjuntos
6. `membros_projeto` - Equipes dos projetos
7. `canais_chat` - Canais de discussão
8. `mensagens_chat` - Mensagens dos usuários
9. `notificacoes` - Notificações em tempo real
10. `inscricoes` - Inscrições em eventos

---

### 3. `schema-roteiros.sql` 🗺️ **ROTEIROS TURÍSTICOS**
**O que contém:**
- ✅ Tabela `roteiros_turisticos` - Roteiros temáticos
- ✅ Tabela `pontos_interesse` - Pontos de cada roteiro
- ✅ Funções de incremento de visualizações
- ✅ Triggers automáticos
- ✅ RLS DESABILITADO (compatível com auth customizada)

**Quando usar:**
- ✅ Para adicionar funcionalidade de roteiros turísticos (RF10)
- ✅ Funciona com autenticação customizada da aplicação

**Execute após `schema-completo.sql`**

---

### 4. `funcoes-roteiros.sql` 🔧 **FUNÇÕES DOS ROTEIROS**
**O que contém:**
- ✅ `increment_tour_views()` - Contagem de visualizações
- ✅ `get_tour_statistics()` - Estatísticas gerais
- ✅ `search_tours()` - Busca de roteiros

**Quando usar:**
- ✅ Após executar `schema-roteiros.sql`
- ✅ Adiciona funcionalidades avançadas

---

### 5. `fix-roteiros-rls.sql` 🔧 **CORREÇÃO DE RLS**
**O que contém:**
- ✅ Desabilita RLS nas tabelas de roteiros
- ✅ Remove políticas antigas problemáticas
- ✅ Script de verificação e teste

**Quando usar:**
- 🚨 Erro: `violates row-level security policy`

---

### 6. `fix-roteiros-foreign-key.sql` 🔧 **CORREÇÃO DE FOREIGN KEY**
**O que contém:**
- ✅ Remove constraint antiga que aponta para `auth.users`
- ✅ Cria constraint nova que aponta para `usuarios`
- ✅ Testes de verificação

**Quando usar:**
- 🚨 Erro: `violates foreign key constraint`
- 🚨 Erro: `Key (...) is not present in table "users"`

---

### 7. `verificar-roteiros.sql` 🔍 **DIAGNÓSTICO COMPLETO**
**O que contém:**
- ✅ Verifica se tabelas existem
- ✅ Verifica status do RLS
- ✅ Verifica foreign keys
- ✅ Verifica estrutura das tabelas
- ✅ Mostra estatísticas de usuários e roteiros
- ✅ Lista políticas RLS ativas

**Quando usar:**
- 🔍 Para diagnosticar qualquer problema
- 🔍 Para verificar se tudo está configurado corretamente
- 🔍 Antes de apresentar o projeto

---

### 8. `fix-usuarios-tipo.sql` 🔧 **CORREÇÃO DE TIPOS DE USUÁRIOS**
**O que contém:**
- ✅ Lista usuários com tipos inválidos
- ✅ Corrige tipos diferentes de 'admin' ou 'cidadao'
- ✅ Converte automaticamente para 'cidadao'
- ✅ Verifica se a correção funcionou

**Quando usar:**
- 🚨 Erro: `violates check constraint "usuarios_tipo_check"`
- 🚨 Usuários não conseguem fazer login

---

### 2. `chat-tables.sql`
**O que contém:**
- ✅ Apenas 2 tabelas: `canais_chat` e `mensagens_chat`
- ✅ Políticas RLS básicas
- ✅ Dados iniciais dos canais

**Quando usar:**
- ⚠️ Apenas se você quer implementar somente o chat
- ⚠️ Não recomendado para o projeto completo

**Tabelas criadas:**
1. `canais_chat`
2. `mensagens_chat`

---

## 🚀 Como Usar

### Setup Inicial Completo (Recomendado)

Execute nesta ordem no SQL Editor do Supabase:

1. **Primeiro**: `schema-completo.sql` (todas as tabelas principais)
2. **Segundo**: `schema-roteiros.sql` (tabelas de roteiros turísticos)
3. **Terceiro**: `funcoes-roteiros.sql` (funções dos roteiros)

---

### Opção 1: Via SQL Editor do Supabase (Recomendado)

1. **Abra o arquivo** que deseja executar:
   - Para sistema completo: `schema-completo.sql`
   - Para roteiros: `schema-roteiros.sql`
   - Para funções: `funcoes-roteiros.sql`
   - Para apenas chat: `chat-tables.sql`

2. **Copie TODO o conteúdo** do arquivo (`Ctrl+A` → `Ctrl+C`)

3. **Acesse o Supabase**:
   - Vá para: https://supabase.com/dashboard
   - Faça login
   - Selecione seu projeto

4. **Abra o SQL Editor**:
   - Menu lateral → **SQL Editor**
   - Clique em **New Query**

5. **Cole e Execute**:
   - Cole o conteúdo copiado
   - Clique em **Run** (ou `Ctrl+Enter`)
   - Aguarde a execução

6. **Verifique**:
   - Menu lateral → **Table Editor**
   - Confirme que as tabelas foram criadas

---

### 🚨 Se Tiver Erro ao Criar Roteiros

**Execute a correção completa:**

```sql
-- CORREÇÃO COMPLETA (RLS + Foreign Key)
ALTER TABLE roteiros_turisticos DISABLE ROW LEVEL SECURITY;
ALTER TABLE pontos_interesse DISABLE ROW LEVEL SECURITY;
ALTER TABLE roteiros_turisticos DROP CONSTRAINT IF EXISTS roteiros_turisticos_usuario_criador_fkey;
ALTER TABLE roteiros_turisticos ADD CONSTRAINT roteiros_turisticos_usuario_criador_fkey FOREIGN KEY (usuario_criador) REFERENCES usuarios(id) ON DELETE CASCADE;
```

Ou execute os arquivos:
- `fix-roteiros-rls.sql` (corrige RLS)
- `fix-roteiros-foreign-key.sql` (corrige foreign key)

---

### Opção 2: Via Interface da Aplicação

1. **Faça login** como administrador na aplicação
2. **Vá para**: Admin → **Config. Banco**
3. **Escolha o schema**: Chat ou Completo
4. **Copie o SQL** exibido
5. **Execute no Supabase** conforme instruções acima
6. **Volte e teste**: Clique em "Testar Conexão"

---

## ✅ Verificação

Após executar o script, verifique se funcionou:

### Diagnóstico Completo:
Execute o script: `verificar-roteiros.sql` para diagnóstico completo

Ou manualmente:

### No Supabase:
```sql
-- Ver tabelas criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar RLS dos roteiros
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('roteiros_turisticos', 'pontos_interesse');
-- Resultado esperado: rowsecurity = false ✅

-- Verificar Foreign Key
SELECT tc.table_name, kcu.column_name, ccu.table_name AS tabela_referenciada
FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
  JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'roteiros_turisticos';
-- Resultado esperado: tabela_referenciada = usuarios ✅

-- Ver canais criados
SELECT nome, tipo FROM canais_chat;
```

### Na Aplicação:
1. Vá em: Admin → Config. Banco
2. Clique em: **Testar Conexão**
3. Deve aparecer: "✅ Banco de dados configurado com sucesso!"
4. Tente criar um roteiro turístico
5. Deve funcionar sem erros! ✅

---

## 📚 Documentação

Para mais detalhes, consulte:

| Documento | Descrição |
|-----------|-----------|
| `/documentacao/GUIA_RAPIDO_BANCO.md` | Guia passo a passo simplificado |
| `/documentacao/ESTRUTURA_BANCO_COMPLETA.md` | Documentação técnica completa |
| `/documentacao/CHECKLIST_PORTUGUES.md` | Lista de verificação de tudo que foi traduzido |

---

## ⚠️ Importante

- ⚠️ **Execute apenas UMA VEZ**: O script tem `IF NOT EXISTS`, mas evite executar múltiplas vezes
- ⚠️ **Faça backup**: Se já tem dados, faça backup antes de executar
- ⚠️ **Não misture**: Use OU `schema-completo.sql` OU `chat-tables.sql`, não ambos
- ⚠️ **Em produção**: Ajuste as políticas RLS conforme necessário

---

## 🎯 Qual Escolher?

| Situação | Arquivo Recomendado |
|----------|---------------------|
| Primeira vez | `schema-completo.sql` ⭐ |
| Apresentação ao professor | `schema-completo.sql` ⭐ |
| Projeto completo | `schema-completo.sql` ⭐ |
| Apenas testando chat | `chat-tables.sql` |

---

## 🆘 Problemas?

### "relation already exists"
✅ Tudo bem! Significa que já está criado

### "permission denied"
❌ Execute o script novamente (vai recriar as políticas)

### Tabelas não aparecem
❌ Verifique se executou no projeto correto do Supabase

### Chat não funciona
❌ Verifique se os canais foram criados:
```sql
SELECT COUNT(*) FROM canais_chat;
```
Deve retornar: `5`

---

**Última atualização**: 20 de Outubro de 2025  
**Idioma**: 🇧🇷 Português  
**Versão**: 1.0
