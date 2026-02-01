import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Send, MessageCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const DEMO_RESPONSES: Record<string, string> = {
  'vendas': 'Você teve 15 vendas hoje, totalizando R$ 2.450,00. O produto mais vendido foi "Camiseta Básica".',
  'lucro': 'Seu lucro estimado este mês é de R$ 8.200,00, considerando vendas menos despesas.',
  'estoque': 'Você tem 3 produtos com estoque baixo: Camiseta P (2 unidades), Calça Jeans (1 unidade) e Tênis 42 (0 unidades).',
  'boletos': 'Você tem 2 boletos vencendo esta semana: Aluguel (R$ 1.500,00 - vence amanhã) e Internet (R$ 150,00 - vence em 3 dias).',
  'default': 'Não encontrei informações específicas sobre isso. Tente perguntar sobre vendas, lucro, estoque ou boletos.',
};

function getResponse(question: string): string {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('vend')) return DEMO_RESPONSES.vendas;
  if (lowerQuestion.includes('lucr') || lowerQuestion.includes('ganh')) return DEMO_RESPONSES.lucro;
  if (lowerQuestion.includes('estoqu') || lowerQuestion.includes('produt')) return DEMO_RESPONSES.estoque;
  if (lowerQuestion.includes('bolet') || lowerQuestion.includes('cont') || lowerQuestion.includes('pag')) return DEMO_RESPONSES.boletos;
  
  return DEMO_RESPONSES.default;
}

export function ChatInput() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = query.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setQuery('');
    setIsTyping(true);

    // Simular delay de resposta
    setTimeout(() => {
      const response = getResponse(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <Card className="border-2">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-accent/10">
            <MessageCircle className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-xl font-semibold">Pergunte à sua loja</h3>
        </div>

        {messages.length > 0 && (
          <div className="mb-4 max-h-64 overflow-y-auto space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-8'
                    : 'bg-muted text-foreground mr-8'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            ))}
            {isTyping && (
              <div className="bg-muted p-3 rounded-xl mr-8">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: Quanto vendi hoje? Tenho boletos vencendo?"
              className="pl-12 h-12 text-base border-2 rounded-xl"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 px-6 rounded-xl">
            <Send className="h-5 w-5" />
          </Button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {['Vendas de hoje', 'Meu lucro', 'Estoque baixo', 'Contas a pagar'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setQuery(suggestion)}
              className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
