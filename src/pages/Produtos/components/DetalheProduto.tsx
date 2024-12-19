import React from 'react';
import { Modal } from '../../../components/Modal';
import type { Produto } from '../../../types/produto';
import { useCategorias } from '../../../hooks/useCategorias';
import { useProdutoDimensoes } from '../../../hooks/useProdutoDimensoes';

interface DetalheProdutoProps {
  produto: Produto | null;
  onClose: () => void;
}

export function DetalheProduto({ produto, onClose }: DetalheProdutoProps) {
  const { categorias } = useCategorias();
  const { dimensoes } = useProdutoDimensoes(produto);
  
  if (!produto) return null;

  const categoria = categorias.find(c => c.id === produto.categoria_id);

  const formatValue = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(value);

  const formatCurrency = (value: number, currency: string) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency
    }).format(value);

  return (
    <Modal
      isOpen={!!produto}
      onClose={onClose}
      title={`Detalhes do Produto - ${produto.codigo_interno}`}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Categoria
            </h3>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {categoria?.nome} ({categoria?.codigo})
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Modelo
            </h3>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {produto.modelo}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Marca Comercial
            </h3>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {produto.marca_comercial}
            </p>
          </div>

          <div className="col-span-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Descrição Completa
            </h3>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {produto.descricao}
            </p>
          </div>

          <div className="col-span-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Descrição Resumida
            </h3>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {produto.descricao_resumida}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              NCM
            </h3>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {produto.ncm}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              EAN
            </h3>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {produto.ean || 'Não informado'}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Controle de Série
            </h3>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {produto.serie ? 'Sim' : 'Não'}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Unidade de Medida
            </h3>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {produto.unidade_medida}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            Dimensões e Peso
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Comprimento</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatValue(dimensoes?.comprimento || 0)} cm
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Largura</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatValue(dimensoes?.largura || 0)} cm
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Altura</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatValue(dimensoes?.altura || 0)} cm
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Peso Líquido</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatValue(dimensoes?.peso_liquido || 0)} kg
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Peso Bruto</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatValue(dimensoes?.peso_bruto || 0)} kg
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Peso Cúbico</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatValue(dimensoes?.peso_cubico || 0)} kg
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Volume</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatValue(dimensoes?.volume || 0)} m³
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            Valor
          </h3>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(produto.valor_unitario, produto.moeda)}
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 text-xs text-gray-500 dark:text-gray-400">
          <p>Criado em: {new Date(produto.created_at).toLocaleString()}</p>
          <p>Última atualização: {new Date(produto.updated_at).toLocaleString()}</p>
        </div>
      </div>
    </Modal>
  );
}