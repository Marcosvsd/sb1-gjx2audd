import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import type { Categoria } from '../types/categoria';

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  async function fetchCategorias() {
    try {
      setIsLoading(true);
      console.log('Iniciando busca de categorias...');

      const { data: categorias, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Erro na query do Supabase:', error);
        throw error;
      }

      setCategorias(categorias || []);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao carregar categorias');
      setError(error);
      toast.error('Erro ao carregar categorias');
      console.error('Erro ao carregar categorias:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return { categorias, isLoading, error };
}