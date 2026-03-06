# 🎯 Workforce Intelligence Platform

**Análise inteligente de competências com IA - Mapeie skills, descubra gaps e recomende trilhas automaticamente.**

---

## 📋 Visão Geral

**Workforce Intelligence** é uma plataforma SaaS que utiliza IA para:

✅ **Extrair automaticamente** competências técnicas de currículos (PDF, DOCX, TXT)  
✅ **Mapear gaps** entre habilidades atuais e cargos-alvo  
✅ **Gerar PDI** (Plano de Desenvolvimento Individual) personalizado  
✅ **Recomendar trilhas** de cursos e oportunidades internas  
✅ **Comparar com benchmarks** do mercado em tempo real  

Otimizada para equipes de **RH, Talentos e Desenvolvimento** que querem decisões baseadas em dados reais.

---

## 🏗️ Arquitetura do Projeto

```
Workforce Intelligence Platform/
├── lp.html                 # Landing Page (apresentação + benefícios)
├── checkout.html           # Página de Preços (3 planos B2B)
├── project.html            # Aplicação Principal (4 passos de análise)
├── _old/                   # Versões anteriores
│   └── index-mvp.html      # MVP completo (9 passos)
├── README.md               # Este arquivo
└── Design System           # (a ser documentado)
```

---

## 🚀 Jornada do Usuário

### Fluxo Principal
```
🌐 Landing Page (lp.html)
   ↓
   [Iniciar Teste Gratuito] → project.html
   [Falar com Especialista] → WhatsApp
   [Ver Planos B2B] → checkout.html
   
💳 Checkout (checkout.html)
   ↓
   [Começar Grátis] → project.html
   [Liberar Acesso Pro] → WhatsApp
   [Contatar Especialista] → WhatsApp

🔧 Aplicação (project.html)
   ├─ Step 1: Upload de CV
   ├─ Step 2: Extração & Autoavaliação
   ├─ Step 3: Radar de Gaps
   └─ Step 4: PDI + Recomendações
```

---

## 🎨 Design System

### Cores Principais
| Token | Valor | Uso |
|-------|-------|-----|
| `--accent` | `#22c55e` | Sucesso, aprovação |
| `--accent-2` | `#38bdf8` | Destaque principal |
| `--accent-3` | `#f59e0b` | Aviso, cautela |
| `--accent-4` | `#8b5cf6` | Soft skills, comportamental |
| `--danger` | `#ef4444` | Crítico, alerta |
| `--bg` | `#0f172a` (dark) / `#f8fafc` (light) | Fundo |

### Tipografia
- **Font**: Inter, system-ui, -apple-system
- **Weighs**: 400, 600, 700, 800
- **Base Size**: 16px
- **Line Height**: 1.5

### Componentes Reutilizáveis
- `.card` - Containers com sombra e borda
- `.btn-primary` - CTA principal (verde/azul)
- `.pill` - Badge secundário
- `.badge` - Status indicator (alertas)
- `.modal` - Diálogos
- `.stepper` - Navegação linear

---

## 🔐 Segurança & Compliance

- ✅ **Criptografia de ponta a ponta** nos uploads
- ✅ **LGPD Compliant** - Dados nunca são compartilhados
- ✅ **SSL 256-bit** na transmissão
- ✅ **Local Storage** seguro com localStorage
- 🔄 **Sem rastreamento** de dados pessoais para IA pública

---

## 📊 Funcionalidades Principais

### 1️⃣ Upload & Extração
- Suporte: PDF, DOCX, TXT
- Simulação local (MVP - sem PDF real)
- Status em tempo real

### 2️⃣ Análise IA Mock
- Extração de habilidades
- Inferência de soft skills
- Cálculo de confiança (50-100%)

### 3️⃣ Radar Visual
- 2 radares: Hard Skills + Soft Skills
- 4 camadas: Atual | Esperado (cargo) | Esperado (alvo) | Mercado
- Responsivo e interativo

### 4️⃣ Grid Dinâmico
- Tabela editável com sliders
- Filtros: Críticas, Desejáveis, Todas
- Detecção de conflitos IA × Autoavaliação

### 5️⃣ PDI Gerador
- Recomendações automáticas
- ROI calculado por trilha
- Integração com Udemy/Coursera (dados mockados)

### 6️⃣ Persistência
- localStorage para salvar estado
- Exportação JSON completa
- Tema dark/light toggle

---

## 🧪 Testes & Validação

### Dados Mock Disponíveis
```javascript
Cargos disponíveis:
- Planner / Planner Senior
- Data Analyst / Data Manager
- Project Manager
- Backend Dev / Engineering Manager
- Product Manager

Skills por cargo: 5-7 hard + 2-3 soft
Benchmarks de mercado: 3 cargos
```

---

## 📱 Responsividade

- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)
- ✅ Layout de grid adaptativo

---

## 🔧 Deployment & Hosting

**Recomendações:**
- Netlify / Vercel (frontend estático)
- Backend: Node.js + Express (para IA real)
- Database: PostgreSQL (persistência)
- APIs: OpenAI / Anthropic (extração de CV)

---

## 📈 Roadmap Futuro

- [ ] Autenticação real (OAuth)
- [ ] Backend API completa
- [ ] Integração com SAP/Workday
- [ ] Dashboard de RH (múltiplos usuários)
- [ ] Mobile app (React Native)
- [ ] Relatórios em PDF
- [ ] Previsão de rotatividade
- [ ] Matriz de sucessão

---

## 👥 Equipe & Contato

**Desenvolvido por:** Marco Baldassari  
**Contato:** +55 11 94763-9729  
**WhatsApp:** [Link de contato](https://wa.me/5511947639729)

---

## 📄 Licença

© 2026 Workforce Intelligence Platform. Todos os direitos reservados.

---

**Última atualização:** Março 2026
