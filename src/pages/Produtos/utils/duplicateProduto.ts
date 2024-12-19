import { toast } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';
import { createDimension } from '../../../services/dimensionService';
import type { Produto } from '../../../types/produto';

export async function duplicateProduto(produto: Produto): Promise<void> {
  try {
    // Get original dimensions first
    const { data: dimensoes, error: dimError } = await supabase
      .from('dimensoes')
      .select('*')
      .eq('produto_id', produto.id)
      .single();

    if (dimError && dimError.code !== 'PGRST116') throw dimError;

    // Create new product data without id and timestamps
    const newProduto = {
      categoria_id: produto.categoria_id,
      modelo: produto.modelo,
      marca_comercial: produto.marca_comercial,
      descricao: `${produto.descricao} (Cópia)`,
      descricao_resumida: produto.descricao_resumida,
      ncm: produto.ncm,
      ean: produto.ean,
      serie: produto.serie,
      unidade_medida: produto.unidade_medida,
      valor_unitario: produto.valor_unitario,
      moeda: produto.moeda,
    };

    // Insert new product
    const { data: newProduct, error } = await supabase
      .from('produtos')
      .insert([newProduto])
      .select();
    
    if (error) throw error;
    if (!newProduct?.[0]) throw new Error('Falha ao duplicar produto: nenhum dado retornado');
    
    // Duplicate dimensions if they exist
    if (dimensoes) {
      await createDimension({
        produto_id: newProduct[0].id,
        comprimento: dimensoes.comprimento,
        largura: dimensoes.largura,
        altura: dimensoes.altura,
        peso_liquido: dimensoes.peso_liquido,
        peso_bruto: dimensoes.peso_bruto
      });
    }

    toast.success('Produto duplicado com sucesso');
  } catch (error) {
    console.error('Erro ao duplicar produto:', error);
    toast.error('Erro ao duplicar produto');
  }
}