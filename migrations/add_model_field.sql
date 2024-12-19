-- Add modelo column to produtos table
ALTER TABLE produtos
ADD COLUMN IF NOT EXISTS modelo VARCHAR(100);

-- Update the trigger function to ensure peso_cubico is always calculated
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

    -- Calculate cubic weight (always calculate if dimensions are provided)
    IF NEW.comprimento IS NOT NULL AND 
       NEW.largura IS NOT NULL AND 
       NEW.altura IS NOT NULL THEN
        -- Convert to numeric to ensure precise calculation
        NEW.peso_cubico := ROUND(
            (NEW.comprimento::numeric * NEW.largura::numeric * NEW.altura::numeric / 6000)::numeric, 
            3
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;