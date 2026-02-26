# 📚 Documentação Heuriskien

Bem-vindo! Este é seu guia de navegação completo da plataforma.

---

## 🚀 Começar Rápido

**Você é novo?** Comece aqui:
1. Abra `index-refatorado.html` no navegador
2. Faça login com suas credenciais Supabase
3. Explore o dashboard!

> **Não tem acesso?** Peça ao administrador para criar sua conta.

---

## 📖 Documentos por Perfil

### 👤 Usuário Final

- **[Como usar o app](https://seu-url.com/docs/user-guide)** ← Funções principais
- **[Gerir meu perfil](https://seu-url.com/docs/profile)** ← Dados pessoais
- **[Acessar relatórios](https://seu-url.com/docs/reports)** ← Links Power BI
- **[Algo não funciona?](./TROUBLESHOOTING.md)** ← Resolvera problemas

### 👨‍💼 Administrador

- **[Setup inicial](./SETUP.md)** ← Instalação do banco
- **[Gestão de usuários](https://seu-url.com/docs/user-management)** ← Add/remover pessoas
- **[Auditoria](https://seu-url.com/docs/audit)** ← Logs de atividades
- **[Configurações de segurança](./TROUBLESHOOTING.md#segurança)** ← RLS policies

### 👨‍💻 Desenvolvedor

- **[Arquitetura do projeto](./CONTRIBUTING.md)** ← Como funciona
- **[Contribuir com código](./CONTRIBUTING.md)** ← Submeter PRs
- **[Deploy no GitHub Pages](./DEPLOY.md)** ← Colocar em produção
- **[Troubleshooting técnico](./TROUBLESHOOTING.md)** ← Debugar problemas

---

## 📂 Arquivos Principais

| Arquivo | Descrição | Quem lê? |
|---------|-----------|----------|
| **index-refatorado.html** | App principal (único HTML) | Todos |
| **SETUP.md** | Instalação e SQL | Admin + Dev |
| **DEPLOY.md** | Deploy GitHub Pages | Dev |
| **TROUBLESHOOTING.md** | Resolver bugs | Todos |
| **CONTRIBUTING.md** | Guia dev | Dev |
| **README.md** | Overview completo | Todos |
| **CHANGELOG.md** | Histórico de versões | Dev |

---

## 🎯 Tarefas Comuns

### "Não consigo fazer login"
→ Leia [TROUBLESHOOTING.md - Login](./TROUBLESHOOTING.md#login-não-funciona)

### "Preciso adicionar um novo usuário"
→ Leia [SETUP.md - Criar usuários](./SETUP.md)

### "Quero contribuer com uma feature"
→ Leia [CONTRIBUTING.md - Como contribuir](./CONTRIBUTING.md#-como-contribuir)

### "Vou hospedar no GitHub Pages"
→ Leia [DEPLOY.md](./DEPLOY.md) (passo a passo)

### "Dados não estão atualizando"
→ Leia [TROUBLESHOOTING.md - Atualizações](./TROUBLESHOOTING.md#atualizações-não-aparecem)

### "Preciso customizar o visual"
→ Edite `css/styles.css` (Tailwind) ou veja [CONTRIBUTING.md - Estilos](./CONTRIBUTING.md#-estilos)

---

## 🔗 Links Rápidos

**Documentação Externa:**
- [Supabase Docs](https://supabase.com/docs)
- [Alpine.js Manual](https://alpinejs.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [GitHub Pages Help](https://docs.github.com/pt/pages)

**Suas Contas:**
- [Painel Supabase](https://app.supabase.com) ← Controlar dados
- [GitHub Repo](https://github.com) ← Versionar código

---

## 📞 Precisa de Ajuda?

1. **Verifique [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Resolvem 95% dos problemas
2. **Abra uma issue no GitHub** - Descreva o problema
3. **Pergunte em Discussions** - Dúvidas gerais
4. **Email admin** - Para acesso de conta

---

## ✅ Checklist - Antes de Usar

- [ ] Supabase credenciais configuradas
- [ ] Consegui fazer login
- [ ] Homepage carrega dados
- [ ] Consegui criar um relatório (se admin)
- [ ] Temas alternam (Dark/Light/Glass)
- [ ] Responsivo no mobile

Se tudo acima está OK, **você está pronto!** 🎉

---

## 📊 Stack Tecnológico

```
GitHub Pages (Frontend)
    ↓ REST API + CORS
Supabase (Backend)
    ↓ PostgreSQL
Database (dados)
```

- **Frontend:** HTML5 + Alpine.js + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **UI:** SweetAlert2 + Glassmorphism
- **Hosting:** GitHub Pages (FREE)

---

**Última atualização:** Fevereiro 2026  
**Versão:** 11.9.0

