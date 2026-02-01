import { useState } from 'react';
import { DollarSign, ShoppingCart, Receipt, Target } from 'lucide-react';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { AIInsights } from '@/components/dashboard/AIInsights';
import { ChatInput } from '@/components/dashboard/ChatInput';
import { SalesList } from '@/components/dashboard/SalesList';
import { NewSaleDialog } from '@/components/dashboard/NewSaleDialog';
import { ProfitFocusMode } from '@/components/dashboard/ProfitFocusMode';
import { ConfigAlert } from '@/components/dashboard/ConfigAlert';
import { useSales, useDashboardStats } from '@/hooks/useDashboardData';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Index = () => {
  const [focusMode, setFocusMode] = useState(false);
  const { data: sales, isLoading: salesLoading } = useSales();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Meu Negócio</h1>
              <p className="text-sm text-muted-foreground">Dashboard Inteligente</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant={focusMode ? 'default' : 'outline'}
                onClick={() => setFocusMode(!focusMode)}
                className="gap-2 rounded-xl"
              >
                <Target className="h-4 w-4" />
                Foco no Lucro
              </Button>
              <NewSaleDialog />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Config Alert */}
        <ConfigAlert />

        {focusMode ? (
          /* Modo Foco no Lucro */
          <div className="max-w-2xl mx-auto">
            <ProfitFocusMode stats={stats} isLoading={statsLoading} />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SummaryCard
                title="Vendas de Hoje"
                value={formatCurrency(stats?.vendasHoje ?? 0)}
                icon={ShoppingCart}
                variant="success"
              />
              <SummaryCard
                title="Lucro Estimado"
                value={formatCurrency(stats?.lucroEstimado ?? 0)}
                icon={DollarSign}
                variant={(stats?.lucroEstimado ?? 0) >= 0 ? 'success' : 'danger'}
              />
              <SummaryCard
                title="Contas a Pagar"
                value={formatCurrency(stats?.contasAPagar ?? 0)}
                icon={Receipt}
                trend={stats?.contasVencendo ? `${stats.contasVencendo} vencendo` : undefined}
                trendUp={false}
                variant={stats?.contasVencendo && stats.contasVencendo > 0 ? 'warning' : 'default'}
              />
            </section>

            {/* AI Insights */}
            <section>
              <AIInsights stats={stats} isLoading={statsLoading} />
            </section>

            {/* Chat and Sales */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChatInput />
              <SalesList sales={sales ?? []} isLoading={salesLoading} />
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-12">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          Dashboard Inteligente • Simplificando sua gestão
        </div>
      </footer>
    </div>
  );
};

export default Index;
