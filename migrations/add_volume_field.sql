-- Add volume column to produtos table
ALTER TABLE produtos
ADD COLUMN IF NOT EXISTS volume DECIMAL(10,3);

-- Update the trigger function to calculate volume
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

    -- Calculate volume and cubic weight if dimensions are provided
    IF NEW.comprimento IS NOT NULL AND 
       NEW.largura IS NOT NULL AND 
       NEW.altura IS NOT NULL THEN
        -- Calculate volume in cubic meters (cm³ to m³)
        NEW.volume := ROUND(
            (NEW.comprimento::numeric * NEW.largura::numeric * NEW.altura::numeric / 1000000)::numeric,
            3
        );
        
        -- Calculate cubic weight
        NEW.peso_cubico := ROUND(
            (NEW.comprimento::numeric * NEW.largura::numeric * NEW.altura::numeric / 6000)::numeric,
            3
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;