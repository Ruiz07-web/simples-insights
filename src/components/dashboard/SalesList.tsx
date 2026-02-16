import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingBag, Clock, CreditCard } from 'lucide-react';
import { Venda } from '@/types/database';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SalesListProps {
  sales: Venda[];
  isLoading: boolean;
}

export function SalesList({ sales, isLoading }: SalesListProps) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '—';
    try {
      return format(new Date(dateString), "dd 'de' MMM, HH:mm", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-primary/10">
            <ShoppingBag className="h-5 w-5 text-primary" />
          </div>
          Vendas Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : sales.length > 0 ? (
            <div className="space-y-3">
              {sales.map((sale) => (
                <div
                  key={sale.id}
                  className="p-4 bg-secondary/50 rounded-xl border border-border hover:bg-secondary transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">
                        {`Venda #${sale.id.slice(0, 8)}`}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(sale.data_venda)}
                        </span>
                        {sale.metodo_pagamento && (
                          <span className="flex items-center gap-1">
                            <CreditCard className="h-3 w-3" />
                            {sale.metodo_pagamento}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-success">
                        R$ {sale.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sale.quantidade} {sale.quantidade === 1 ? 'item' : 'itens'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Nenhuma venda encontrada.</p>
              <p className="text-sm">Registre sua primeira venda!</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
