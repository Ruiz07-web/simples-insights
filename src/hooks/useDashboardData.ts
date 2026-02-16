import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Venda, Despesa, DashboardStats } from '@/types/database';

export const useSales = () => {
  return useQuery({
    queryKey: ['vendas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendas')
        .select('*')
        .order('data_venda', { ascending: false })
        .limit(10);

      if (error) throw error;
      return (data || []) as Venda[];
    },
  });
};

export const useExpenses = () => {
  return useQuery({
    queryKey: ['despesas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('despesas')
        .select('*')
        .order('data_vencimento', { ascending: true });

      if (error) throw error;
      return (data || []) as Despesa[];
    },
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const today = new Date().toISOString().split('T')[0];
      const twoDaysFromNow = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];

      // Vendas de hoje
      const { data: vendasHoje } = await supabase
        .from('vendas')
        .select('valor_total')
        .gte('data_venda', today);

      // Despesas não pagas
      const { data: despesasNaoPagas } = await supabase
        .from('despesas')
        .select('valor, data_vencimento')
        .eq('pago', false);

      const totalVendasHoje = vendasHoje?.reduce((acc, v) => acc + (Number(v.valor_total) || 0), 0) || 0;
      const totalDespesas = despesasNaoPagas?.reduce((acc, d) => acc + (Number(d.valor) || 0), 0) || 0;
      const contasVencendo = despesasNaoPagas?.filter(d =>
        d.data_vencimento && d.data_vencimento <= twoDaysFromNow
      ).length || 0;

      return {
        vendasHoje: totalVendasHoje,
        lucroEstimado: totalVendasHoje - totalDespesas,
        contasAPagar: totalDespesas,
        contasVencendo,
      };
    },
  });
};

export const createSale = async (saleData: {
  produto_nome: string;
  quantidade: number;
  valor_total: number;
  cliente_nome: string | null;
  forma_pagamento: string;
}) => {
  const { error } = await supabase.from('vendas').insert({
    quantidade: saleData.quantidade,
    valor_total: saleData.valor_total,
    metodo_pagamento: saleData.forma_pagamento,
  });
  if (error) throw error;
  return { success: true };
};
