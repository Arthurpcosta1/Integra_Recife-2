# 🗄️ Scripts SQL do Banco de Dados

Esta pasta contém os scripts SQL para criar as tabelas do banco de dados Supabase em **português**.

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

### Opção 1: Via SQL Editor do Supabase (Recomendado)

1. **Abra o arquivo** que deseja executar:
   - Para sistema completo: `schema-completo.sql`
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

### No Supabase:
```sql
-- Ver tabelas criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Ver canais criados
SELECT nome, tipo FROM canais_chat;
```

### Na Aplicação:
1. Vá em: Admin → Config. Banco
2. Clique em: **Testar Conexão**
3. Deve aparecer: "✅ Banco de dados configurado com sucesso!"

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
