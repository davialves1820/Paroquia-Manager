# Paróquia Manager - Guia do Desenvolvedor

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

```bash
    cp .env.example .env
```

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

------------------------------------------------------------------------


## 📚 Documentação da API

Utilizamos o `adonis-autoswagger` para gerar a documentação em tempo real. Com o servidor rodando, acesse `/docs` no navegador.

------------------------------------------------------------------------

## 🧪 Qualidade de Código

O projeto possui **Quality Gate automático**.

Antes de qualquer merge, o GitHub executa:

-   ✅ Lint
-   ✅ Formatação
-   ✅ Type Check
-   ✅ Build

Caso alguma etapa falhe, o merge é bloqueado.

------------------------------------------------------------------------

## 🔄 Workflow de Desenvolvimento

### Estratégia de Branches

  Branch       Descrição
  ------------ -----------------------
  main         Produção
  develop      Integração
  feature/\*   Novas funcionalidades
  fix/\*       Correções

------------------------------------------------------------------------

### Fluxo recomendado

``` bash
git checkout develop
git pull
git checkout -b feature/nova-feature
```

Após desenvolvimento:

``` bash
npm run format
npm run lint
npm run typecheck
npm run build
```

Abra um Pull Request para `develop`.

------------------------------------------------------------------------

## 📜 Scripts Disponíveis

  Script              Descrição
  ------------------- -----------------------------
  npm run dev         Ambiente de desenvolvimento
  npm run build       Build produção
  npm run start       Executa build
  npm run lint        Verifica código
  npm run format      Formata código
  npm run typecheck   Verifica tipos

------------------------------------------------------------------------

## ✅ Padrões de Código

Este projeto utiliza:

-   ESLint (configuração oficial AdonisJS)
-   Prettier
-   TypeScript Strict Mode

Correção automática:

``` bash
npm run format
npm run lint -- --fix
```

------------------------------------------------------------------------

## 🤝 Contribuição

1.  Fork o projeto
2.  Crie uma branch (`feature/minha-feature`)
3.  Commit suas alterações
4.  Abra um Pull Request
