# GitFocus – Kanban de Estudos em Dark Mode  

> **Organize, acompanhe e conclua seus objetivos de aprendizado** com uma interface otimizada para longas sessões de estudo, inspirada no visual de ferramentas como **Jira** e **GitHub Projects**.

---

## Sumário  

- [Visão geral](#visão-geral)  
- [Principais funcionalidades](#principais-funcionalidades)  
- [Tecnologias](#tecnologias)  
- [Como rodar o projeto](#como-rodar-o-projeto)  
- [Variáveis de ambiente](#variáveis-de-ambiente)  
- [Scripts disponíveis](#scripts-disponíveis)  
- [Estrutura de pastas](#estrutura-de-pastas)  
- [Contribuição](#contribuição)  
- [Licença](#licença)  

---

## Visão geral  

GitFocus é um **aplicativo web** (Next.js, App Router) que permite a estudantes e equipes de tecnologia **gerenciar metas de aprendizado** em um board Kanban escuro.  

- **Persistência local** via `localStorage` – nenhum backend necessário.  
- **Modo dark** padrão (`#121214`) pensado para reduzir cansaço visual em sessões prolongadas.  
- **Visões Kanban e lista** (switchable) com filtragem de status e busca textual.  
- **Integração opcional com Gemini AI** (`@google/genai`) para gerar sugestões de trilhas de estudo (próxima versão).

---

## Principais funcionalidades  

| Funcionalidade | Descrição |
| --- | --- |
| **Board Kanban** | Colunas “A Fazer”, “Em Progresso” e “Concluído” com bordas laterais coloridas (`#64B5F6`, `#FFB74D`, `#81C784`). |
| **Alternador de visualização** | Troque entre Kanban (3 colunas) ou lista tradicional. |
| **CRUD rápido** | Crie, edite e exclua metas via modais. |
| **Transição de status inline** | Botões de um clique no card mudam o status sem abrir o modal. |
| **Filtros e busca** | Filtre por status, pesquise por título ou descrição. |
| **Resumo de progresso** | Cards de métricas + barra de progresso com gradiente multicolorido. |
| **Amostras iniciais** | Caso a lista esteja vazia, o usuário pode carregar metas de exemplo. |
| **Feedback toast** | Notificações não intrusivas em tempo real. |
| **Acessibilidade** | `role="dialog"`, foco de teclado e fechamento via `Esc`. |
| **Estilo escuro** | Paleta customizada (Grafite, Cinza escuro, Azul, Âmbar, Verde). |
| **Responsividade** | Layout adaptativo para desktop, tablet e mobile (hook `useIsMobile`). |

---

## Tecnologias  

| Camada | Tecnologia | Versão |
| ------ | ---------- | ------ |
| **Framework** | Next.js (App Router) | `15.4.9` |
| **Linguagem** | TypeScript | `5.9.3` |
| **UI** | React | `19.2.1` |
| **Estilização** | Tailwind CSS | `4.1.11` |
| **Ícones** | Lucide React | `0.553.0` |
| **Animações** | Motion | `12.23.24` |
| **IA (placeholder)** | @google/genai | `^2.4.0` |
| **Ferramentas de build** | ESLint, PostCSS, Tailwind PostCSS plugin | — |
| **Gerenciador de pacotes** | npm (Node v24.22.0) | — |

---  

## Como rodar o projeto  

> **Requisitos**:  
> - **Node.js** ≥ `18` (testado com `v24.22.0`)  
> - **npm** ≥ `8`  

```bash
# 1️⃣ Clone o repositório
git clone https://github.com/your-org/gitfocus.git
cd gitfocus

# 2️⃣ Instale as dependências
npm install

# 3️⃣ Copie o .env de exemplo e ajuste (opcional)
cp .env.example .env
# Edite .env se precisar de GEMINI_API_KEY ou APP_URL

# 4️⃣ Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação será servida em `http://localhost:3000`.  

> **Observação**: O app funciona totalmente offline (dados ficam no `localStorage`).  

### Build para produção  

```bash
npm run build   # gera a build Next.js
npm start       # executa a versão otimizada
```

---

## Variáveis de ambiente  

| Variável | Descrição | Exemplo |
| -------- | --------- | ------- |
| `GEMINI_API_KEY` | Chave de API do Gemini (necessária caso ativar funcionalidades IA). | `"AIzaSy...."` |
| `APP_URL` | URL base da aplicação (usado por callbacks OAuth etc.). | `"https://gitfocus.vercel.app"` |

> Estas variáveis são opcionalmente injetadas pelo **AI Studio** em tempo de execução; o `.env.example` já contém placeholders.

---

## Scripts disponíveis  

| Script | Função |
| ------ | ------ |
| `dev` | Inicia o servidor de desenvolvimento com hot‑reload. |
| `build` | Compila a aplicação para produção (`next build`). |
| `start` | Executa a build produzida (`next start`). |
| `lint` | Roda ESLint em todo o código. |
| `clean` | Remove a pasta `.next` e arquivos temporários. |

---

## Estrutura de pastas  

```
GitFocus/
├─ app/                # Rotas do Next.js (App Router)
│   ├─ layout.tsx      # Layout global + tema escuro
│   ├─ page.tsx        # Página principal (Kanban/List)
│   └─ globals.css     # Tailwind + variáveis CSS custom
├─ components/         # UI reutilizável
│   ├─ Header.tsx
│   ├─ StatsOverview.tsx
│   ├─ GoalList.tsx
│   ├─ GoalCard.tsx
│   ├─ GoalFormModal.tsx
│   ├─ DeleteConfirmModal.tsx
│   └─ EmptyState.tsx
├─ hooks/              # Hooks React personalizados
│   └─ use-mobile.ts
├─ lib/                # Utilitários de data & formatação
│   ├─ dateUtils.ts
│   └─ utils.ts
├─ services/           # Camada de persistência (localStorage)
│   └─ storageService.ts
├─ types/              # Definições TypeScript
│   └─ goal.ts
├─ public/             # Imagens estáticas (se houver)
├─ next.config.ts
├─ package.json
└─ tsconfig.json
```

---

## Contribuição  

1. **Fork** o repositório.  
2. Crie uma **branch** para sua feature ou correção (`git checkout -b feature/minha-feature`).  
3. Rode `npm run lint` e garanta que **todos os testes** (se houver) passem.  
4. Envie um **pull request** descrevendo a mudança.  

> As alterações devem respeitar o **estilo de código** (ESLint + Prettier) e a **paleta de cores** já definida – evite pintar cards inteiros; use a borda lateral ou tag conforme a especificação.  

---

## Licença  

Este projeto está licenciado sob a **MIT License** – sinta‑se livre para usar, modificar e distribuir.  

---  

### 🎉 Obrigado por conferir o GitFocus!  

Se precisar de ajuda, abra uma *issue* ou entre em contato. Boa jornada de estudos!
