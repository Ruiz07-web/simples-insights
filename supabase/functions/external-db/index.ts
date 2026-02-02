import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const externalUrl = Deno.env.get('EXTERNAL_SUPABASE_URL');
    const externalKey = Deno.env.get('EXTERNAL_SUPABASE_ANON_KEY');

    if (!externalUrl || !externalKey) {
      console.error('Missing external Supabase credentials');
      return new Response(
        JSON.stringify({ error: 'External Supabase not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(externalUrl, externalKey);
    const { action, payload } = await req.json();

    console.log(`Processing action: ${action}`);

    let result;

    switch (action) {
      case 'get-sales': {
        const { data, error } = await supabase
          .from('vendas')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        result = data || [];
        break;
      }

      case 'get-expenses': {
        const { data, error } = await supabase
          .from('despesas')
          .select('*')
          .order('data_vencimento', { ascending: true });

        if (error) throw error;
        result = data || [];
        break;
      }

      case 'get-stats': {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];

        // Vendas de hoje
        const { data: vendasHoje } = await supabase
          .from('vendas')
          .select('valor_total')
          .gte('created_at', today);

        // Despesas não pagas
        const { data: despesasNaoPagas } = await supabase
          .from('despesas')
          .select('valor, data_vencimento')
          .eq('pago', false);

        const totalVendasHoje = vendasHoje?.reduce((acc, v) => acc + (v.valor_total || 0), 0) || 0;
        const totalDespesas = despesasNaoPagas?.reduce((acc, d) => acc + (d.valor || 0), 0) || 0;
        const contasVencendo = despesasNaoPagas?.filter(d =>
          d.data_vencimento && d.data_vencimento <= tomorrow
        ).length || 0;

        result = {
          vendasHoje: totalVendasHoje,
          lucroEstimado: totalVendasHoje - totalDespesas,
          contasAPagar: totalDespesas,
          contasVencendo,
        };
        break;
      }

      case 'create-sale': {
        const { error } = await supabase.from('vendas').insert(payload);
        if (error) throw error;
        result = { success: true };
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log(`Action ${action} completed successfully`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Edge function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
