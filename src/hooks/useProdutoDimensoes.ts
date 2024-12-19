import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import type { Produto } from '../types/produto';
import type { Dimensao } from '../types/dimensao';

interface DimensoesInput {
  produto_id?: string;
  comprimento: number;
  largura: number;
  altura: number;
  peso_liquido: number;
  peso_bruto: number;
}

export function useProdutoDimensoes(produto: Produto | null | undefined) {
  const [dimensoes, setDimensoes] = useState<Dimensao | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (produto?.id) {
      fetchDimensoes(produto.id);
    } else {
      setDimensoes(null);
      setIsLoading(false);
    }
  }, [produto?.id]);

  async function fetchDimensoes(produtoId: string) {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('dimensoes')
        .select('*')
        .eq('produto_id', produtoId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setDimensoes(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar dimensões'));
      console.error('Erro ao carregar dimensões:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveDimensoes(input: DimensoesInput) {
    try {
      if (!input.produto_id && !dimensoes?.id) {
        throw new Error('produto_id é obrigatório para novas dimensões');
      }

      if (dimensoes?.id) {
        // Update existing dimensions
        const { error } = await supabase
          .from('dimensoes')
          .update({
            comprimento: input.comprimento,
            largura: input.largura,
            altura: input.altura,
            peso_liquido: input.peso_liquido,
            peso_bruto: input.peso_bruto
          })
          .eq('id', dimensoes.id);

        if (error) throw error;
      } else {
        // Insert new dimensions
        const { error } = await supabase
          .from('dimensoes')
          .insert([{
            produto_id: input.produto_id,
            comprimento: input.comprimento,
            largura: input.largura,
            altura: input.altura,
            peso_liquido: input.peso_liquido,
            peso_bruto: input.peso_bruto
          }]);

        if (error) throw error;
      }
    } catch (err) {
      console.error('Erro ao salvar dimensões:', err);
      throw err;
    }
  }

  return {
    dimensoes,
    isLoading,
    error,
    saveDimensoes
  };
}