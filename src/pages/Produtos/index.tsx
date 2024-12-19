import React from 'react';
import { ListaProdutos } from './components/ListaProdutos';
import { BotaoNovoProduto } from './components/BotaoNovoProduto';
import { FiltrosProdutos } from './components/FiltrosProdutos';
import { AcoesBulk } from './components/AcoesBulk';
import { useProdutos } from './hooks/useProdutos';
import type { Produto } from '../../types/produto';

export default function Produtos() {
  const [filters, setFilters] = React.useState({
    search: '',
    categoria: '',
    serie: '',
    moeda: ''
  });
  const [selectedProducts, setSelectedProducts] = React.useState<Produto[]>([]);

  const {
    produtos,
    isLoading,
    error,
    handleDelete
  } = useProdutos();

  const filteredProdutos = React.useMemo(() => {
    return produtos.filter(produto => {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = !filters.search || 
        produto.codigo_interno.toLowerCase().includes(searchLower) ||
        produto.modelo.toLowerCase().includes(searchLower) ||
        produto.descricao.toLowerCase().includes(searchLower);

      const matchesCategoria = !filters.categoria || produto.categoria_id === filters.categoria;
      const matchesSerie = !filters.serie || produto.serie === (filters.serie === 'true');
      const matchesMoeda = !filters.moeda || produto.moeda === filters.moeda;

      return matchesSearch && matchesCategoria && matchesSerie && matchesMoeda;
    });
  }, [produtos, filters]);

  function handleFilterChange(name: string, value: string) {
    setFilters(prev => ({ ...prev, [name]: value }));
  }

  function handleClearFilters() {
    setFilters({
      search: '',
      categoria: '',
      serie: '',
      moeda: ''
    });
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400">
        Erro ao carregar produtos: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Produtos
        </h1>
        <BotaoNovoProduto />
      </div>

      <FiltrosProdutos
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      <ListaProdutos 
        produtos={filteredProdutos}
        isLoading={isLoading}
        onDelete={handleDelete}
        onDuplicate={() => {
          // Refresh the products list after duplication
          window.location.reload();
        }}
        selectedProducts={selectedProducts}
        onSelectionChange={setSelectedProducts}
      />

      <AcoesBulk
        selectedProducts={selectedProducts}
        onActionComplete={() => {
          window.location.reload();
        }}
        onClearSelection={() => setSelectedProducts([])}
      />
    </div>
  );
}