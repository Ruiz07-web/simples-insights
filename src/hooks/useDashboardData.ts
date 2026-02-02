import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Venda, Despesa, DashboardStats } from '@/types/database';

const callExternalDb = async (action: string, payload?: unknown) => {
  const { data, error } = await supabase.functions.invoke('external-db', {
    body: { action, payload },
  });

  if (error) throw error;
  return data;
};

export const useSales = () => {
  return useQuery({
    queryKey: ['vendas'],
    queryFn: async () => {
      const data = await callExternalDb('get-sales');
      return (data || []) as Venda[];
    },
  });
};

export const useExpenses = () => {
  return useQuery({
    queryKey: ['despesas'],
    queryFn: async () => {
      const data = await callExternalDb('get-expenses');
      return (data || []) as Despesa[];
    },
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const data = await callExternalDb('get-stats');
      return data as DashboardStats;
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
  return callExternalDb('create-sale', saleData);
};
