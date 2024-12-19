import React from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';
import type { Produto } from '../../../types/produto';

interface AcoesBulkProps {
  selectedProducts: Produto[];
  onActionComplete: () => void;
  onClearSelection: () => void;
}

export function AcoesBulk({ selectedProducts, onActionComplete, onClearSelection }: AcoesBulkProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (selectedProducts.length === 0) return null;

  async function handleBulkDelete() {
    if (!window.confirm(`Deseja realmente excluir ${selectedProducts.length} produtos?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .in('id', selectedProducts.map(p => p.id));

      if (error) throw error;

      toast.success(`${selectedProducts.length} produtos excluídos com sucesso`);
      onActionComplete();
      onClearSelection();
    } catch (error) {
      console.error('Erro ao excluir produtos:', error);
      toast.error('Erro ao excluir produtos');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {selectedProducts.length} produtos selecionados
        </span>

        <button
          onClick={handleBulkDelete}
          disabled={isDeleting}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          {isDeleting ? 'Excluindo...' : 'Excluir Selecionados'}
        </button>

        <button
          onClick={onClearSelection}
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}