import { supabase } from '../lib/supabase';
import { createDimension, updateDimension } from './dimensionService';
import type { Produto } from '../types/produto';

interface ProductInput {
  categoria_id: string;
  marca_comercial: string;
  modelo: string;
  descricao: string | null;
  descricao_resumida: string;
  ncm: string | null;
  ean: string | null;
  unidade_medida: string;
  valor_unitario: number;
  moeda: string;
  serie: boolean;
}

interface DimensionsInput {
  comprimento: number;
  largura: number;
  altura: number;
  peso_liquido: number;
  peso_bruto: number;
}

export async function createProduct(productData: ProductInput, dimensionsData: DimensionsInput) {
  try {
    const { data: newProduct, error: productError } = await supabase
      .from('produtos')
      .insert([productData])
      .select()
      .single();

    if (productError) throw productError;
    if (!newProduct) throw new Error('Falha ao criar produto: nenhum dado retornado');

    try {
      await createDimension({
        produto_id: newProduct.id,
        ...dimensionsData
      });
    } catch (dimensionsError) {
      // Rollback: delete product if dimensions creation fails
      await supabase.from('produtos').delete().eq('id', newProduct.id);
      throw dimensionsError;
    }

    return newProduct;
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    throw error;
  }
}

export async function updateProduct(
  productId: string,
  productData: Partial<ProductInput>,
  dimensionsData: DimensionsInput
) {
  try {
    const { error: productError } = await supabase
      .from('produtos')
      .update(productData)
      .eq('id', productId);

    if (productError) throw productError;

    await updateDimension(productId, dimensionsData);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw error;
  }
}