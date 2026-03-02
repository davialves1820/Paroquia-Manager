# Documentação da API

## Objetivo do Sistema

O **Paróquia Manager** é um sistema de gestão eclesiástica completo, projetado para informatizar e agilizar a administração de paróquias. O sistema permite o controle centralizado de fiéis, gestão financeira (dízimos e doações), registros sacramentais, organização da catequese e das pastorais, além de fornecer ferramentas de comunicação (avisos/notificações) e relatórios administrativos.

---

## Rotas da API

### 🔐 Autenticação (`/auth`)

| Método | Rota             | Descrição                           | Body Necessário                                          |
| :----- | :--------------- | :---------------------------------- | :------------------------------------------------------- |
| POST   | `/auth/register` | Cadastro público de novos usuários. | `{"fullName": "...", "email": "...", "password": "..."}` |
| POST   | `/auth/login`    | Autenticação para obter token JWT.  | `{"email": "...", "password": "..."}`                    |
| POST   | `/auth/logout`   | Revoga o token de acesso atual.     | -                                                        |
| GET    | `/auth/me`       | Retorna os dados do usuário logado. | -                                                        |

### 👥 Membros (Fiéis) (`/members`)

| Método | Rota           | Descrição                         | Body Necessário                                                                                                                                  |
| :----- | :------------- | :-------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/members`     | Lista todos os fiéis cadastrados. | -                                                                                                                                                |
| GET    | `/members/:id` | Detalhes de um fiel específico.   | -                                                                                                                                                |
| POST   | `/members`     | Cadastra um novo fiel.            | `{"name": "...", "birthDate": "YYYY-MM-DD", "phone": "...", "address": "...", "baptized": Booleano, "confirmed": Booleano, "married": Booleano}` |
| PUT    | `/members/:id` | Atualiza dados do fiel.           | _(Mesmo body do POST, campos opcionais)_                                                                                                         |
| DELETE | `/members/:id` | Exclui um fiel (Admin apenas).    | -                                                                                                                                                |

### 💰 Financeiro / Dízimos (`/donations`)

| Método | Rota         | Descrição                       | Body Necessário                                                                 |
| :----- | :----------- | :------------------------------ | :------------------------------------------------------------------------------ |
| GET    | `/donations` | Lista todas as doações/dízimos. | -                                                                               |
| POST   | `/donations` | Registra uma nova doação.       | `{"memberId": ID, "amount": Moeda, "date": "YYYY-MM-DD", "description": "..."}` |

### ⛪ Sacramentos (`/sacraments`)

| Método | Rota                            | Descrição                                 | Body Necessário                                                                                                                       |
| :----- | :------------------------------ | :---------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| GET    | `/sacraments`                   | Lista registros de sacramentos.           | -                                                                                                                                     |
| GET    | `/sacraments/:id`               | Detalhes de um registro específico.       | -                                                                                                                                     |
| POST   | `/sacraments`                   | Registra um sacramento.                   | `{"memberId": ID, "type": "BATISMO/CRISMA/...", "date": "YYYY-MM-DD", "celebrantId": ID, "godparents": "...", "observations": "..."}` |
| PUT    | `/sacraments/:id`               | Atualiza registro sacramental.            | _(Mesmo body do POST, campos opcionais)_                                                                                              |
| DELETE | `/sacraments/:id`               | Exclui um registro.                       | -                                                                                                                                     |
| GET    | `/sacraments/agenda/:priestId?` | Visualiza agenda de sacramentos do padre. | _(Query Params: date)_                                                                                                                |

### 📖 Catequese (`/catechism`)

| Método | Rota                                                      | Descrição                            | Body Necessário                                                               |
| :----- | :-------------------------------------------------------- | :----------------------------------- | :---------------------------------------------------------------------------- |
| POST   | `/catechism/classes`                                      | Cria uma turma de catequese.         | `{"name": "...", "year": Ano, "catechistId": ID}`                             |
| GET    | `/catechism/classes/:id`                                  | Detalhes da turma e alunos.          | -                                                                             |
| POST   | `/catechism/enroll`                                       | Matricula um fiel em uma turma.      | `{"classId": ID, "memberId": ID}`                                             |
| POST   | `/catechism/attendance`                                   | Marca presença em aula de catequese. | `{"classId": ID, "memberId": ID", "date": "YYYY-MM-DD", "present": Booleano}` |
| GET    | `/catechism/classes/:classId/members/:memberId/frequency` | Percentual de frequência do aluno.   | -                                                                             |

### 🌿 Pastorais (`/pastorals`)

| Método | Rota                          | Descrição                           | Body Necessário                         |
| :----- | :---------------------------- | :---------------------------------- | :-------------------------------------- |
| GET    | `/pastorals`                  | Lista todas as pastorais.           | -                                       |
| POST   | `/pastorals`                  | Cria uma nova pastoral (Admin).     | `{"name": "...", "description": "..."}` |
| PUT    | `/pastorals/:id`              | Atualiza dados da pastoral.         | -                                       |
| DELETE | `/pastorals/:id`              | Exclui uma pastoral.                | -                                       |
| POST   | `/pastorals/:id/members`      | Adiciona um fiel à pastoral.        | `{"memberId": ID}`                      |
| DELETE | `/pastorals/:id/members`      | Remove um fiel da pastoral.         | `{"memberId": ID}`                      |
| POST   | `/pastorals/:id/coordinators` | Nomeia um coordenador (Usuário).    | `{"userId": ID}`                        |
| DELETE | `/pastorals/:id/coordinators` | Remove um coordenador.              | `{"userId": ID}`                        |
| POST   | `/pastorals/:id/invite-user`  | Convida um usuário para a pastoral. | `{"userId": ID}`                        |

### 📅 Eventos e Encontros de Pastoral

| Método | Rota                          | Descrição                      | Body Necessário                                                                |
| :----- | :---------------------------- | :----------------------------- | :----------------------------------------------------------------------------- |
| GET    | `/pastorals/:id/events`       | Lista eventos de uma pastoral. | -                                                                              |
| POST   | `/pastorals/:id/events`       | Cria um novo encontro.         | `{"title": "...", "description": "...", "date": "ISO8601", "location": "..."}` |
| PUT    | `/events/:id`                 | Edita dados do evento.         | -                                                                              |
| DELETE | `/events/:id`                 | Exclui o evento.               | -                                                                              |
| POST   | `/events/:eventId/attendance` | Marca presença no encontro.    | `{"memberId": ID, "present": Booleano}`                                        |

### 📢 Avisos e Comunicação

| Método | Rota                           | Descrição                             | Body Necessário                      |
| :----- | :----------------------------- | :------------------------------------ | :----------------------------------- |
| POST   | `/pastorals/:id/announcements` | Envia aviso para membros da pastoral. | `{"title": "...", "message": "..."}` |
| POST   | `/announcements/all`           | Envia aviso para toda a paróquia.     | `{"title": "...", "message": "..."}` |

### 🔔 Notificações

| Método | Rota                          | Descrição                       | Body Necessário |
| :----- | :---------------------------- | :------------------------------ | :-------------- |
| GET    | `/notifications`              | Lista notificações do usuário.  | -               |
| GET    | `/notifications/unread-count` | Quantidade de avisos não lidos. | -               |
| PUT    | `/notifications/:id/read`     | Marca notificação como lida.    | -               |

### 📊 Relatórios (`/reports`)

_Todos os relatórios retornam arquivos Excel (.xlsx)_
| Método | Rota | Descrição | Params |
| :--- | :--- | :--- | :--- |
| GET | `/reports/members` | Relatório geral de fiéis. | - |
| GET | `/reports/donations` | Relatório de dízimos. | `month`, `year` |
| GET | `/reports/sacraments` | Relatório de sacramentos. | `type` |

### 👤 Gestão de Usuários (`/users`)

_(Acesso restrito a ADMIN/PADRE)_
| Método | Rota | Descrição | Body Necessário |
| :--- | :--- | :--- | :--- |
| GET | `/users` | Lista todos os usuários do sistema. | - |
| GET | `/users/:id` | Detalhes de um usuário. | - |
| PUT | `/users/:id` | Altera permissões (role) ou dados. | `{"fullName": "...", "email": "...", "role": "ADMIN/PADRE/...", "password": "..."}` |
| DELETE | `/users/:id` | Remove um usuário. | - |
