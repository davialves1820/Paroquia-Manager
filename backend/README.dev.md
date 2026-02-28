# Paróquia Manager - Guia do Desenvolvedor 🛠️

Este é o backend do sistema, construído com **AdonisJS 6** e **PostgreSQL**.

## 🛠️ Requisitos

- Node.js >= 20.x
- PostgreSQL
- Gerenciador de pacotes (npm, yarn ou pnpm)

## ⚙️ Configuração Local

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Variáveis de Ambiente:**
    Copie o arquivo `.env.example` (se existir) para `.env` e configure suas credenciais do banco de dados:
    ```env
    PORT=3333
    HOST=localhost
    NODE_ENV=development
    APP_KEY=...
    DB_HOST=127.0.0.1
    DB_PORT=5432
    DB_USER=seu_usuario
    DB_PASSWORD=sua_senha
    DB_DATABASE=paroquia_manager
    ```

3.  **Migrações:**
    Execute as migrações para criar a estrutura do banco:
    ```bash
    node ace migration:run
    ```

4.  **Execução:**
    Inicie o servidor de desenvolvimento com Hot Module Replacement (HMR):
    ```bash
    npm run dev
    ```

## 📜 Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo desenvolvimento.
- `npm run build`: Compila o projeto para produção.
- `npm run start`: Inicia o servidor compilado.
- `npm run lint`: Executa a verificação do linter.
- `npm run format`: Formata o código usando Prettier.
- `npm run typecheck`: Executa a checagem de tipos do TypeScript.

## 🏗️ Arquitetura

- **App/Models**: Definições das entidades do banco (Lucid ORM).
- **App/Controllers**: Lógica de entrada/saída das requências HTTP.
- **App/Services**: Camada de negócio (onde a mágica acontece).
- **Database/Migrations**: Histórico de alterações estruturais do banco.

## 📚 Documentação da API

Utilizamos o `adonis-autoswagger` para gerar a documentação em tempo real. Com o servidor rodando, acesse `/docs` no navegador.
