import React from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';
import { generateCategoryCode } from '../../../utils/generateCategoryCode';
import type { Categoria } from '../../../types/categoria';

interface FormularioCategoriaProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function FormularioCategoria({ onSuccess, onCancel }: FormularioCategoriaProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [codigoError, setCodigoError] = React.useState<string | null>(null);

  async function validateCategoryCode(code: string) {
    try {
      await generateCategoryCode(code);
      setCodigoError(null);
      return true;
    } catch (error) {
      setCodigoError(error instanceof Error ? error.message : 'Código inválido');
      return false;
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const codigo = formData.get('codigo') as string;

    try {
      // Validate code before submitting
      const isValid = await validateCategoryCode(codigo);
      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      const categoria = {
        codigo: codigo.toUpperCase(),
        nome: formData.get('nome'),
        descricao: formData.get('descricao') || null,
      } as Partial<Categoria>;

      console.log('Tentando cadastrar categoria:', categoria);

      const { error } = await supabase
        .from('categorias')
        .insert([categoria])
        .select();

      if (error) throw error;

      toast.success('Categoria cadastrada com sucesso');
      onSuccess();
    } catch (error) {
      console.error('Erro detalhado ao cadastrar categoria:', error);
      toast.error('Erro ao cadastrar categoria');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCodigoBlur(e: React.FocusEvent<HTMLInputElement>) {
    const code = e.target.value;
    if (code) {
      await validateCategoryCode(code);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Código
          </label>
          <input
            type="text"
            name="codigo"
            id="codigo"
            required
            placeholder="CATG"
            maxLength={4}
            onBlur={handleCodigoBlur}
            pattern="[A-Za-z]{4}"
            title="O código deve ter exatamente 4 letras"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
          {codigoError && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {codigoError}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Digite um código único de 4 letras (ex: CATG, PROD)
          </p>
        </div>

        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Nome
          </label>
          <input
            type="text"
            name="nome"
            id="nome"
            required
            maxLength={100}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Descrição
          </label>
          <textarea
            name="descricao"
            id="descricao"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
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
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}