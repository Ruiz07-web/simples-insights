import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { DashboardStats } from '@/types/database';
import { cn } from '@/lib/utils';

interface ProfitFocusModeProps {
  stats: DashboardStats | undefined;
  isLoading: boolean;
}

export function ProfitFocusMode({ stats, isLoading }: ProfitFocusModeProps) {
  const lucro = stats?.lucroEstimado ?? 0;
  const isPositive = lucro >= 0;

  return (
    <Card className={cn(
      'border-2 transition-all',
      isPositive ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'
    )}>
      <CardContent className="p-8">
        <div className="text-center">
          <div className={cn(
            'inline-flex items-center justify-center w-20 h-20 rounded-full mb-6',
            isPositive ? 'bg-success/10' : 'bg-destructive/10'
          )}>
            {isLoading ? (
              <div className="w-10 h-10 bg-muted animate-pulse rounded-full" />
            ) : isPositive ? (
              <TrendingUp className="h-10 w-10 text-success" />
            ) : (
              <TrendingDown className="h-10 w-10 text-destructive" />
            )}
          </div>
          
          <h2 className="text-lg font-medium text-muted-foreground mb-2">
            Foco no Lucro
          </h2>
          
          {isLoading ? (
            <div className="h-12 bg-muted animate-pulse rounded-lg w-48 mx-auto" />
          ) : (
            <>
              <p className={cn(
                'text-4xl font-bold mb-4',
                isPositive ? 'text-success' : 'text-destructive'
              )}>
                {isPositive ? '+' : '-'} R$ {Math.abs(lucro).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              
              <p className="text-base text-muted-foreground max-w-sm mx-auto">
                {isPositive 
                  ? 'É o que sobrou no caixa após pagar todas as despesas. Continue assim!' 
                  : 'Suas despesas estão maiores que suas vendas. Atenção ao fluxo de caixa!'}
              </p>
            </>
          )}
          
          {!isPositive && stats && (
            <div className="mt-6 p-4 bg-destructive/10 rounded-xl inline-flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm font-medium">
                Você tem R$ {stats.contasAPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em contas a pagar
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
