# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- **Frontend:** HTML, CSS (Bootstrap 5.1), JavaScript (jQuery, jsPDF, SweetAlert2, DayJS)
- **Backend:** PHP com PDO (MySQL)
- **Sem build system** — arquivos servidos diretamente por um servidor PHP (ex: XAMPP, servidor de hospedagem)

## Como rodar localmente

Requer servidor PHP com MySQL (ex: XAMPP). Aponte o document root para a raiz do projeto. Credenciais do banco ficam em `server/data.php` (não versionado).

## Arquitetura

O projeto é um monorepo com três aplicações independentes:

### `/` — Cartas Radioativas (app principal)
Gerador de baralho estilo Cards Against Humanity. O usuário seleciona categorias, escolhe cartas brancas/pretas do banco, adiciona cartas personalizadas e gera um PDF para impressão.

- `index.html` — interface principal
- `js/script.js` — toda a lógica do frontend: carregamento de cartas, tabelas, customização, preview de carta preta, envio de mensagens
- `js/gerapdf.js` — geração do PDF usando jsPDF (frente e verso, dois tamanhos, modo econômico)
- `server/cartas.php` — CRUD de cartas (tabelas `cartas` e `personalizadas`)
- `server/categorias.php` — leitura das categorias
- `server/mensagens.php` — envio de mensagens dos usuários
- `adm.php` + `js/adm.js` — painel administrativo (requer sessão PHP); aprovação de cartas personalizadas, edição/criação de cartas e categorias, leitura de mensagens
- `en/` — versão em inglês (estrutura espelhada)

### `/alanzoar/`
Aplicação derivada para o jogo "Alanzoar" (perguntas estilo quiz). Estrutura semelhante ao app principal mas com cartas de um único tipo (perguntas). Usa tabelas `alanzoar` e `ar_personalizadas` no mesmo banco.

- `server/perguntas.php` — substitui `cartas.php`; usa `../../server/data.php` para credenciais

### `/maldicao/`
Jogo "Maldição" — estilo "Would You Rather" / Pick Your Poison. O jogador escolhe entre duas opções ruins ou difíceis. Cor primária: `#2d0040` (roxo escuro).

- `index.html` — interface principal
- `style.css` — estilos (variáveis CSS `--cor-primaria`, `--cor-acento`)
- `js/script.js` — lógica frontend; objeto `impressao` compartilhado com `gerapdf.js`
- `js/gerapdf.js` — geração do PDF; carta com header "Você preferiria...", duas áreas brancas separadas por barra "OU", footer com nome do baralho
- `server/maldicao.php` — CRUD (tabelas `maldicao` e `maldicao_personalizadas`)

**Diferença chave:** cada carta tem dois campos (`opcao_a`, `opcao_b`) em vez de um `texto`. A tabela HTML exibe as duas opções lado a lado. Na adição de personalizadas, cada linha do textarea A é par da linha correspondente do textarea B.

Referências de conteúdo em `C:\Users\Barros Moreira\Desktop\Jogos\Would You Rather`.

## Banco de dados

Tabelas principais (MySQL):
- `cartas` — `(id, texto, tipo [b/p], categoria)`
- `personalizadas` — `(id, texto, tipo)` — cartas enviadas por usuários aguardando triagem
- `alanzoar` — `(id, texto, categoria)` — perguntas do Alanzoar
- `ar_personalizadas` — `(id, texto)` — perguntas personalizadas do Alanzoar
- `maldicao` — `(id, opcao_a, opcao_b, categoria)` — cartas do Maldição
- `maldicao_personalizadas` — `(id, opcao_a, opcao_b)` — cartas personalizadas aguardando triagem

## Convenções importantes

- Cartas pretas usam sintaxe especial no texto: `_` para linha de resposta, `\n` para quebra de linha, `<<texto>>` para linha isolada com preenchimento automático de underlines
- O frontend converte essa sintaxe na hora de gerar o PDF (`js/gerapdf.js`) e no preview em tempo real (`trocaUnderline()` e `atualizaPreview()` em `js/script.js`)
- Cartas são agrupadas por categoria no objeto `dbCartas` (chave = nome da categoria, valor = array de cartas)
- O painel adm (`adm.php`) usa sessão PHP; o login está em `server/login.php`
