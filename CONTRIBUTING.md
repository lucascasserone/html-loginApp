# Arquitetura & Contribuição

> Guia técnico para entender e contribuir com o Heuriskien

## 🏗️ Arquitetura Geral

```
┌─────────────────────────────────────┐
│    GitHub Pages (Frontend)          │
│  - index-refatorado.html            │
│  - css/styles.css                   │
│  - Sem build backend                │
└────────────────┬────────────────────┘
                 │
                 ↓ REST API (CORS)
┌─────────────────────────────────────┐
│    Supabase (Backend)               │
│  - PostgreSQL (dados)               │
│  - Auth (autenticação)              │
│  - RLS Policies (segurança)         │
│  - Realtime (opcional)              │
└─────────────────────────────────────┘
```

## 📁 Estrutura de Arquivos

```
autopilot/
├── index-refatorado.html      ← Main app (único arquivo HTML)
├── css/
│   └── styles.css             ← Estilos Tailwind + customizações
├── js/
│   ├── app.js                 ← Lógica principal (modular)
│   ├── config.js              ← Configurações e constantes
│   ├── supabase.js            ← Client Supabase
│   ├── utils.js               ← Helpers/utilities
│   └── cache.js               ← Cache manager (localStorage)
├── .env.example               ← Template de vars de ambiente
├── .gitignore                 ← Git exclusões
├── README.md                  ← Documentação principal
├── SETUP.md                   ← Instalação e setup
├── DEPLOY.md                  ← Deploy GitHub Pages
├── TROUBLESHOOTING.md         ← Resolução de problemas
└── CHANGELOG.md               ← Histórico de versões
```

## 🔄 Fluxo de Dados

### 1. Inicialização
```javascript
index-refatorado.html carrega
    ↓
Alpine.js pronto → x-init chamado
    ↓
systemCore() inicia
    ↓
init() função rodada
    ↓
Supabase.createClient()
    ↓
Verifica sessão/autenticação
    ↓
Se logado: loadInitialData()
Se não: mostra login
    ↓
initialized = true (remove splash)
```

### 2. Carregamento de Dados
```javascript
loadInitialData()
    ├── Verifica cache (localStorage)
    ├── Se tem cache: mostra rápido
    ├── Faz queries paralelas:
    │   ├── loadProfile()
    │   ├── loadReports()
    │   ├── loadUsers()
    │   └── loadNews()
    └── Se admin: loadAuditLogs()
```

### 3. Operação CRUD
```javascript
User clica "Salvar"
    ↓
Modal valida inputs → isValidEmail/isValidUrl
    ↓
Supabase insert/update/delete
    ↓
Limpa cache local
    ↓
Recarrega dados (loadInitialData)
    ↓
Mostra mensagem sucesso

[Erro?] → Mostra Swal.fire() com mensagem
```

## 🧩 Componentes Principais

### Alpine.js Store (`systemCore()`)

**Estado Reativo:**
- `view` - Login ou Dashboard
- `tab` - Aba ativa (news, reports, users, etc)
- `theme` - Tema visual
- `reportsList`, `usersList`, `auditLogs` - Dados

**Métodos:**
- `init()` - Setup inicial
- `handleLogin()` - Autenticação
- `loadInitialData()` - Carrega dados
- `saveReport()` - Cria/edita relatório
- `deleteUser()` - Remove usuário
- etc...

> Reatividade = Toda mudança em `this.*` atualiza o DOM

### Supabase Client

```javascript
supabaseClient.auth.signInWithPassword(...)
supabaseClient.from('table').select('*')
supabaseClient.from('table').insert([...])
supabaseClient.from('table').update(...).eq(...)
supabaseClient.from('table').delete().eq(...)
```

### Cache Manager (localStorage)

```javascript
// Salva dados
localStorage.setItem('cache_reports', JSON.stringify(data))

// Recupera
JSON.parse(localStorage.getItem('cache_reports'))

// Limpa
localStorage.removeItem('cache_reports')
```

**TTL (Time To Live):**
- Profiles: 1 hora
- Reports/Users: 30 min
- News: 10 min
- Audit: 5 min

## 🎨 Estilos

### Temas
```css
.theme-dark { --bg: #030712; --text: #f9fafb; ... }
.theme-light { --bg: #f8fafc; ... }
.theme-glass { --bg: radial-gradient(...); ... }
```

**Uso no HTML:**
```html
:class="'theme-' + theme" → <body class="theme-dark">
```

### Componentes Reutilizáveis

**Glass Container**
```html
<div class="glass-container">
    <!-- Fundo desfocado + blur -->
</div>
```

**Input Premium**
```html
<input class="input-premium"> 
    <!-- Bordas finas, sem fundo sólido -->
```

**Botão com estados**
```html
<button :disabled="isLoading" 
    x-text="isLoading ? 'Salvando...' : 'Salvar'">
```

## 🔐 Segurança

### RLS (Row Level Security)

Controla quem vê/edita o quê:

```sql
-- Exemplo: Admin vê tudo, usuário vê só ele
CREATE POLICY users_select_admin_all ON public.acessTable
    FOR SELECT
    USING (
        auth.jwt() ->> 'email' IN (SELECT email FROM acessTable WHERE cargo = 'CEO')
    );
```

### Credenciais

- **Chave anon:** PUBLIC ok, usa RLS
- **Service role:** PRIVATE, nunca exponha
- **JWT token:** Armazenado seguro pelo Supabase

### CORS

```javascript
// Apenas URLs registradas podem acessar
// GitHub Pages → Settings → API → CORS

https://seu-username.github.io  ← Add isso
```

## 🚀 Como Contribuir

### 1. Fork & Clone

```bash
git clone seu-repo-fork
cd autopilot
```

### 2. Criar Feature Branch

```bash
git checkout -b feature/nova-funcionalidade
```

### 3. Fazer Mudanças

**Em HTML:**
- Adicione novo elemento em `<template>`
- Adicione estado em `systemCore()`
- Adicione método para lógica

**Em CSS:**
- Estenda classes existentes
- Use variáveis CSS: `var(--bg)`, `var(--text)`
- Teste em ambos os temas

### 4. Testar

```bash
# Localmente
open index-refatorado.html

# Do GitHub Pages
# Espere 5 min após push
# https://seu-username.github.io
```

### 5. Commit & Push

```bash
git add .
git commit -m "feat: adiciona dark mode/dark theme fixes #123"
git push origin feature/nova-funcionalidade
```

### 6. Pull Request

- Descreva mudanças
- Screenshots/GIFs se UI changes
- Referencie issue: `Fixes #123`

## 📝 Padrões de Código

### Nomenclatura

```javascript
// Variáveis: camelCase
const userEmail = '...'
let isLoading = false

// Funções: camelCase + verbo
async handleLogin() {}
function formatDateTime(date) {}

// Classes/Componentes: PascalCase
class CacheManager {}

// Constantes: UPPER_SNAKE_CASE
const MAX_RETRIES = 3
const API_URL = '...'
```

### Tratamento de Erros

```javascript
// Sempre capture erros
try {
    await risky_operation()
} catch (err) {
    console.error('Contexto:', err)
    // Mostre ao usuário
    Swal.fire('Erro', err.message, 'error')
}

// Use error boundaries
const msg = err?.message?.includes('unique')
    ? 'Email já existe'
    : err?.message || 'Erro desconhecido'
```

### Async/Await

```javascript
// Boa prática: sempre async se usa await
async saveData() {
    try {
        this.isLoading = true
        await supabaseClient.from('table').insert(...)
    } finally {
        this.isLoading = false
    }
}
```

## 🐛 Debug

### Console Logging

```javascript
console.log('✅ Sucesso:', data)         // Info
console.warn('⚠️ Aviso:', message)       // Warning
console.error('❌ Erro:', error)         // Error
```

### Breakpoints no Browser

```javascript
// F12 → Sources → clique na linha
// Ao executar para ali e inspecione estado
debugger;  // ou coloque isso no código
```

### Network Tab

```
F12 → Network → veja requisições
- Status 200 OK?
- Response JSON válido?
- Headers CORS configurados?
```

## 🔄 Deployment Pipeline

```
git push origin main
    ↓
GitHub Actions (opcional, futuro)
    ↓
GitHub Pages build automático
    ↓
https://seu-username.github.io atualiza
    ↓
(5-10 min de demora)
```

## 📚 Recursos Desenvolvedor

| Tema | Link |
|------|------|
| Alpine.js | https://alpinejs.dev/start-here |
| Tailwind CSS | https://tailwindcss.com/docs |
| Supabase | https://supabase.com/docs |
| Git | https://git-scm.com/doc |
| MDN Web Docs | https://developer.mozilla.org |

## ✅ Checklist PR

- [ ] Código segue padrões do projeto
- [ ] Sem console.log de debug (ou apenas warns/errors)
- [ ] Testado em Chrome + Firefox + Safari
- [ ] Testado responsividade (mobile + desktop)
- [ ] Sem hard-coded strings (use pt-BR)
- [ ] Erros tratados com try/catch
- [ ] Loading states implementados
- [ ] Descrição clara do PR
- [ ] Referenciar issue se houver

---

**Dúvidas?** Abra uma discussão ou issue no repositório! 🎉

