SET FOREIGN_KEY_CHECKS=0;
START TRANSACTION;

-- -------------------------------------------------------
-- 1. Inserir opcao_a de cartas Originais (PT-BR)
-- -------------------------------------------------------
INSERT INTO maldicao (texto, categoria)
SELECT 
  TRIM(SUBSTRING_INDEX(texto, ', ou ', 1)),
  categoria
FROM maldicao 
WHERE categoria = 'Original';

-- -------------------------------------------------------
-- 2. Inserir opcao_b de cartas Originais (PT-BR)
-- -------------------------------------------------------
INSERT INTO maldicao (texto, categoria)
SELECT 
  TRIM(SUBSTRING(texto, LOCATE(', ou ', texto) + 5)),
  categoria
FROM maldicao 
WHERE categoria = 'Original';

-- -------------------------------------------------------
-- 3. Inserir opcao_a de cartas Importadas (EN)
--    Normaliza NBSP, remove prefixo, pega antes de ' or '
-- -------------------------------------------------------
INSERT INTO maldicao (texto, categoria)
SELECT 
  TRIM(REPLACE(
    SUBSTRING_INDEX(REPLACE(texto, UNHEX('C2A0'), ' '), ' or ', 1),
    'Would you rather ', ''
  )),
  categoria
FROM maldicao 
WHERE categoria = 'Importado';

-- -------------------------------------------------------
-- 4. Inserir opcao_b de cartas Importadas (EN)
--    Normaliza NBSP, pega depois de ' or '
-- -------------------------------------------------------
INSERT INTO maldicao (texto, categoria)
SELECT 
  TRIM(SUBSTRING(
    REPLACE(texto, UNHEX('C2A0'), ' '),
    LOCATE(' or ', REPLACE(texto, UNHEX('C2A0'), ' ')) + 4
  )),
  categoria
FROM maldicao 
WHERE categoria = 'Importado';

-- -------------------------------------------------------
-- 5. Deletar as 304 linhas originais (ids 1-304)
-- -------------------------------------------------------
DELETE FROM maldicao WHERE id <= 304;

COMMIT;
SET FOREIGN_KEY_CHECKS=1;
