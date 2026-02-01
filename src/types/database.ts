export interface Venda {
  id: string;
  created_at: string;
  produto_id?: string;
  produto_nome?: string;
  quantidade: number;
  valor_total: number;
  cliente_nome?: string;
  forma_pagamento?: string;
}

export interface Produto {
  id: string;
  nome: string;
  preco: number;
  estoque?: number;
  categoria?: string;
}

export interface Despesa {
  id: string;
  created_at: string;
  descricao: string;
  valor: number;
  data_vencimento?: string;
  pago?: boolean;
  categoria?: string;
}

export interface DashboardStats {
  vendasHoje: number;
  lucroEstimado: number;
  contasAPagar: number;
  contasVencendo: number;
}
