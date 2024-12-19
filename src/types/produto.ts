export interface Produto {
  id: string;
  codigo_interno: string;
  categoria_id: string;
  modelo: string;
  marca_comercial: string;
  descricao: string;
  descricao_resumida: string;
  ncm: string;
  ean: string;
  serie: boolean;
  unidade_medida: string;
  valor_unitario: number;
  moeda: string;
  created_at: string;
  updated_at: string;
}