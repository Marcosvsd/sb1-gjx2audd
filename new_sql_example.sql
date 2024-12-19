-- Remover a coluna código que não será mais usada
ALTER TABLE produtos DROP COLUMN IF EXISTS codigo;

-- Atualizar a trigger para gerar apenas o código interno
CREATE OR REPLACE FUNCTION generate_codigo_interno()
RETURNS TRIGGER AS $$
DECLARE
    categoria_codigo VARCHAR(4);
    sequencial INT;
BEGIN
    -- Busca o código da categoria
    SELECT codigo INTO categoria_codigo
    FROM categorias
    WHERE id = NEW.categoria_id;

    IF categoria_codigo IS NULL THEN
        RAISE EXCEPTION 'Categoria não encontrada';
    END IF;

    -- Busca o último sequencial para esta categoria
    SELECT COALESCE(MAX(CAST(SUBSTRING(codigo_interno FROM 6) AS INTEGER)), 0) + 1
    INTO sequencial
    FROM produtos
    WHERE categoria_id = NEW.categoria_id;

    -- Gera o código interno no formato XXXX-NNNNNN
    NEW.codigo_interno := categoria_codigo || '-' ||
                         LPAD(sequencial::TEXT, 6, '0');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;