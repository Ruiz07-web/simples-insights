export interface Venda {
  id: string;
  data_venda: string;
  produto_id?: string | null;
  quantidade: number;
  valor_total: number;
  metodo_pagamento?: string | null;
}

export interface Produto {
  id: string;
  nome: string;
  preco_venda: number;
  custo_unitario?: number | null;
  estoque_atual?: number | null;
  categoria_id?: string | null;
  created_at: string;
}

export interface Despesa {
  id: string;
  created_at: string;
  descricao: string;
  valor: number;
  data_vencimento: string;
  pago?: boolean | null;
  categoria?: string | null;
}

export interface DashboardStats {
  vendasHoje: number;
  lucroEstimado: number;
  contasAPagar: number;
  contasVencendo: number;
}
