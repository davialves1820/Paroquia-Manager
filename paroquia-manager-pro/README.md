# Paróquia Manager Pro ⛪

Backend robusto desenvolvido com **AdonisJS v6** para gestão paroquial completa. O sistema automatiza desde o cadastro de fiéis até relatórios financeiros e gerenciamento de pastorais.

## 🚀 Tecnologias

- **Framework:** AdonisJS v6 (Node.js)
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL
- **ORM:** Lucid ORM
- **Geração de Relatórios:** ExcelJS
- **Autenticação:** Opaque Access Tokens (JWT-like) com RBAC

---

## 📋 Funcionalidades Principais

- **Autenticação e Permissões (RBAC):**
  - Níveis de acesso: `ADMIN`, `PADRE`, `SECRETARIA`, `COORDENADOR`, `FIEL`.
  - Registro público de fiéis com role automática.
- **Gestão de Fiéis (Membros):** Ficha completa, histórico de sacramentos e presença.
- **Pastorais:** Gerenciamento de grupos, vínculos entre coordenadores e participantes.
- **Vida Sacramental:** Registros de Batismo, Crisma e Casamento.
- **Catequese:** Gestão de turmas, matrículas e controle de frequência (chamada).
- **Financeiro (Dízimo):** Registro de contribuições e doações com múltiplos métodos de pagamento.
- **Dashboard Inteligente:** Métricas de crescimento, arrecadação mensal e estatísticas em tempo real.
- **Relatórios:** Exportação de planilhas Excel para todos os módulos.

---

## 🛠️ Configuração de Desenvolvimento

### Pré-requisitos
- Node.js (v20.x ou superior)
- Docker e Docker Compose (para o banco de dados)

### Passo a Passo

1. **Instalar Dependências:**
   ```bash
   npm install
   ```

2. **Configurar Ambiente:**
   Crie um arquivo `.env` na raiz do projeto (use o `docker-compose.yml` como referência para as credenciais do banco).

3. **Subir o Banco de Dados (Docker):**
   ```bash
   docker-compose up -d
   ```

4. **Executar Migrações e Seeders:**
   Prepare o banco com a estrutura e dados de teste:
   ```bash
   node ace migration:run
   node ace db:seed
   ```

5. **Iniciar Servidor:**
   ```bash
   npm run dev
   ```

---

## 📖 Documentação da API

Os detalhes de cada endpoint, incluindo payloads JSON e métodos, podem ser encontrados no guia de walkthrough localizado em:
`./brain/walkthrough.md` (Arquivo gerado pela IA Antigravity)

### Credenciais de Teste (Após rodar o Seeder)
- **Admin:** `admin@email.com` / `senha_segura`
- **Padre:** `padre@email.com` / `senha_segura`
- **Fiel:** `fiel@email.com` / `senha_segura`

---

## 🧪 Testes

Execute a suíte de testes do Japa:
```bash
npm test
```

---

## 🐳 Docker Production
O projeto já conta com um `Dockerfile` multi-stage otimizado para deploy em produção.
