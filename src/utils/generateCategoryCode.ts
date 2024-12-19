import { supabase } from '../lib/supabase';

export async function generateCategoryCode(prefix: string): Promise<string> {
  // Validate prefix
  if (!prefix || prefix.length !== 4) {
    throw new Error('O prefixo deve ter exatamente 4 caracteres');
  }

  // Convert to uppercase
  prefix = prefix.toUpperCase();

  try {
    // Check if prefix already exists
    const { data: existingCategory, error: checkError } = await supabase
      .from('categorias')
      .select('codigo')
      .eq('codigo', prefix)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw checkError;
    }

    if (existingCategory) {
      throw new Error('Este código de categoria já existe');
    }

    return prefix;
  } catch (error) {
    if (error instanceof Error && error.message === 'Este código de categoria já existe') {
      throw error;
    }
    console.error('Erro ao gerar código da categoria:', error);
    throw new Error('Erro ao gerar código da categoria');
  }
}