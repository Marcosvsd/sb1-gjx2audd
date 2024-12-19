import React from 'react';
import { Pencil, Trash2, Copy, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { Produto } from '../../../types/produto';
import { useCategorias } from '../../../hooks/useCategorias';
import { Modal } from '../../../components/Modal';
import { FormularioProduto } from './FormularioProduto';
import { duplicateProduto } from '../utils/duplicateProduto';
import { DetalheProduto } from './DetalheProduto';

interface SortConfig {
  field: keyof Produto | '';
  direction: 'asc' | 'desc';
}

interface ListaProdutosProps {
  produtos: Produto[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<void>;
  onDuplicate: () => void;
  selectedProducts: Produto[];
  onSelectionChange: (products: Produto[]) => void;
}

export function ListaProdutos({ 
  produtos, 
  isLoading, 
  onDelete, 
  onDuplicate,
  selectedProducts,
  onSelectionChange 
}: ListaProdutosProps) {
  const { categorias } = useCategorias();
  const [editingProduto, setEditingProduto] = React.useState<Produto | null>(null);
  const [selectedProduto, setSelectedProduto] = React.useState<Produto | null>(null);
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({ field: '', direction: 'asc' });

  const sortedProdutos = React.useMemo(() => {
    if (!sortConfig.field) return produtos;

    return [...produtos].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [produtos, sortConfig]);

  const handleSort = (field: keyof Produto) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIcon = ({ field }: { field: keyof Produto }) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4 ml-1" />
      : <ArrowDown className="w-4 h-4 ml-1" />;
  };

  function handleSelectAll(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      onSelectionChange(produtos);
    } else {
      onSelectionChange([]);
    }
  }

  function handleSelectProduct(produto: Produto) {
    if (selectedProducts.find(p => p.id === produto.id)) {
      onSelectionChange(selectedProducts.filter(p => p.id !== produto.id));
    } else {
      onSelectionChange([...selectedProducts, produto]);
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        ))}
      </div>
    );
  }

  if (produtos.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          Nenhum produto cadastrado
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedProducts.length === produtos.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Código Interno
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort('modelo')}
              >
                <div className="flex items-center">
                  Modelo
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <SortIcon field="modelo" />
                  </span>
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort('marca_comercial')}
              >
                <div className="flex items-center">
                  Marca
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <SortIcon field="marca_comercial" />
                  </span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Categoria
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort('descricao')}
              >
                <div className="flex items-center">
                  Descrição
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <SortIcon field="descricao" />
                  </span>
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort('ncm')}
              >
                <div className="flex items-center">
                  NCM
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <SortIcon field="ncm" />
                  </span>
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort('valor_unitario')}
              >
                <div className="flex items-center">
                  Valor
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <SortIcon field="valor_unitario" />
                  </span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Série
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedProdutos.map((produto) => (
              <tr 
                key={produto.id} 
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={(e) => {
                  // Only open details if not clicking on action buttons
                  if (!(e.target as HTMLElement).closest('button')) {
                    setSelectedProduto(produto);
                  }
                }}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={!!selectedProducts.find(p => p.id === produto.id)}
                    onChange={() => handleSelectProduct(produto)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {produto.codigo_interno}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {produto.modelo}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {produto.marca_comercial}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {categorias.find(c => c.id === produto.categoria_id)?.nome}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {produto.descricao}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {produto.ncm}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: produto.moeda
                  }).format(produto.valor_unitario)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {produto.serie ? 'Sim' : 'Não'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingProduto(produto);
                    }}
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      await duplicateProduto(produto);
                      onDuplicate();
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3"
                    title="Duplicar"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(produto.id);
                    }}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!editingProduto}
        onClose={() => setEditingProduto(null)}
        title="Editar Produto"
      >
        <FormularioProduto
          produto={editingProduto || undefined}
          onSuccess={() => {
            setEditingProduto(null);
            window.location.reload();
          }}
          onCancel={() => setEditingProduto(null)}
        />
      </Modal>

      <DetalheProduto
        produto={selectedProduto}
        onClose={() => setSelectedProduto(null)}
      />
    </div>
  );
}