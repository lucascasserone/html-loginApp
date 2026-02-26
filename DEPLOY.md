# Guia de Deploy - GitHub Pages

> Hospede sua aplicação gratuitamente no GitHub Pages com integração Supabase

## 📋 Pré-requisitos

- Conta GitHub
- Repositório do projeto criado
- `git` instalado localmente
- Node.js (opcional, apenas para build local)

## 🚀 Passo 1: Preparar Repositório

### 1.1 Criar repositório no GitHub

1. Vá para [github.com/new](https://github.com/new)
2. Nome: `seu-username.github.io` (EXATO para GitHub Pages automático)
   - Ou: `nome-qualquer` (Pages manual em Settings)
3. Marque "Public"
4. Clique "Create repository"

### 1.2 Fazer push do código local

```bash
cd ~/OneDrive\ -\ Grupo\ Avenida/Área\ de\ Trabalho/autopilot

# Inicializar git (se não existir)
git init
git add .
git commit -m "Initial commit: Heuriskien Enterprise v11.9"

# Adicionar remote (substitua USERNAME e REPO)
git remote add origin https://github.com/USERNAME/REPO.git

# Fazer push para main branch
git branch -M main
git push -u origin main
```

## 🔧 Passo 2: Configurar GitHub Pages

### 2.1 Se usando `seu-username.github.io`

GitHub Pages ativa automaticamente. Seu site fica em:
```
https://seu-username.github.io
```

### 2.2 Se usando outro nome

1. Vá em **Settings** → **Pages**
2. Selecione branch: `main`
3. Selecione pasta: `/ (root)`
4. Salve
5. Seu site fica em: `https://seu-username.github.io/repo-name`

## 🛡️ Passo 3: Configurar CORS no Supabase

Para que o Supabase aceite requisições do GitHub Pages:

### 3.1 No painel Supabase

1. Vá para **Project Settings** → **API**
2. Procure por **CORS**
3. Adicione origem:
   ```
   https://seu-username.github.io
   ```
   (Ou se não for username.github.io, adicione a URL completa)
4. Salve

### 3.2 Verificar configurações

A chave anon já deve estar funcionando. Se tiver CORS issues:
1. Verifique console do navegador (F12)
2. Procure por erro `CORS policy`
3. Confirme URL exata que está acessando
4. Adicione exatamente essa URL em CORS

## 🔐 Passo 4: Proteger Credenciais (Opcional)

Para maior segurança, use **GitHub Secrets** para armazenar chaves:

### 4.1 Adicionar secrets

1. **Settings** → **Secrets and variables** → **Actions**
2. Novo secret `SUPABASE_ANON_KEY`
3. Cole a chave
4. Novo secret `SUPABASE_URL`
5. Cole a URL

### 4.2 Usar em Actions (CI/CD)

Clique em **Actions** e crie arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        run: |
          echo "✅ Deployed to GitHub Pages"
```

## 📊 Passo 5: Verificar Deploy

1. Vá para **Actions** no seu repositório
2. Veja o workflow sendo executado
3. Aguarde conclusão ✅
4. Acesse: `https://seu-username.github.io`

## 🔄 Passo 6: Atualizações Contínuas

Após fazer mudanças local:

```bash
# Fazer alterações nos arquivos...
git add .
git commit -m "Descrição das mudanças"
git push origin main
```

GitHub Pages atualiza **automaticamente** em ~5-10 minutos.

## 🐛 Troubleshooting

### "Site não aparece ou mostra 404"

- ✅ Verifique se repositório é **Public**
- ✅ Confirme branch correto em Settings → Pages
- ✅ Espere 5 minutos após primeiro commit
- ✅ Limpe cache do navegador (Ctrl+Shift+Del)

### "Supabase retorna erro CORS"

- ✅ Adicione URL exata em Supabase → Settings → API → CORS
- ✅ Use `https://` (não `http://`)
- ✅ Verifique se URL tem trailing slash

### "Login não funciona"

- ✅ Abra F12 (Console)
- ✅ Procure por erro vermelho
- ✅ Verifique credenciais em `index-refatorado.html`
- ✅ Confirme email/senha cadastrados no Supabase

### "Dados não carregam"

- ✅ Console mostra erro de queries?
- ✅ Tabelas existem no Supabase?
- ✅ RLS policies estão ativas? (desabilite para testes)
- ✅ Tente limpar cache: Ctrl+Shift+Del

## 📝 Variáveis de Ambiente (Avançado)

Para não expor credenciais, crie `.env.local` local (git-ignored):

```env
VITE_SUPABASE_URL=https://seu-project.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

Depois use em JavaScript:
```javascript
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

> ⚠️ Nota: GitHub Pages não processa `.env`, então esse método funciona apenas se usar build tool (Vite)

## ✅ Checklist deploy

- [ ] Repositório criado e público
- [ ] Código feito push para `main` branch
- [ ] GitHub Pages ativado em Settings
- [ ] CORS configurado no Supabase
- [ ] Site acessível em `https://seu-username.github.io`
- [ ] Login funciona
- [ ] Dados aparecem
- [ ] Temas alternam corretamente
- [ ] Responsivo no mobile

## 🎉 Pronto!

Seu site está live e atualiza automaticamente a cada push! 

**Documentação:**
- [GitHub Pages Docs](https://docs.github.com/pt/pages)
- [Supabase CORS](https://supabase.com/docs/guides/api/cors)

