-- ============================================
-- MIGRATION: Atualizar tabela newsTable
-- ============================================
-- Este script adiciona os novos campos à tabela newsTable existente
-- Execute no Supabase SQL Editor para aplicar as mudanças

-- 1. ADICIONAR NOVAS COLUNAS
ALTER TABLE newsTable
ADD COLUMN categoria TEXT,
ADD COLUMN impacto TEXT DEFAULT 'Médio',
ADD COLUMN status TEXT DEFAULT 'ativo';

-- 2. POPULÁ-LA COM OS DADOS HISTÓRICOS
-- Primeiro, limpe se necessário (UMA VEZ SÓ):
-- DELETE FROM newsTable WHERE id > 7;

-- Insira os dados históricos com as novas informações
INSERT INTO newsTable (id, titulo, conteudo, versao, categoria, impacto, status, created_at) 
VALUES
(1, 'Sistema Heuriskien v11.3', 'Implementação de filtros de auditoria, manutenção, v11.3', '11.3', 'Sistema', 'Alto', 'ativo', '2026-02-25T16:52:17Z'),
(2, 'Lançamento Heuriskien Enterprise', 'Fundação do sistema com integração nativa', 'v10.1', 'Sistema', 'Alto', 'ativo', '2024-01-10T10:00:00Z'),
(3, 'Upgrade Visual: Premium & Glass', 'Introdução do motor de temas dinâmicos', 'v10.4', 'Design', 'Médio', 'ativo', '2024-01-25T14:00:00Z'),
(4, 'Estabilização de Core', 'Otimização do ciclo de vida Alpine.js', 'v10.6', 'Performance', 'Médio', 'ativo', '2024-02-05T09:30:00Z'),
(5, 'Segurança e Auditoria', 'Lançamento da Trilha de Auditoria administrativa', 'v11.1', 'Segurança', 'Alto', 'ativo', '2024-02-15T16:20:00Z'),
(6, 'Gestão Unificada de Ativos', 'Implementação do CRUD completo de usuários', 'v11.2', 'Feature', 'Alto', 'ativo', '2024-02-20T11:00:00Z'),
(7, 'Heuriskien Mobile & Intelligence Hub', 'Versão atual com filtros dinâmicos de auditoria', 'v11.3', 'Feature', 'Médio', 'ativo', '2026-02-25T18:53:49Z')
ON CONFLICT (id) DO UPDATE SET
    categoria = EXCLUDED.categoria,
    impacto = EXCLUDED.impacto,
    status = EXCLUDED.status
WHERE newsTable.id IN (1,2,3,4,5,6,7);

-- 3. CRIAR ÍNDICES PARA MELHOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_news_status ON newsTable(status);
CREATE INDEX IF NOT EXISTS idx_news_categoria ON newsTable(categoria);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON newsTable(created_at DESC);

-- 4. VERIFICAR DADOS
-- Execute esta query para validar:
SELECT id, titulo, versao, categoria, impacto, status, created_at 
FROM newsTable 
ORDER BY created_at DESC
LIMIT 10;
