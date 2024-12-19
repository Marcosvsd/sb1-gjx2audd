import { supabase } from '../lib/supabase';
import { calculateCubicWeight, calculateVolume } from '../utils/calculateProductFields';
import type { Dimensao } from '../types/dimensao';

interface DimensionInput {
  produto_id: string;
  comprimento: number;
  largura: number;
  altura: number;
  peso_liquido: number;
  peso_bruto: number;
}

function validateDimensions(data: DimensionInput | Omit<DimensionInput, 'produto_id'>): void {
  const { comprimento, largura, altura, peso_liquido, peso_bruto } = data;
  
  if (comprimento <= 0) throw new Error('Comprimento deve ser maior que zero');
  if (largura <= 0) throw new Error('Largura deve ser maior que zero');
  if (altura <= 0) throw new Error('Altura deve ser maior que zero');
  if (peso_liquido <= 0) throw new Error('Peso líquido deve ser maior que zero');
  if (peso_bruto <= 0) throw new Error('Peso bruto deve ser maior que zero');
  if (peso_bruto < peso_liquido) throw new Error('Peso bruto não pode ser menor que o peso líquido');
}

export async function createDimension(data: DimensionInput): Promise<Dimensao> {
  // Validate dimensions before proceeding
  validateDimensions(data);

  // Calculate derived values
  const peso_cubico = calculateCubicWeight(data);
  const volume = calculateVolume(data);

  // Prepare complete dimension data
  const dimensionData = {
    ...data,
    peso_cubico,
    volume
  };

  const { data: dimension, error } = await supabase
    .from('dimensoes')
    .insert([dimensionData])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar dimensões:', error);
    throw error;
  }

  if (!dimension) {
    throw new Error('Falha ao criar dimensões: nenhum dado retornado');
  }

  return dimension;
}

export async function updateDimension(produto_id: string, data: Omit<DimensionInput, 'produto_id'>): Promise<void> {
  // Validate dimensions before proceeding
  validateDimensions(data);

  // Calculate derived values
  const peso_cubico = calculateCubicWeight(data);
  const volume = calculateVolume(data);

  // Prepare complete dimension data
  const dimensionData = {
    ...data,
    peso_cubico,
    volume
  };

  const { error } = await supabase
    .from('dimensoes')
    .update(dimensionData)
    .eq('produto_id', produto_id);

  if (error) {
    console.error('Erro ao atualizar dimensões:', error);
    throw error;
  }
}

export async function getDimension(produto_id: string): Promise<Dimensao | null> {
  const { data, error } = await supabase
    .from('dimensoes')
    .select('*')
    .eq('produto_id', produto_id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Erro ao buscar dimensões:', error);
    throw error;
  }

  return data;
}