# Paróquia Manager - Guia do Desenvolvedor (Frontend)

Este é o frontend do sistema, construído com **Next.js**, **React 19**, **TypeScript** e **Tailwind CSS 4**.

## 🛠️ Requisitos

- Node.js >= 20.x
- Gerenciador de pacotes (npm, yarn ou pnpm)

## ⚙️ Configuração Local

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Variáveis de Ambiente:**
    Crie um arquivo `.env.local` na raiz da pasta `frontend/frontend` e configure a URL do backend:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3333
    ```

3.  **Execução:**
    Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

## 📜 Scripts Disponíveis

- `npm run dev`: Inicia o servidor Next.js em modo desenvolvimento.
- `npm run build`: Gera a build de produção otimizada.
- `npm run start`: Inicia o servidor com a build de produção.
- `npm run lint`: Executa a verificação do linter (ESLint).

## 🏗️ Arquitetura

- **app/catequese**: Páginas principais do módulo de catequese.
- **lib/api**: Configuração do Axios para comunicação com o backend.
- **components**: Componentes reutilizáveis (UI e layouts).

## 🎨 Estilização

Utilizamos o **Tailwind CSS 4** para estilização. O design é focado em acessibilidade e responsividade, garantindo uma boa experiência em dispositivos móveis.
