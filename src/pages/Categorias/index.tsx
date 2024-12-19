import React from 'react';
import { ListaCategorias } from './components/ListaCategorias';
import { BotaoNovaCategoria } from './components/BotaoNovaCategoria';
import { useCategorias } from '../../hooks/useCategorias';

export default function Categorias() {
  const { categorias, isLoading, error } = useCategorias();

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400">
        Erro ao carregar categorias: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Categorias
        </h1>
        <BotaoNovaCategoria />
      </div>

      <ListaCategorias 
        categorias={categorias}
        isLoading={isLoading}
      />
    </div>
  );
}