# 📋 Explicação sobre Tabelas do Supabase

## ⚠️ Tabelas do Schema `auth` (Supabase)

### O que são?

As tabelas que você vê no schema `auth` são **tabelas do sistema do Supabase** usadas para autenticação e gerenciamento de usuários. Elas são:

- `audit_log_entries` - Log de auditoria de ações de usuários
- `flow_state` - Estado de fluxos de autenticação (OAuth, etc)
- `identities` - Identidades associadas a usuários (Google, GitHub, etc)
- `instances` - Gerenciamento de instâncias de usuários
- `mfa_amr_claims` - Claims de autenticação multifator
- `mfa_challenges` - Desafios de MFA
- `mfa_factors` - Fatores de MFA configurados
- `refresh_tokens` - Tokens de atualização
- `saml_providers` - Provedores SAML
- `saml_relay_states` - Estados de relay SAML
- `schema_migrations` - Migrações do schema auth
- `sessions` - Sessões ativas de usuários
- `sso_domains` - Domínios SSO
- `sso_providers` - Provedores SSO
- `users` - Usuários do sistema de autenticação

### ⚠️ Por que estão em inglês?

Estas tabelas **NÃO PODEM SER MODIFICADAS** porque:

1. ✋ São gerenciadas automaticamente pelo Supabase
2. 🔒 O schema `auth` é **read-only** (somente leitura) pelo dashboard
3. 🛡️ Modificá-las pode quebrar a autenticação da plataforma
4. 🌍 São tabelas padrão usadas globalmente pelo Supabase

### 📢 Mensagem no Dashboard

Quando você acessa o schema `auth`, o Supabase exibe:

> "The auth schema is managed by Supabase and is read-only through the dashboard."

Isso significa que você **não deve e não pode** alterar essas tabelas.

---

## ✅ Nossas Tabelas Customizadas (Schema `public`)

### O que são?

Essas são as tabelas que **NÓS criamos** para a aplicação de eventos do Recife. Todas estão no schema `public` e **estão 100% em português**:

| Tabela | Descrição |
|--------|-----------|
| `usuarios` | Perfis dos usuários da plataforma |
| `eventos` | Eventos culturais do Recife |
| `favoritos` | Eventos favoritados por usuários |
| `avaliacoes` | Avaliações e comentários de eventos |
| `projetos` | Projetos conjuntos entre organizadores |
| `membros_projeto` | Membros de cada projeto |
| `canais_chat` | Canais do sistema de chat/fórum |
| `mensagens_chat` | Mensagens enviadas nos canais |
| `notificacoes` | Notificações para usuários |
| `inscricoes` | Inscrições de usuários em eventos |
| `armazenamento_chave_valor` | Dados no formato chave-valor (KV Store) |

### ✅ Status da Tradução

✅ **100% em PORTUGUÊS**
- Todos os nomes de tabelas
- Todos os nomes de colunas
- Todos os valores de campos ENUM
- Todas as constraints
- Todos os índices
- Todas as políticas RLS

---

## 🔄 Diferença entre os Schemas

### Schema `auth` (Supabase)
- 🔒 **Read-only** (somente leitura)
- 🌍 **Em inglês** (padrão global)
- ⚙️ **Gerenciado pelo Supabase**
- 🛡️ **NÃO modificar**

### Schema `public` (Nossa aplicação)
- ✏️ **Editável** (podemos modificar)
- 🇧🇷 **100% em português**
- 👨‍💻 **Gerenciado por nós**
- ✅ **Totalmente customizável**

---

## 📊 Como Ver Nossas Tabelas no Dashboard

1. Acesse o Supabase Dashboard
2. Vá em **Table Editor**
3. No dropdown de schemas, selecione **`public`** em vez de `auth`
4. Você verá todas as nossas tabelas em português! 🇧🇷

---

## 🎯 Comandos SQL Úteis

### Ver todas as tabelas do schema public
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

### Ver todas as colunas de uma tabela
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'eventos'
AND table_schema = 'public'
ORDER BY ordinal_position;
```

### Ver todos os valores únicos de um campo
```sql
-- Ver tipos de canais
SELECT DISTINCT tipo FROM canais_chat;

-- Ver status de eventos
SELECT DISTINCT status FROM eventos;

-- Ver tipos de usuários
SELECT DISTINCT tipo FROM usuarios;
```

---

## 📝 Resumo

### ❌ NÃO SE PREOCUPE com as tabelas em inglês do schema `auth`
Elas são do Supabase e **devem permanecer assim**.

### ✅ FOQUE nas nossas tabelas do schema `public`
Essas sim estão **100% em português** e prontas para uso!

---

## 🎓 Para a Apresentação

Quando apresentar ao professor, explique:

1. **"As tabelas em inglês que aparecem são do sistema de autenticação do Supabase"**
   - São read-only e não podem ser modificadas
   - São padrão de todos os projetos que usam Supabase

2. **"Nossas tabelas customizadas estão 100% em português"**
   - Mostre o schema `public` no Table Editor
   - Demonstre as 11 tabelas em português
   - Mostre os valores dos campos também em português

3. **"Isso é uma boa prática"**
   - Separar tabelas do sistema (auth) das tabelas da aplicação (public)
   - Manter a integridade do sistema de autenticação
   - Ter controle total sobre nossos dados

---

## 📚 Referências

- [Documentação Supabase Auth](https://supabase.com/docs/guides/auth)
- [Schemas PostgreSQL](https://www.postgresql.org/docs/current/ddl-schemas.html)
- [Nosso Schema Completo](/database/schema-completo.sql)
