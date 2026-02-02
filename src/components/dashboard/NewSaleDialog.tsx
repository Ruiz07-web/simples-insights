import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, ShoppingCart } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function NewSaleDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    produto_nome: '',
    quantidade: 1,
    valor_total: '',
    cliente_nome: '',
    forma_pagamento: 'dinheiro',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSupabaseConfigured()) {
      toast.error('Configure o Supabase primeiro nas variáveis de ambiente.');
      return;
    }

    setIsLoading(true);
    try {
      if (!supabase) {
        throw new Error('Supabase não configurado');
      }
      const { error } = await supabase.from('vendas').insert({
        produto_nome: formData.produto_nome,
        quantidade: formData.quantidade,
        valor_total: parseFloat(formData.valor_total.replace(',', '.')),
        cliente_nome: formData.cliente_nome || null,
        forma_pagamento: formData.forma_pagamento,
      });

      if (error) throw error;

      toast.success('Venda registrada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['vendas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setOpen(false);
      setFormData({
        produto_nome: '',
        quantidade: 1,
        valor_total: '',
        cliente_nome: '',
        forma_pagamento: 'dinheiro',
      });
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      toast.error('Erro ao registrar venda. Verifique os dados e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="h-12 px-6 rounded-xl gap-2 text-base font-semibold">
          <Plus className="h-5 w-5" />
          Registrar Nova Venda
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            Nova Venda
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="produto" className="text-base">Produto *</Label>
            <Input
              id="produto"
              value={formData.produto_nome}
              onChange={(e) => setFormData(prev => ({ ...prev, produto_nome: e.target.value }))}
              placeholder="Nome do produto"
              className="h-12 text-base"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantidade" className="text-base">Quantidade *</Label>
              <Input
                id="quantidade"
                type="number"
                min="1"
                value={formData.quantidade}
                onChange={(e) => setFormData(prev => ({ ...prev, quantidade: parseInt(e.target.value) || 1 }))}
                className="h-12 text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor" className="text-base">Valor Total (R$) *</Label>
              <Input
                id="valor"
                value={formData.valor_total}
                onChange={(e) => setFormData(prev => ({ ...prev, valor_total: e.target.value }))}
                placeholder="0,00"
                className="h-12 text-base"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cliente" className="text-base">Cliente (opcional)</Label>
            <Input
              id="cliente"
              value={formData.cliente_nome}
              onChange={(e) => setFormData(prev => ({ ...prev, cliente_nome: e.target.value }))}
              placeholder="Nome do cliente"
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pagamento" className="text-base">Forma de Pagamento</Label>
            <Select
              value={formData.forma_pagamento}
              onValueChange={(value) => setFormData(prev => ({ ...prev, forma_pagamento: value }))}
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                <SelectItem value="boleto">Boleto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Confirmar Venda'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
