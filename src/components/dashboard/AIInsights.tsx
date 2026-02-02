import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardStats } from '@/types/database';

interface AIInsightsProps {
  stats: DashboardStats | undefined;
  isLoading: boolean;
}

interface Insight {
  message: string;
  type: 'success' | 'warning' | 'info';
  icon: typeof TrendingUp;
}

function generateInsights(stats: DashboardStats | undefined): Insight[] {
  if (!stats) return [];
  
  const insights: Insight[] = [];

  // Vendas
  if (stats.vendasHoje > 0) {
    insights.push({
      message: `Ótimo! Você já vendeu R$ ${stats.vendasHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} hoje.`,
      type: 'success',
      icon: TrendingUp,
    });
  } else {
    insights.push({
      message: 'Ainda não há vendas registradas hoje. Que tal verificar o estoque?',
      type: 'info',
      icon: Lightbulb,
    });
  }

  // Contas vencendo
  if (stats.contasVencendo > 0) {
    insights.push({
      message: `Atenção: Você tem ${stats.contasVencendo} conta${stats.contasVencendo > 1 ? 's' : ''} vencendo nos próximos 2 dias.`,
      type: 'warning',
      icon: AlertTriangle,
    });
  }

  // Lucro
  if (stats.lucroEstimado > 0) {
    insights.push({
      message: `Seu caixa está positivo em R$ ${stats.lucroEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`,
      type: 'success',
      icon: CheckCircle2,
    });
  } else if (stats.lucroEstimado < 0) {
    insights.push({
      message: `Cuidado: Suas despesas estão maiores que as vendas em R$ ${Math.abs(stats.lucroEstimado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`,
      type: 'warning',
      icon: AlertTriangle,
    });
  }

  return insights;
}

const typeStyles = {
  success: 'bg-success/5 border-success/20 text-success',
  warning: 'bg-warning/5 border-warning/20 text-warning',
  info: 'bg-accent/5 border-accent/20 text-accent',
};

export function AIInsights({ stats, isLoading }: AIInsightsProps) {
  const insights = generateInsights(stats);

  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-primary/10">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          O que está acontecendo no seu negócio?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : insights.length > 0 ? (
          insights.map((insight, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-4 p-4 rounded-xl border-2 transition-all',
                typeStyles[insight.type]
              )}
            >
              <insight.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-base font-medium text-foreground leading-relaxed">
                {insight.message}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Carregando insights do seu negócio...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
