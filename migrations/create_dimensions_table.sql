-- Create dimensions table
CREATE TABLE IF NOT EXISTS dimensoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
    comprimento DECIMAL(10,3) NOT NULL,
    largura DECIMAL(10,3) NOT NULL,
    altura DECIMAL(10,3) NOT NULL,
    peso_liquido DECIMAL(10,3) NOT NULL,
    peso_bruto DECIMAL(10,3) NOT NULL,
    peso_cubico DECIMAL(10,3) GENERATED ALWAYS AS (
        ROUND((comprimento * largura * altura / 6000)::numeric, 3)
    ) STORED,
    volume DECIMAL(10,3) GENERATED ALWAYS AS (
        ROUND((comprimento * largura * altura / 1000000)::numeric, 3)
    ) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT check_dimensions_positive 
        CHECK (
            comprimento > 0 AND
            largura > 0 AND
            altura > 0 AND
            peso_liquido > 0 AND
            peso_bruto > 0
        )
);

-- Enable RLS on dimensoes table
ALTER TABLE dimensoes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Permitir select para todos os usuários autenticados" ON dimensoes;
DROP POLICY IF EXISTS "Permitir insert para usuários autenticados" ON dimensoes;
DROP POLICY IF EXISTS "Permitir update para usuários autenticados" ON dimensoes;
DROP POLICY IF EXISTS "Permitir delete para usuários autenticados" ON dimensoes;

-- Create new policies
CREATE POLICY "Permitir select para todos os usuários autenticados"
ON dimensoes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Permitir insert para usuários autenticados"
ON dimensoes FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Permitir update para usuários autenticados"
ON dimensoes FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Permitir delete para usuários autenticados"
ON dimensoes FOR DELETE
TO authenticated
USING (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_dimensoes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_dimensoes_updated_at ON dimensoes;
CREATE TRIGGER update_dimensoes_updated_at
    BEFORE UPDATE ON dimensoes
    FOR EACH ROW
    EXECUTE FUNCTION update_dimensoes_updated_at();