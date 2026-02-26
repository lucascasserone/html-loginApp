# 🚀 Heuriskien Enterprise - Documentação

> Plataforma de Inteligência Empresarial - v11.9

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Requisitos](#requisitos)
4. [Instalação](#instalação)
5. [Configuração](#configuração)
6. [Uso](#uso)
7. [API & Banco de Dados](#api--banco-de-dados)
8. [Best Practices Implementadas](#best-practices-implementadas)
9. [Roadmap](#roadmap)

---

## 🎯 Visão Geral

**Heuriskien** é uma plataforma web moderna para gestão empresarial com:

- ✅ **Autenticação segura** via Supabase
- ✅ **Gestão de relatórios** (Power BI integration)
- ✅ **Gestão de equipe** com roles
- ✅ **Trilha de auditoria** completa
- ✅ **Temas dinâmicos** (Dark, Light, Glass)
- ✅ **Interface responsiva** com Tailwind CSS
- ✅ **Validação robusta** e tratamento de erros
- ✅ **Performance otimizada** com debounce

---

## 📁 Estrutura do Projeto

```
autopilot/
├── index.html                 # Interface principal (versão original)
├── index-refatorado.html      # Interface refatorada (novo)
├── .env.example               # Variáveis de ambiente (exemplo)
├── .env.local                 # Variáveis de ambiente (não versionado)
├── .gitignore                 # Arquivos a ignorar no git
├── README.md                  # Este arquivo
│
├── css/
│   └── styles.css             # Estilos customizados
│
├── js/
│   ├── config.js              # Configurações globais
│   ├── utils.js               # Funções utilitárias
│   ├── supabase.js            # Cliente Supabase & helpers
│   └── app.js                 # Lógica principal (Alpine.js store)
│
└── docs/ (futuro)
    └── API.md                 # Documentação de API
```

---

## ⚙️ Requisitos

- **Node.js**: v16+ (para desenvolvimento futura)
- **Browser moderno**: Chrome, Firefox, Safari, Edge
- **Supabase Account**: Para backend & autenticação

---

## 📦 Instalação

### 1️⃣ Clone o repositório

```bash
git clone <seu-repositório>
cd autopilot
```

### 2️⃣ Configure variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite .env.local com suas credenciais
```

### 3️⃣ Abra no navegador

```bash
# Abra o arquivo HTML diretamente no navegador
# ou use um servidor local

# Com Python 3
python -m http.server 8000

# Com Node.js (http-server)
npx http-server

# Com VS Code
# Instale "Live Server" extension e click em "Go Live"
```

Acesse: `http://localhost:8000`

---

## 🔐 Configuração

### Variáveis de Ambiente (.env.local)

```bash
# SUPABASE
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-aqui

# APLICAÇÃO
VITE_APP_NAME=Heuriskien
VITE_APP_VERSION=11.9
VITE_API_TIMEOUT=10000
VITE_DEBOUNCE_DELAY=300

# AMBIENTE
VITE_ENVIRONMENT=development
```

### Configuração do Supabase

1. Crie conta em [supabase.io](https://supabase.io)
2. Crie uma nova organização e projeto
3. Copie URL e ANON KEY
4. Use as credenciais no `.env.local`

### Tabelas Necessárias

Execute os seguintes SGF SQL no Supabase:

```sql
-- Tabela de usuários/acesso
CREATE TABLE acessTable (
  email VARCHAR(255) PRIMARY KEY,
  nome_completo VARCHAR(255) NOT NULL,
  cargo VARCHAR(100),
  setor VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de relatórios
CREATE TABLE reportsTable (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(255) NOT NULL,
  area VARCHAR(100),
  link TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de notícias
CREATE TABLE newsTable (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  titulo VARCHAR(255) NOT NULL,
  conteudo TEXT NOT NULL,
  versao VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de logs de auditoria
CREATE TABLE audit_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  admin_email VARCHAR(255),
  acao VARCHAR(50),
  alvo TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📖 Uso

### Autenticação

```html
<!-- Login -->
<input type="email" x-model="email" required>
<input type="password" x-model="password" required>
<button @click="handleLogin()">Acessar Hub</button>

<!-- Recuperar Senha -->
<button @click="recoverPassword()">Esqueceu a senha?</button>

<!-- Fazer Logout -->
<button @click="handleLogout()">Sair</button>
```

### Gerenciar Relatórios

```javascript
// Abrir modal de criação
openReportModal('create');

// Abrir modal de edição
openReportModal('edit', reportData);

// Salvar relatório
saveReport();

// Deletar relatório
deleteReport(reportId);
```

### Gerenciar Usuários

```javascript
// Abrir modal de criação
openUserModal('create');

// Abrir modal de edição
openUserModal('edit', userData);

// Salvar usuário
saveUser();

// Deletar usuário
deleteUser(userEmail);
```

### Utilitários

```javascript
// Validação
isValidEmail('user@example.com');           // true
isValidUrl('https://example.com');          // true
isValidLength('text', 1, 100);              // true

// Formatação
formatDate(new Date());                     // "26/02/2026"
formatDateTime(new Date());                 // "26/02/2026, 14:30:45"

// Logging
log('success', 'Operação concluída');       // ✅ Operação concluída
log('error', 'Erro', error);                // ❌ Erro ...
```

---

## 🔌 API & Banco de Dados

### Supabase Client Methods

```javascript
// Autenticação
await db.signIn(email, password);
await db.signOut();
await db.getSession();
await db.resetPassword(email, redirectUrl);
await db.updatePassword(newPassword);

// Banco de Dados
await db.fetch(tableName, options);
await db.insert(tableName, data);
await db.update(tableName, data, match);
await db.remove(tableName, match);

// Helpers Específicos
await db.fetchUserProfile(email);
await db.fetchReports();
await db.fetchUsers();
await db.fetchNews();
await db.fetchAuditLogs();
await db.logAudit(email, acao, alvo);
```

### Exemplo de Uso

```javascript
import * as db from './js/supabase.js';

// Buscar todos os relatórios
const { data, error } = await db.fetchReports();
if (error) console.error(error);
else console.log(data);

// Inserir novo relatório
const result = await db.insert('reportsTable', {
  nome: 'Vendas Q4',
  area: 'Finance',
  link: 'https://...',
  descricao: 'Análise trimestral'
});

// Registrar auditoria
await db.logAudit('admin@empresa.com', 'CRIAR_REPORT', 'Vendas Q4');
```

---

## ✅ Best Practices Implementadas

### 🔐 Segurança

- [x] Credenciais em variáveis de ambiente
- [x] Validação de entrada (email, URL, etc)
- [x] Sanitização de strings (prevenção XSS)
- [x] Timeout em requisições
- [x] Logging seguro de erros
- [ ] Rate limiting (futuro)
- [ ] CSRF protection (futuro)

### ♿ Acessibilidade

- [x] Labels associados aos inputs
- [x] aria-labels em botões funcionais
- [x] Atributos de navegação melhorados
- [x] Suporte a teclado completo
- [x] Contraste de cores (WCAG)
- [ ] Testes com leitores de tela (futuro)

### ⚡ Performance

- [x] Debounce em filtros
- [x] Timeout nas requisições
- [x] Deep clone de dados
- [x] Validações eficientes
- [ ] Lazy loading (futuro)
- [ ] Service Workers (futuro)
- [ ] Compression (futuro)

### 🧪 Qualidade de Código

- [x] Separação em módulos
- [x] Documentação inline
- [x] Tratamento de erros robusto
- [x] Logging estruturado
- [ ] Testes unitários (futuro)
- [ ] Testes E2E (futuro)
- [ ] Linting (futuro)

### 📱 Responsividade

- [x] Mobile-first design
- [x] Breakpoints Tailwind
- [x] Navegação adaptativa
- [x] Modais responsivos

---

## 🗺️ Roadmap

### Fase 1: Foundation ✅ (COMPLETO)
- [x] Estrutura HTML/CSS
- [x] Integração Supabase
- [x] Login & Autenticação
- [x] CRUD de Relatórios
- [x] CRUD de Usuários
- [x] Trilha de Auditoria

### Fase 2: Refatoração 🚧 (ATUAL)
- [x] Separar CSS em arquivo externo
- [x] Separar JS em módulos
- [x] Configurações centralizadas
- [ ] Implementar bundler (Vite)
- [ ] Configurar import maps

### Fase 3: Features Avançadas 📋 (PRÓXIMO)
- [ ] Real-time updates (Supabase subscriptions)
- [ ] Gráficos e analytics
- [ ] Filtros avançados
- [ ] Paginação de dados
- [ ] Upload de arquivos
- [ ] Integração com Power BI direto

### Fase 4: DevOps & Deploy 🚀
- [ ] CI/CD (GitHub Actions)
- [ ] Containerização (Docker)
- [ ] Deploy automático
- [ ] Monitoramento (Sentry)
- [ ] Analytics (Posthog)

### Fase 5: Segurança & Compliance 🔒
- [ ] 2FA
- [ ] Role-based access (RBAC)
- [ ] Data encryption
- [ ] GDPR compliance
- [ ] Backup automático

---

## 🚀 Como Contribuir

1. Crie uma branch: `git checkout -b feature/sua-feature`
2. Faça commits descritivos: `git commit -m 'Adiciona X'`
3. Push para a branch: `git push origin feature/sua-feature`
4. Abra um Pull Request

---

## 📚 Recursos Úteis

- [Supabase Docs](https://supabase.io/docs)
- [Alpine.js Docs](https://alpinejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MDN Web Docs](https://developer.mozilla.org)

---

## 📞 Suporte

Para dúvidas ou sugestões, abra uma issue no repositório.

---

## 📄 Licença

MIT License - Veja LICENSE.md para detalhes

---

## 🙌 Autores

- **Marco Baldassari** - Desenvolvimento Principal

---

**Versão**: 11.9  
**Última Atualização**: 26/02/2026  
**Status**: Refatoração em Progresso
