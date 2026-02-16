# Simples Insights

Painel inteligente de gestão financeira — vendas, despesas, produtos e insights gerados por IA.

## Tecnologias

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Supabase** (banco de dados, edge functions)
- **Recharts** (gráficos)

## Como rodar localmente

```sh
# 1. Clone o repositório
git clone https://github.com/Ruiz07-web/simples-insights.git

# 2. Entre na pasta
cd simples-insights

# 3. Instale as dependências
npm install

# 4. Copie o arquivo de variáveis de ambiente
cp .env.example .env
# Preencha VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

## Estrutura do banco (Supabase)

| Tabela | Descrição |
|---|---|
| `categorias` | Categorias de produtos |
| `produtos` | Catálogo com preço e estoque |
| `vendas` | Registro de vendas |
| `despesas` | Controle de despesas |
| `insights_ia` | Insights gerados por IA |

## Deploy

Faça build com `npm run build` e publique a pasta `dist/` em qualquer hosting estático (Vercel, Netlify, etc).

## Autor

**Ruiz07-web** — [GitHub](https://github.com/Ruiz07-web)
