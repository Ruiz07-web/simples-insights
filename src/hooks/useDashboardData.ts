import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Venda, Despesa, DashboardStats } from '@/types/database';

export const useSales = () => {
  return useQuery({
    queryKey: ['vendas'],
    queryFn: async () => {
      if (!isSupabaseConfigured() || !supabase) {
        return [];
      }
      const { data, error } = await supabase
        .from('vendas')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return (data || []) as Venda[];
    },
    enabled: isSupabaseConfigured(),
  });
};

export const useExpenses = () => {
  return useQuery({
    queryKey: ['despesas'],
    queryFn: async () => {
      if (!isSupabaseConfigured() || !supabase) {
        return [];
      }
      const { data, error } = await supabase
        .from('despesas')
        .select('*')
        .order('data_vencimento', { ascending: true });
      
      if (error) throw error;
      return (data || []) as Despesa[];
    },
    enabled: isSupabaseConfigured(),
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      if (!isSupabaseConfigured() || !supabase) {
        return {
          vendasHoje: 0,
          lucroEstimado: 0,
          contasAPagar: 0,
          contasVencendo: 0,
        };
      }

      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];

      // Vendas de hoje
      const { data: vendasHoje } = await supabase
        .from('vendas')
        .select('valor_total')
        .gte('created_at', today);

      // Total de despesas não pagas
      const { data: despesasNaoPagas } = await supabase
        .from('despesas')
        .select('valor, data_vencimento')
        .eq('pago', false);

      const totalVendasHoje = vendasHoje?.reduce((acc, v) => acc + (v.valor_total || 0), 0) || 0;
      const totalDespesas = despesasNaoPagas?.reduce((acc, d) => acc + (d.valor || 0), 0) || 0;
      const contasVencendo = despesasNaoPagas?.filter(d => 
        d.data_vencimento && d.data_vencimento <= tomorrow
      ).length || 0;

      return {
        vendasHoje: totalVendasHoje,
        lucroEstimado: totalVendasHoje - totalDespesas,
        contasAPagar: totalDespesas,
        contasVencendo,
      };
    },
    enabled: isSupabaseConfigured(),
  });
};
