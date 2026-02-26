-- ============================================
-- MIGRATION: Atualizar newsTable
-- ============================================
-- Nome correto da tabela: newsTable
-- Execute os comandos em ordem

-- ============================================
-- PASSO 1: ADICIONAR COLUNAS
-- ============================================
ALTER TABLE "newsTable"
ADD COLUMN IF NOT EXISTS categoria TEXT,
ADD COLUMN IF NOT EXISTS impacto TEXT DEFAULT 'Médio',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ativo';

-- ============================================
-- PASSO 2: ATUALIZAR REGISTROS
-- ============================================
UPDATE "newsTable" SET categoria = 'Sistema', impacto = 'Alto', status = 'ativo' WHERE id = 1;
UPDATE "newsTable" SET categoria = 'Sistema', impacto = 'Alto', status = 'ativo' WHERE id = 2;
UPDATE "newsTable" SET categoria = 'Design', impacto = 'Médio', status = 'ativo' WHERE id = 3;
UPDATE "newsTable" SET categoria = 'Performance', impacto = 'Médio', status = 'ativo' WHERE id = 4;
UPDATE "newsTable" SET categoria = 'Segurança', impacto = 'Alto', status = 'ativo' WHERE id = 5;
UPDATE "newsTable" SET categoria = 'Feature', impacto = 'Alto', status = 'ativo' WHERE id = 6;
UPDATE "newsTable" SET categoria = 'Feature', impacto = 'Médio', status = 'ativo' WHERE id = 7;

-- ============================================
-- PASSO 3: CRIAR ÍNDICES (Opcional)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_news_status ON "newsTable"(status);
CREATE INDEX IF NOT EXISTS idx_news_categoria ON "newsTable"(categoria);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON "newsTable"(created_at DESC);

-- ============================================
-- PASSO 4: VALIDAR
-- ============================================
SELECT id, titulo, versao, categoria, impacto, status, created_at 
FROM "newsTable" 
ORDER BY created_at DESC;
