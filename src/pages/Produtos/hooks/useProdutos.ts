import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';
import type { Produto } from '../../../types/produto';

export function useProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchProdutos();
  }, []);

  async function fetchProdutos() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProdutos(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar produtos'));
      toast.error('Erro ao carregar produtos');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProdutos(produtos.filter(p => p.id !== id));
      toast.success('Produto excluído com sucesso');
    } catch (err) {
      toast.error('Erro ao excluir produto');
      console.error('Erro ao excluir produto:', err);
    }
  }

  return {
    produtos,
    isLoading,
    error,
    handleDelete
  };
}