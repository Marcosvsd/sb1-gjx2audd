import React from 'react';
import { toast } from 'react-hot-toast';
import { useCategorias } from '../../../hooks/useCategorias';
import { useProdutoCompleto } from '../../../hooks/useProdutoCompleto';
import { calculateShortDescription, calculateCubicWeight, calculateVolume } from '../../../utils/calculateProductFields';
import { createProduct, updateProduct } from '../../../services/productService';
import type { Produto } from '../../../types/produto';

interface FormularioProdutoProps {
  onSuccess: () => void;
  onCancel: () => void;
  produto?: Produto;
}

export function FormularioProduto({ onSuccess, onCancel, produto }: FormularioProdutoProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { categorias, isLoading: isLoadingCategorias } = useCategorias();
  const { produto: produtoCompleto, isLoading: isLoadingProduto } = useProdutoCompleto(produto?.id);
  const [selectedCategory, setSelectedCategory] = React.useState(produto?.categoria_id || '');
  const [dimensoes, setDimensoes] = React.useState({
    comprimento: '',
    largura: '',
    altura: '',
    peso_liquido: '',
    peso_bruto: ''
  });

  // Update dimensions when product data is loaded
  React.useEffect(() => {
    if (produtoCompleto?.dimensoes) {
      setDimensoes({
        comprimento: produtoCompleto.dimensoes.comprimento.toString(),
        largura: produtoCompleto.dimensoes.largura.toString(),
        altura: produtoCompleto.dimensoes.altura.toString(),
        peso_liquido: produtoCompleto.dimensoes.peso_liquido.toString(),
        peso_bruto: produtoCompleto.dimensoes.peso_bruto.toString()
      });
    }
  }, [produtoCompleto]);

  const [dimensoesErrors, setDimensoesErrors] = React.useState({
    comprimento: '',
    largura: '',
    altura: '',
    peso_liquido: '',
    peso_bruto: ''
  });

  const validateDimensoes = () => {
    const errors = {
      comprimento: '',
      largura: '',
      altura: '',
      peso_liquido: '',
      peso_bruto: ''
    };

    if (!dimensoes.comprimento || Number(dimensoes.comprimento) <= 0) {
      errors.comprimento = 'Comprimento deve ser maior que zero';
    }
    if (!dimensoes.largura || Number(dimensoes.largura) <= 0) {
      errors.largura = 'Largura deve ser maior que zero';
    }
    if (!dimensoes.altura || Number(dimensoes.altura) <= 0) {
      errors.altura = 'Altura deve ser maior que zero';
    }
    if (!dimensoes.peso_liquido || Number(dimensoes.peso_liquido) <= 0) {
      errors.peso_liquido = 'Peso líquido deve ser maior que zero';
    }
    if (!dimensoes.peso_bruto || Number(dimensoes.peso_bruto) <= 0) {
      errors.peso_bruto = 'Peso bruto deve ser maior que zero';
    }
    if (Number(dimensoes.peso_bruto) < Number(dimensoes.peso_liquido)) {
      errors.peso_bruto = 'Peso bruto não pode ser menor que o peso líquido';
    }

    setDimensoesErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (!validateDimensoes()) {
      toast.error('Verifique as dimensões do produto');
      return;
    }

    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    // Prepare product data
    const produtoData = {
      categoria_id: selectedCategory,
      marca_comercial: formData.get('marca_comercial') as string,
      modelo: formData.get('modelo') as string,
      descricao: formData.get('descricao'),
      descricao_resumida: calculateShortDescription(formData.get('descricao') as string || ''),
      ncm: formData.get('ncm'),
      ean: formData.get('ean'),
      unidade_medida: formData.get('unidade_medida'),
      valor_unitario: Number(formData.get('valor_unitario')),
      moeda: formData.get('moeda'),
      serie: formData.get('serie') === 'true'
    };

    // Prepare dimensions data
    const dimensoesData = {
      comprimento: Number(dimensoes.comprimento),
      largura: Number(dimensoes.largura),
      altura: Number(dimensoes.altura),
      peso_liquido: Number(dimensoes.peso_liquido),
      peso_bruto: Number(dimensoes.peso_bruto)
    };

    try {
      if (produto) {
        await updateProduct(produto.id, produtoData, dimensoesData);
        toast.success('Produto atualizado com sucesso');
      } else {
        await createProduct(produtoData, dimensoesData);
        toast.success('Produto cadastrado com sucesso');
      }

      onSuccess();
    } catch (error) {
      const action = produto ? 'atualizar' : 'cadastrar';
      toast.error(`Erro ao ${action} produto`);
      console.error(`Erro ao ${action} produto:`, error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="categoria_id" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Categoria
          </label>
          <select
            name="categoria_id"
            id="categoria_id"
            required
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="">Selecione uma categoria</option>
            {!isLoadingCategorias && categorias && categorias.length > 0 ? (
              categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome} ({categoria.codigo})
              </option>
              ))
            ) : (
              <option disabled>Carregando categorias...</option>
            )}
          </select>
        </div>

        <div>
          <label htmlFor="modelo" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Modelo
          </label>
          <input
            type="text"
            name="modelo"
            id="modelo"
            required
            defaultValue={produto?.modelo || ''}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="marca_comercial" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Marca Comercial
          </label>
          <input
            type="text"
            name="marca_comercial"
            id="marca_comercial"
            required
            defaultValue={produto?.marca_comercial || ''}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="ncm" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            NCM
          </label>
          <input
            type="text"
            name="ncm"
            id="ncm"
            required
            defaultValue={produto?.ncm || ''}
            maxLength={8}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Descrição
          </label>
          <textarea
            name="descricao"
            id="descricao"
            required
            defaultValue={produto?.descricao || ''}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="ean" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            EAN
          </label>
          <input
            type="text"
            name="ean"
            id="ean"
            pattern="[0-9]{13}"
            title="EAN deve conter 13 dígitos"
            defaultValue={produto?.ean || ''}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="serie" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Controle de Série
          </label>
          <select
            name="serie"
            id="serie"
            required
            defaultValue={produto?.serie ? 'true' : 'false'}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
        </div>

        <div className="sm:col-span-2 grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="comprimento" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Comprimento (cm)
            </label>
            <input
              type="number"
              name="comprimento"
              id="comprimento"
              step="0.1"
              min="0.1"
              value={dimensoes.comprimento}
              onChange={(e) => {
                setDimensoes(prev => ({ ...prev, comprimento: e.target.value }));
                setDimensoesErrors(prev => ({ ...prev, comprimento: '' }));
              }}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
            {dimensoesErrors.comprimento && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {dimensoesErrors.comprimento}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="largura" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Largura (cm)
            </label>
            <input
              type="number"
              name="largura"
              id="largura"
              step="0.1"
              min="0.1"
              value={dimensoes.largura}
              onChange={(e) => {
                setDimensoes(prev => ({ ...prev, largura: e.target.value }));
                setDimensoesErrors(prev => ({ ...prev, largura: '' }));
              }}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
            {dimensoesErrors.largura && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {dimensoesErrors.largura}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="altura" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Altura (cm)
            </label>
            <input
              type="number"
              name="altura"
              id="altura"
              step="0.1"
              min="0.1"
              value={dimensoes.altura}
              onChange={(e) => {
                setDimensoes(prev => ({ ...prev, altura: e.target.value }));
                setDimensoesErrors(prev => ({ ...prev, altura: '' }));
              }}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
            {dimensoesErrors.altura && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {dimensoesErrors.altura}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="peso_liquido" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Peso Líquido (kg)
          </label>
          <input
            type="number"
            name="peso_liquido"
            id="peso_liquido"
            required
            min="0.001"
            value={dimensoes.peso_liquido}
            onChange={(e) => {
              setDimensoes(prev => ({ ...prev, peso_liquido: e.target.value }));
              setDimensoesErrors(prev => ({ ...prev, peso_liquido: '' }));
            }}
            step="0.001"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
          {dimensoesErrors.peso_liquido && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {dimensoesErrors.peso_liquido}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="peso_bruto" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Peso Bruto (kg)
          </label>
          <input
            type="number"
            name="peso_bruto"
            id="peso_bruto"
            required
            min="0.001"
            value={dimensoes.peso_bruto}
            onChange={(e) => {
              setDimensoes(prev => ({ ...prev, peso_bruto: e.target.value }));
              setDimensoesErrors(prev => ({ ...prev, peso_bruto: '' }));
            }}
            step="0.001"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
          {dimensoesErrors.peso_bruto && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {dimensoesErrors.peso_bruto}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="unidade_medida" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Unidade de Medida
          </label>
          <select
            name="unidade_medida"
            id="unidade_medida"
            required
            defaultValue={produto?.unidade_medida || ''}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="UN">Unidade</option>
            <option value="KG">Quilograma</option>
            <option value="MT">Metro</option>
            <option value="M2">Metro Quadrado</option>
            <option value="M3">Metro Cúbico</option>
            <option value="PC">Peça</option>
            <option value="CX">Caixa</option>
          </select>
        </div>

        <div>
          <label htmlFor="valor_unitario" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Valor Unitário
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              name="valor_unitario"
              id="valor_unitario"
              required
              defaultValue={produto?.valor_unitario || ''}
              step="0.01"
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 pr-12 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <select
                name="moeda"
                defaultValue={produto?.moeda || 'BRL'}
                className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option>BRL</option>
                <option>USD</option>
                <option>EUR</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : produto ? 'Atualizar' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}