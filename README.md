# LP1 — Deploy na Vercel (GitHub)

Duas variantes para testar qual funciona no TikTok:

| Página | O que faz |
|---|---|
| `/` (index.html) | **100% client-side**: espera 21s no JS e dispara o deep-link por 3 vetores (href + iframe + âncora), variantes `refer=web`, retry a cada 8s e fallback HTTPS |
| `/worker-style.html` | **Réplica exata da worker original**: meta refresh 1s → `/api/lp1-handoff` (serverless) → 4 hops de 4,75s → 302 final pro `snssdk://webview` |

Params (`ttclid`, etc.) são preservados nas duas automaticamente.

## Deploy

1. Crie um repo no GitHub
2. Suba o conteúdo desta pasta (index.html, worker-style.html, api/, README)
3. Vercel → Add New Project → importe o repo → Deploy
4. Links:
   - `https://SEU-PROJETO.vercel.app/?ttclid=E_C_P.teste` → versão client-side
   - `https://SEU-PROJETO.vercel.app/worker-style.html?ttclid=E_C_P.teste` → réplica da worker

## Como interpretar o teste

- **As duas abrem a LP2 em overlay** → o problema era só a worker antiga
- **Só a `/` funciona** → o TikTok bloqueou o 302 server-side pro scheme; fique na client-side
- **Só a worker-style funciona** → o TikTok bloqueou navegação JS pra scheme; fique na réplica
- **Nenhuma abre overlay, mas a LP2 aparece na webview** → o TikTok matou o `snssdk://webview` interno; o fallback HTTPS é o que resta
