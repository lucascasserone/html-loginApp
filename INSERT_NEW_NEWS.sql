-- ============================================
-- INSERIR NOVAS NOTÍCIAS - ÚLTIMAS MELHORIAS
-- ============================================
-- Execute estes comandos no Supabase SQL Editor
-- As IDs começam em 8 (as anteriores vão até 7)

-- 📌 Notícia 1: Tema Light Corrigido
INSERT INTO "newsTable" 
(id, titulo, conteudo, versao, categoria, impacto, status, created_at)
VALUES (
  8,
  'Correção: Tema Light com Contraste Total',
  'Resolvido problema de inputs ilegíveis em tema light. Inputs agora têm texto escuro (#0f172a) garantindo contraste WCAG AA+ em todos os campos de formulário.',
  '11.3.1',
  'Design',
  'Médio',
  'ativo',
  '2026-02-26T10:15:00Z'
);

-- 📌 Notícia 2: Navbar Redesenhado
INSERT INTO "newsTable" 
(id, titulo, conteudo, versao, categoria, impacto, status, created_at)
VALUES (
  9,
  'Menu Superior: Redesign com SVG Icons',
  'Navbar completamente redesenhado com gradient profissional (slate→blue), ícones SVG em vez de emojis, melhor hierarquia visual, e feedback smooth em hover/active states.',
  '11.3.1',
  'Design',
  'Alto',
  'ativo',
  '2026-02-26T10:30:00Z'
);

-- 📌 Notícia 3: Sistema de Notícias Melhorado
INSERT INTO "newsTable" 
(id, titulo, conteudo, versao, categoria, impacto, status, created_at)
VALUES (
  10,
  'Intelligence Unit: Timeline Visual + Categorias',
  'Hub de notícias com nova interface timeline elegante mostrando atualizações com numeração visual, categorias (Sistema/Feature/Design/Performance/Segurança), nível de impacto e status ativo/arquivado.',
  '11.3.1',
  'Feature',
  'Médio',
  'ativo',
  '2026-02-26T11:00:00Z'
);

-- 📌 Notícia 4: Migração de Schema
INSERT INTO "newsTable" 
(id, titulo, conteudo, versao, categoria, impacto, status, created_at)
VALUES (
  11,
  'Estructura: Expansão da newsTable',
  'Nova estrutura de notícias com campos categoria, impacto e status. Índices de performance adicionados para buscas otimizadas em status e categoria.',
  '11.3.1',
  'Backend',
  'Médio',
  'ativo',
  '2026-02-26T11:15:00Z'
);

-- 📌 Notícia 5: Validação de Qualidade
INSERT INTO "newsTable" 
(id, titulo, conteudo, versao, categoria, impacto, status, created_at)
VALUES (
  12,
  'QA: Testes de Acessibilidade Completos',
  'Todas as mudanças de design validadas para WCAG AA+. Suporte a navegação por teclado, compatibilidade com leitores de tela, e respeito a preferências de movimento reduzido.',
  '11.3.1',
  'Qualidade',
  'Alto',
  'ativo',
  '2026-02-26T11:30:00Z'
);

-- ============================================
-- VERIFICAR DADOS INSERIDOS
-- ============================================
-- Execute para confirmar:
SELECT id, titulo, versao, categoria, impacto, status, created_at 
FROM "newsTable" 
WHERE id >= 8
ORDER BY created_at DESC;

-- ============================================
-- VER TODAS AS NOTÍCIAS (Opcional)
-- ============================================
SELECT id, titulo, versao, categoria, impacto, status, created_at 
FROM "newsTable" 
ORDER BY created_at DESC;
