import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Settings, ExternalLink } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

export function ConfigAlert() {
  if (isSupabaseConfigured()) return null;

  return (
    <Alert className="border-2 border-warning/30 bg-warning/5">
      <Settings className="h-5 w-5 text-warning" />
      <AlertTitle className="text-lg font-semibold">Configure seu Supabase</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p className="text-muted-foreground">
          Para conectar seu banco de dados, adicione as seguintes variáveis de ambiente:
        </p>
        <div className="p-4 bg-background rounded-lg border font-mono text-sm space-y-1">
          <p><span className="text-accent">VITE_SUPABASE_URL</span>=sua_url_do_supabase</p>
          <p><span className="text-accent">VITE_SUPABASE_ANON_KEY</span>=sua_anon_key</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Você encontra essas informações no painel do Supabase em{' '}
          <span className="font-medium">Settings → API</span>.
        </p>
      </AlertDescription>
    </Alert>
  );
}
