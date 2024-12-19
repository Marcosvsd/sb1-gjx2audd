import { supabase } from '../lib/supabase';

export async function generateProductCode(): Promise<string> {
  // Busca o último código cadastrado
  const { data } = await supabase
    .from('produtos')
    .select('codigo')
    .order('created_at', { ascending: false })
    .limit(1);

  // Se não houver produtos, começa do 1
  if (!data || data.length === 0) {
    return 'PROD0001';
  }

  // Extrai o número do último código
  const lastCode = data[0].codigo;
  const lastNumber = parseInt(lastCode.replace('PROD', ''));
  
  // Gera o próximo número com padding de zeros
  const nextNumber = (lastNumber + 1).toString().padStart(4, '0');
  
  return `PROD${nextNumber}`;
}