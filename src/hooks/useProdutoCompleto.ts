import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Produto } from '../types/produto';
import type { Dimensao } from '../types/dimensao';

interface ProdutoCompleto extends Produto {
  dimensoes?: Dimensao;
}

export function useProdutoCompleto(produtoId: string | undefined) {
  const [produto, setProduto] = useState<ProdutoCompleto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (produtoId) {
      fetchProdutoCompleto(produtoId);
    } else {
      setProduto(null);
      setIsLoading(false);
    }
  }, [produtoId]);

  async function fetchProdutoCompleto(id: string) {
    try {
      setIsLoading(true);

      // Fetch product
      const { data: produtoData, error: produtoError } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', id)
        .single();

      if (produtoError) throw produtoError;

      // Fetch dimensions
      const { data: dimensoesData, error: dimensoesError } = await supabase
        .from('dimensoes')
        .select('*')
        .eq('produto_id', id)
        .single();

      if (dimensoesError && dimensoesError.code !== 'PGRST116') throw dimensoesError;

      setProduto({
        ...produtoData,
        dimensoes: dimensoesData || undefined
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar produto'));
      console.error('Erro ao carregar produto:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return { produto, isLoading, error };
}