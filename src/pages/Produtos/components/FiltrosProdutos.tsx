import React from 'react';
import { Search, X } from 'lucide-react';
import { useCategorias } from '../../../hooks/useCategorias';

interface FiltrosProdutosProps {
  filters: {
    search: string;
    categoria: string;
    serie: string;
    moeda: string;
  };
  onFilterChange: (name: string, value: string) => void;
  onClearFilters: () => void;
}

export function FiltrosProdutos({ filters, onFilterChange, onClearFilters }: FiltrosProdutosProps) {
  const { categorias } = useCategorias();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Buscar
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm pl-10"
              placeholder="Código, modelo, descrição..."
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Categoria
          </label>
          <select
            id="categoria"
            value={filters.categoria}
            onChange={(e) => onFilterChange('categoria', e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="">Todas</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="serie" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Controle de Série
          </label>
          <select
            id="serie"
            value={filters.serie}
            onChange={(e) => onFilterChange('serie', e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="">Todos</option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </div>

        <div>
          <label htmlFor="moeda" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Moeda
          </label>
          <select
            id="moeda"
            value={filters.moeda}
            onChange={(e) => onFilterChange('moeda', e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="">Todas</option>
            <option value="BRL">Real (BRL)</option>
            <option value="USD">Dólar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onClearFilters}
          className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <X className="w-4 h-4 mr-1" />
          Limpar Filtros
        </button>
      </div>
    </div>
  );
}