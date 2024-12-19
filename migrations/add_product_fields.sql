-- Add new columns to produtos table
ALTER TABLE produtos
ADD COLUMN IF NOT EXISTS marca_comercial VARCHAR(100),
ADD COLUMN IF NOT EXISTS descricao_resumida VARCHAR(100),
ADD COLUMN IF NOT EXISTS ean VARCHAR(13),
ADD COLUMN IF NOT EXISTS serie BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS comprimento DECIMAL(10,3),
ADD COLUMN IF NOT EXISTS largura DECIMAL(10,3),
ADD COLUMN IF NOT EXISTS altura DECIMAL(10,3),
ADD COLUMN IF NOT EXISTS peso_cubico DECIMAL(10,3);

-- Create or replace function to automatically generate short description and cubic weight
CREATE OR REPLACE FUNCTION calculate_product_fields()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate short description
    NEW.descricao_resumida := CASE 
        WHEN LENGTH(NEW.descricao) > 100 THEN 
            LEFT(NEW.descricao, 97) || '...'
        ELSE 
            NEW.descricao
    END;

    -- Calculate cubic weight if dimensions are provided
    IF NEW.comprimento IS NOT NULL AND 
       NEW.largura IS NOT NULL AND 
       NEW.altura IS NOT NULL THEN
        NEW.peso_cubico := ROUND((NEW.comprimento * NEW.largura * NEW.altura / 6000)::numeric, 3);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update calculated fields
DROP TRIGGER IF EXISTS trigger_calculate_product_fields ON produtos;
CREATE TRIGGER trigger_calculate_product_fields
    BEFORE INSERT OR UPDATE ON produtos
    FOR EACH ROW
    EXECUTE FUNCTION calculate_product_fields();

-- Add check constraints
ALTER TABLE produtos
ADD CONSTRAINT check_ean_format 
    CHECK (ean IS NULL OR ean ~ '^[0-9]{13}$'),
ADD CONSTRAINT check_dimensions_positive 
    CHECK (
        (comprimento IS NULL OR comprimento > 0) AND
        (largura IS NULL OR largura > 0) AND
        (altura IS NULL OR altura > 0)
    );