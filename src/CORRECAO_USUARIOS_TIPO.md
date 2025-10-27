# 🚨 CORREÇÃO - Tipo de Usuários Inválido

## Problema
Erro ao criar usuário: `violates check constraint "usuarios_tipo_check"`

```
{
  "code": "23514",
  "details": null,
  "hint": null,
  "message": "new row for relation \"usuarios\" violates check constraint \"usuarios_tipo_check\""
}
```

---

## Causa
A tabela `usuarios` tem um check constraint que só aceita dois tipos:
- ✅ `'admin'` - Administradores
- ✅ `'cidadao'` - Cidadãos (usuários comuns)

Qualquer outro valor (como `'usuario'`, `'user'`, etc.) é **rejeitado** pelo banco.

---

## ✅ SOLUÇÃO RÁPIDA

### Opção 1: Limpar Usuários Inválidos (Se houver)

Execute no SQL Editor do Supabase:

```sql
-- Converter tipos inválidos para 'cidadao'
UPDATE usuarios
SET tipo = 'cidadao',
    atualizado_em = NOW()
WHERE tipo NOT IN ('admin', 'cidadao');

-- Verificar
SELECT tipo, COUNT(*) FROM usuarios GROUP BY tipo;
```

### Opção 2: Script Completo de Correção

Execute o arquivo: `/database/fix-usuarios-tipo.sql`

Este script irá:
1. ✅ Listar usuários com tipos inválidos
2. ✅ Contar usuários por tipo
3. ✅ Corrigir automaticamente tipos inválidos
4. ✅ Verificar se a correção funcionou

---

## 🔍 Como Verificar

```sql
-- Todos os usuários devem ter apenas 'admin' ou 'cidadao'
SELECT DISTINCT tipo FROM usuarios;

-- Resultado esperado:
-- admin
-- cidadao
```

---

## 🎯 O Que Foi Corrigido no Código

### 1. Validação no Login (`/App.tsx`)

Adicionamos validação para garantir que apenas tipos válidos sejam aceitos:

```typescript
// Validar e normalizar o tipo de usuário
let tipoUsuario: 'admin' | 'cidadao' = userData.type;
if (tipoUsuario !== 'admin' && tipoUsuario !== 'cidadao') {
  console.warn(`⚠️ Tipo de usuário inválido: "${tipoUsuario}". Usando "cidadao" como padrão.`);
  tipoUsuario = 'cidadao';
}
```

### 2. Parser de Datas (`/components/CalendarScreen.tsx`)

Adicionamos suporte para meses em minúscula:

```typescript
const months: { [key: string]: number } = {
  'janeiro': 0, 'fevereiro': 1, 'março': 2, ...,
  'Janeiro': 0, 'Fevereiro': 1, 'Março': 2, ...
};
```

Isso resolve os erros:
- ❌ "Formato de data não reconhecido: 7 de novembro de 2005"
- ❌ "Formato de data não reconhecido: 29 de março de 2025"
- ❌ "Formato de data não reconhecido: 29 de outubro de 2025"

---

## 📚 Referência

### Schema da Tabela

```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('admin', 'cidadao')),
  ...
);
```

### Tipos Permitidos

| Tipo | Descrição | Permissões |
|------|-----------|------------|
| `admin` | Administrador | Criar eventos, roteiros, gerenciar usuários |
| `cidadao` | Cidadão | Visualizar eventos, favoritar, avaliar |

---

## ⚠️ Importante

- Sempre use `'admin'` ou `'cidadao'` (com acento)
- Não use `'usuario'`, `'user'`, ou qualquer outro valor
- O TypeScript já valida isso no código, mas é bom verificar o banco

---

**Data:** 27 de Outubro de 2025  
**Status:** ✅ Correções aplicadas no código
