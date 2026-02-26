# 🔧 Guia de Setup da Projeto

> Instruções passo a passo para configurar o ambiente de desenvolvimento

---

## 📋 Pré-requisitos

- **Node.js** v16 ou superior
- **npm** v7+ ou **yarn** v1.22+
- **Git**
- **Conta Supabase** (gratuita em [supabase.io](https://supabase.io))

---

## ✅ Checklist de Setup

### 1️⃣ Preparação Inicial

- [ ] Node.js e npm instalados
- [ ] Conta Supabase criada
- [ ] Repositório Git clonado

### 2️⃣ Configuração do Projeto

- [ ] Instalar dependências (`npm install`)
- [ ] Criar `.env.local` a partir de `.env.example`
- [ ] Preencher credenciais Supabase
- [ ] Configurar banco de dados Supabase

### 3️⃣ Desenvolvimento

- [ ] Iniciar servidor local (`npm run dev`)
- [ ] Testar login
- [ ] Validar CRUD de dados

### 4️⃣ Build & Deploy

- [ ] Build para produção (`npm run build`)
- [ ] Testar build localmente (`npm run preview`)
- [ ] Deploy em plataforma (Vercel, Netlify, etc)

---

## 🚀 Instruções Detalhadas

### Passo 1: Instalar Dependências

```bash
# Navegue até a pasta do projeto
cd autopilot

# Instale as dependências
npm install

# Ou com yarn
yarn install
```

### Passo 2: Configurar Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Abra o arquivo com seu editor
# Preencha com suas credenciais Supabase
```

**Conteúdo de .env.local:**

```bash
# Obtém em: Project Settings > API Keys
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-aqui

# App config (já preenchido)
VITE_APP_NAME=Heuriskien
VITE_APP_VERSION=11.9
VITE_API_TIMEOUT=10000
VITE_DEBOUNCE_DELAY=300

# Ambiente
VITE_ENVIRONMENT=development
```

### Passo 3: Configurar Banco de Dados Supabase

#### 3.1 Criar Tabelas

Abra o **SQL Editor** no Supabase e execute:

```sql
-- 1. Tabela de Usuários/Acesso
CREATE TABLE acessTable (
  email VARCHAR(255) PRIMARY KEY,
  nome_completo VARCHAR(255) NOT NULL,
  cargo VARCHAR(100),
  setor VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE acessTable ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read all" ON acessTable FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users" ON acessTable USING (auth.role() = 'authenticated');

-- 2. Tabela de Relatórios
CREATE TABLE reportsTable (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(255) NOT NULL,
  area VARCHAR(100),
  link TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE reportsTable ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read all" ON reportsTable FOR SELECT USING (true);
CREATE POLICY "Allow admin insert/update/delete" ON reportsTable 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 3. Tabela de Notícias
CREATE TABLE newsTable (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  titulo VARCHAR(255) NOT NULL,
  conteudo TEXT NOT NULL,
  versao VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE newsTable ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read all" ON newsTable FOR SELECT USING (true);

-- 4. Tabela de Logs de Auditoria
CREATE TABLE audit_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  admin_email VARCHAR(255),
  acao VARCHAR(50),
  alvo TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users" ON audit_logs 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

#### 3.2 Adicionar Dados de Teste

```sql
-- Insira um usuário de teste
INSERT INTO acessTable (email, nome_completo, cargo, setor) 
VALUES ('admin@empresa.com', 'Administrador', 'CEO', 'Executivo');

-- Insira notícias de teste
INSERT INTO newsTable (titulo, conteudo, versao) 
VALUES ('Bem-vindo!', 'Bem-vindo ao Heuriskien v11.9', '11.9');
```

### Passo 4: Iniciar Servidor de Desenvolvimento

```bash
# Inicie o servidor Vite
npm run dev

# O navegador abrirá automaticamente em:
# http://localhost:5173
```

### Passo 5: Testar Login

1. Acesse a aplicação
2. Use um email existente no `acessTable` (ex: admin@empresa.com)
3. Crie um usuário Supabase Auth com o mesmo email
4. Use a senha criada para logar

### Passo 6: Começar Desenvolvimento

```bash
# Rodar linter
npm run lint

# Formatar código
npm run format

# Rodar testes
npm run test

# Rodar testes com UI
npm run test:ui

# Rodar testes com coverage
npm run test:coverage
```

---

## 🔐 Segurança - Checklist Pré-Deploy

- [ ] `.env.local` não está versionado (verificar `.gitignore`)
- [ ] Usar credenciais diferentes para dev/prod
- [ ] Ativar RLS (Row Level Security) no Supabase
- [ ] Revisar políticas de segurança (RLS policies)
- [ ] Validar todas as entradas de usuário
- [ ] Verificar autenticação em todas as rotas
- [ ] Testar com dados sensíveis em staging
- [ ] Implementar rate limiting (futuro)

---

## 🚀 Fazer Build para Produção

```bash
# Build otimizado
npm run build

# Previzualizar build localmente
npm run preview

# Deploy para plataforma (exemplo: Vercel)
npm run deploy
```

---

## 🐛 Troubleshooting

### "Cannot find module '@supabase/supabase-js'"

```bash
# Reinstale as dependências
rm -rf node_modules
npm install
```

### "Credenciais Supabase não configuradas"

```bash
# Verifique se .env.local existe
ls -la .env.local

# Verifique se as variáveis estão preenchidas
cat .env.local
```

### "Conexão recusada ao Supabase"

- Verifique internet
- Confirme URL e KEY corretas
- Verifique firewall/VPN
- Check Supabase status em supabase.io/status

### "Login não funciona"

1. Verifique se o usuário existe em Supabase Auth
2. Confirme email correto
3. Verifique se a tabela `acessTable` tem o usuário
4. Verifique RLS policies

---

## 📚 Próximos Passos

1. **Ler documentação**: `README.md`
2. **Explorar código**: Verifique `js/app.js`, `js/utils.js`
3. **Configurar IDE**: VS Code com extensions recomendadas
4. **Criar features**: Comece com tasks no roadmap

---

## 💡 Dicas de Desenvolvimento

### VS Code Extensions Recomendadas

- **Esquilo**: Gerador de cores/temas
- **Tailwind CSS IntelliSense**: Autocomplete Tailwind
- **Alpine.js IntelliSense**: Suporte Alpine
- **ESLint**: Linting em tempo real
- **Prettier**: Formatação automática
- **Thunder Client**: Testar APIs
- **Supabase**: Gerenciar Supabase

### Workflow Recomendado

```bash
# Terminal 1: Desenvolvimento
npm run dev

# Terminal 2: Linting em watch mode (futuro)
npm run lint -- --watch

# Editar arquivos e ver mudanças em tempo real
```

---

## 🤝 Contribuindo

Ao contribuir, siga este workflow:

```bash
# 1. Crie uma branch
git checkout -b feature/sua-feature

# 2. Faça mudanças e teste
npm run test

# 3. Format e lint
npm run format
npm run lint

# 4. Commit com mensagem descritiva
git commit -m "feat: adiciona nova feature"

# 5. Push para repositório
git push origin feature/sua-feature

# 6. Abra Pull Request no GitHub
```

---

## 📞 Suporte

Encontrou problemas? Abra uma issue!

---

## ✨ Parabéns! 🎉

Você configurou o Heuriskien com sucesso! Comece a desenvolver e divirta-se! 🚀
