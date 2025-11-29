# Documentação da API - JCS Hospital

## Índice

1. [Introdução](#introdução)
2. [Autenticação](#autenticação)
3. [Base URL](#base-url)
4. [Endpoints](#endpoints)
   - [Autenticação/Usuário](#autenticaçãousuário)
   - [Perfis](#perfis)
   - [Fila](#fila)
   - [Atendimento](#atendimento)
   - [Registros Médicos](#registros-médicos)
5. [Modelos de Dados](#modelos-de-dados)
6. [Códigos de Status HTTP](#códigos-de-status-http)
7. [Tratamento de Erros](#tratamento-de-erros)
8. [Documentação Interativa](#documentação-interativa)
9. [Exemplos de Uso](#exemplos-de-uso)
10. [Notas Importantes](#notas-importantes)

---

## Introdução

Esta documentação descreve a API REST do sistema JCS Hospital, desenvolvida com FastAPI e integrada ao Supabase para autenticação e persistência de dados. A API fornece endpoints para gerenciamento de perfis de usuários, fila de atendimento, atendimentos médicos e registros médicos.

### Tecnologias Utilizadas

- **FastAPI**: Framework web moderno e rápido para construção de APIs
- **Supabase**: Backend-as-a-Service para autenticação e banco de dados
- **Python 3.13**: Linguagem de programação
- **Uvicorn**: Servidor ASGI para execução da aplicação

### Características Principais

- Autenticação baseada em JWT (JSON Web Tokens) via Supabase
- Validação automática de tokens em rotas protegidas
- Suporte a CORS para integração com frontend
- Documentação interativa disponível em `/docs` (Swagger UI)
- Tratamento de erros padronizado

---

## Autenticação

A API utiliza autenticação baseada em JWT (JSON Web Tokens) fornecidos pelo Supabase. Todas as rotas protegidas requerem um token válido no cabeçalho da requisição.

### Como Autenticar

Inclua o token JWT no cabeçalho `Authorization` de todas as requisições protegidas:

```
Authorization: Bearer <seu_token_jwt>
```

### Obtenção do Token

O token JWT é obtido através do processo de autenticação do Supabase no frontend. Após o login bem-sucedido, o token é armazenado e enviado automaticamente nas requisições subsequentes.

### Validação do Token

O sistema valida automaticamente o token em todas as rotas protegidas através da dependência `get_current_user`. Se o token for inválido, expirado ou ausente, a API retornará um erro `401 Unauthorized`.

---

## Base URL

A URL base da API é:

```
/api/v1
```

**Exemplo completo:**
```
https://seu-dominio.com/api/v1/profiles/me
```

Para desenvolvimento local:
```
http://localhost:8000/api/v1/profiles/me
```

---

## Endpoints

### Autenticação/Usuário

#### Obter Informações do Usuário Autenticado

Valida o token JWT e retorna informações básicas do usuário autenticado.

**Endpoint:** `GET /api/v1/user/me`

**Autenticação:** Requerida

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta de Sucesso (200 OK):**
```json
{
  "user_id": "uuid-do-usuario",
  "message": "Autenticação bem-sucedida! O Supabase validou seu token (JWT).",
  "seguranca": "Rota protegida com sucesso."
}
```

**Resposta de Erro (401 Unauthorized):**
```json
{
  "detail": "Token de acesso ausente ou formato incorreto (deve ser 'Bearer <token>')."
}
```

ou

```json
{
  "detail": "Token inválido ou expirado. Detalhe: <mensagem_de_erro>"
}
```

---

### Perfis

#### Listar Todos os Perfis

Retorna uma lista com todos os perfis cadastrados no sistema.

**Endpoint:** `GET /api/v1/profiles/`

**Autenticação:** Não requerida

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "uuid",
    "full_name": "João da Silva",
    "document_number": "12345678900",
    "date_of_birth": "1990-01-15",
    "gender": "M",
    "mom_full_name": "Maria da Silva",
    "address": "Rua Exemplo, 123",
    "nationality": "Brasileira",
    "priority": false,
    "role": "patient",
    "inserted_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
]
```

**Resposta de Erro (500 Internal Server Error):**
```json
{
  "detail": "Mensagem de erro"
}
```

---

#### Obter Perfil do Usuário Autenticado

Retorna o perfil completo do usuário autenticado.

**Endpoint:** `GET /api/v1/profiles/me`

**Autenticação:** Requerida

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "uuid",
  "full_name": "João da Silva",
  "document_number": "12345678900",
  "date_of_birth": "1990-01-15",
  "gender": "M",
  "mom_full_name": "Maria da Silva",
  "address": "Rua Exemplo, 123",
  "nationality": "Brasileira",
  "priority": false,
  "role": "patient",
  "inserted_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:00:00Z"
}
```

**Resposta de Erro (401 Unauthorized):**
```json
{
  "detail": "Token de acesso ausente ou formato incorreto (deve ser 'Bearer <token>')."
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "detail": "Profile not found"
}
```

**Resposta de Erro (500 Internal Server Error):**
```json
{
  "detail": "Mensagem de erro"
}
```

---

#### Obter Perfil por ID

Retorna o perfil de um usuário específico pelo seu ID.

**Endpoint:** `GET /api/v1/profiles/{profile_id}`

**Autenticação:** Não requerida

**Parâmetros de URL:**
- `profile_id` (string, obrigatório): UUID do perfil

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "uuid",
  "full_name": "João da Silva",
  "document_number": "12345678900",
  "date_of_birth": "1990-01-15",
  "gender": "M",
  "mom_full_name": "Maria da Silva",
  "address": "Rua Exemplo, 123",
  "nationality": "Brasileira",
  "priority": false,
  "role": "patient",
  "inserted_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:00:00Z"
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "detail": "Profile not found"
}
```

**Resposta de Erro (500 Internal Server Error):**
```json
{
  "detail": "Mensagem de erro"
}
```

---

### Fila

#### Listar Fila de Atendimento

Retorna a lista completa da fila de atendimento.

**Endpoint:** `GET /api/v1/queue/`

**Autenticação:** Não requerida

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "uuid",
    "checkin": "2024-01-01T10:00:00-03:00",
    "profile_id": "uuid-do-paciente",
    "status": "waiting",
    "assigned_doctor_id": null,
    "inserted_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
]
```

**Possíveis Valores de Status:**
- `waiting`: Aguardando atendimento
- `being_attended`: Em atendimento
- `finished`: Atendimento finalizado

**Resposta de Erro (500 Internal Server Error):**
```json
{
  "detail": "Mensagem de erro"
}
```

---

#### Realizar Check-in na Fila

Adiciona o usuário autenticado à fila de atendimento.

**Endpoint:** `POST /api/v1/queue/checkin`

**Autenticação:** Requerida

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "uuid",
  "checkin": "2024-01-01T10:00:00-03:00",
  "profile_id": "uuid-do-usuario",
  "status": "waiting",
  "assigned_doctor_id": null,
  "inserted_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:00:00Z"
}
```

**Resposta de Erro (401 Unauthorized):**
```json
{
  "detail": "Token de acesso ausente ou formato incorreto (deve ser 'Bearer <token>')."
}
```

ou

```json
{
  "detail": "Token inválido ou expirado. Detalhe: <mensagem_de_erro>"
}
```

**Resposta de Erro (500 Internal Server Error):**
```json
{
  "detail": "Mensagem de erro"
}
```

---

#### Cancelar Check-in

Remove o check-in do usuário autenticado da fila de atendimento.

**Endpoint:** `DELETE /api/v1/queue/checkin`

**Autenticação:** Requerida

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta de Sucesso (200 OK):**
```json
{
  "message": "Check-in cancelado com sucesso."
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "detail": "Nenhum check-in encontrado para este usuário."
}
```

**Resposta de Erro (500 Internal Server Error):**
```json
{
  "detail": "Mensagem de erro"
}
```

---

#### Obter Posição na Fila

Retorna a posição atual do usuário autenticado na fila de atendimento. A fila é ordenada por prioridade (pacientes prioritários primeiro) e depois por horário de check-in.

**Endpoint:** `GET /api/v1/queue/position`

**Autenticação:** Requerida

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta de Sucesso (200 OK):**

Se o usuário está aguardando:
```json
{
  "status": "waiting",
  "position": 3
}
```

Se o usuário está sendo atendido:
```json
{
  "status": "called"
}
```

Se o usuário não está na fila:
```json
{
  "status": "not_in_queue"
}
```

**Resposta de Erro (500 Internal Server Error):**
```json
{
  "detail": "Mensagem de erro"
}
```

**Nota:** A posição considera pacientes prioritários primeiro, seguidos pelos demais, ambos ordenados por horário de check-in.

---

#### Chamar Próximo Paciente

Chama o próximo paciente da fila para atendimento. Apenas médicos podem utilizar este endpoint. O sistema prioriza pacientes com flag `priority: true` e ordena por horário de check-in.

**Endpoint:** `POST /api/v1/queue/next`

**Autenticação:** Requerida (apenas médicos)

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta de Sucesso (200 OK):**

Se há um paciente na fila:
```json
{
  "message": "Próximo paciente chamado.",
  "called": {
    "id": "uuid",
    "checkin": "2024-01-01T10:00:00-03:00",
    "profile_id": "uuid-do-paciente",
    "status": "being_attended",
    "assigned_doctor_id": "uuid-do-medico"
  }
}
```

Se o médico já está atendendo um paciente:
```json
{
  "message": "Você já possui um paciente em atendimento.",
  "called": {
    "id": "uuid",
    "checkin": "2024-01-01T10:00:00-03:00",
    "profile_id": "uuid-do-paciente",
    "status": "being_attended",
    "assigned_doctor_id": "uuid-do-medico"
  }
}
```

Se a fila está vazia:
```json
{
  "message": "A fila está vazia."
}
```

**Resposta de Erro (500 Internal Server Error):**
```json
{
  "detail": "Mensagem de erro"
}
```

---

### Atendimento

#### Obter Atendimento Atual

Retorna o atendimento ativo do médico autenticado.

**Endpoint:** `GET /api/v1/attendance/current`

**Autenticação:** Requerida (apenas médicos)

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "uuid",
  "checkin": "2024-01-01T10:00:00-03:00",
  "profile_id": "uuid-do-paciente",
  "status": "being_attended",
  "assigned_doctor_id": "uuid-do-medico",
  "inserted_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:00:00Z"
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "detail": "Nenhum atendimento ativo no momento."
}
```

**Resposta de Erro (500 Internal Server Error):**
```json
{
  "detail": "Mensagem de erro"
}
```

---

#### Finalizar Atendimento

Finaliza o atendimento atual do médico autenticado e cria um registro médico com as informações do atendimento.

**Endpoint:** `POST /api/v1/attendance/finish`

**Autenticação:** Requerida (apenas médicos)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Corpo da Requisição:**
```json
{
  "subjective": "Paciente relata dor de cabeça há 3 dias...",
  "objective_data": "PA: 120/80, FC: 72 bpm, Temp: 36.5°C...",
  "assessment": "Cefaleia tensional",
  "planning": "Prescrição de analgésico e orientações..."
}
```

**Parâmetros:**
- `subjective` (string, obrigatório): Dados subjetivos do paciente (queixas, histórico)
- `objective_data` (string, obrigatório): Dados objetivos (sinais vitais, exames)
- `assessment` (string, obrigatório): Avaliação e diagnóstico
- `planning` (string, obrigatório): Plano de tratamento

**Resposta de Sucesso (200 OK):**
```json
{
  "message": "Atendimento finalizado com sucesso.",
  "record": {
    "id": 1,
    "doctor_id": "uuid-do-medico",
    "patient_id": "uuid-do-paciente",
    "started_at": "2024-01-01T10:00:00-03:00",
    "end_at": "2024-01-01T10:30:00-03:00",
    "subjective": "Paciente relata dor de cabeça há 3 dias...",
    "objective_data": "PA: 120/80, FC: 72 bpm, Temp: 36.5°C...",
    "assessment": "Cefaleia tensional",
    "planning": "Prescrição de analgésico e orientações...",
    "inserted_at": "2024-01-01T10:30:00Z",
    "updated_at": "2024-01-01T10:30:00Z"
  }
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "detail": "Nenhum atendimento ativo encontrado."
}
```

**Resposta de Erro (500 Internal Server Error):**
```json
{
  "detail": "Mensagem de erro"
}
```

---

### Registros Médicos

#### Listar Todos os Registros Médicos

Retorna uma lista com todos os registros médicos do sistema, ordenados por data de início (mais antigos primeiro).

**Endpoint:** `GET /api/v1/records/`

**Autenticação:** Não requerida

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": 1,
    "doctor_id": "uuid-do-medico",
    "patient_id": "uuid-do-paciente",
    "started_at": "2024-01-01T10:00:00-03:00",
    "end_at": "2024-01-01T10:30:00-03:00",
    "subjective": "Paciente relata dor de cabeça...",
    "objective_data": "PA: 120/80...",
    "assessment": "Cefaleia tensional",
    "planning": "Prescrição de analgésico...",
    "inserted_at": "2024-01-01T10:30:00Z",
    "updated_at": "2024-01-01T10:30:00Z"
  }
]
```

---

#### Listar Registros do Usuário Autenticado

Retorna os registros médicos do paciente autenticado, ordenados por data de início (mais antigos primeiro).

**Endpoint:** `GET /api/v1/records/me`

**Autenticação:** Requerida

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": 1,
    "doctor_id": "uuid-do-medico",
    "patient_id": "uuid-do-paciente",
    "started_at": "2024-01-01T10:00:00-03:00",
    "end_at": "2024-01-01T10:30:00-03:00",
    "subjective": "Paciente relata dor de cabeça...",
    "objective_data": "PA: 120/80...",
    "assessment": "Cefaleia tensional",
    "planning": "Prescrição de analgésico...",
    "inserted_at": "2024-01-01T10:30:00Z",
    "updated_at": "2024-01-01T10:30:00Z"
  }
]
```

**Resposta de Erro (500 Internal Server Error):**
```json
{
  "detail": "Mensagem de erro"
}
```

---

#### Listar Registros por ID do Paciente

Retorna todos os registros médicos de um paciente específico.

**Endpoint:** `GET /api/v1/records/by_patient/{patient_id}`

**Autenticação:** Não requerida

**Parâmetros de URL:**
- `patient_id` (string, obrigatório): UUID do paciente

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": 1,
    "doctor_id": "uuid-do-medico",
    "patient_id": "uuid-do-paciente",
    "started_at": "2024-01-01T10:00:00-03:00",
    "end_at": "2024-01-01T10:30:00-03:00",
    "subjective": "Paciente relata dor de cabeça...",
    "objective_data": "PA: 120/80...",
    "assessment": "Cefaleia tensional",
    "planning": "Prescrição de analgésico...",
    "inserted_at": "2024-01-01T10:30:00Z",
    "updated_at": "2024-01-01T10:30:00Z"
  }
]
```

**Resposta de Erro (500 Internal Server Error):**
```json
{
  "detail": "Mensagem de erro"
}
```

---

#### Obter Registro Médico por ID

Retorna um registro médico específico pelo seu ID.

**Endpoint:** `GET /api/v1/records/{record_id}`

**Autenticação:** Não requerida

**Parâmetros de URL:**
- `record_id` (string, obrigatório): ID numérico do registro médico

**Resposta de Sucesso (200 OK):**
```json
{
  "id": 1,
  "doctor_id": "uuid-do-medico",
  "patient_id": "uuid-do-paciente",
  "started_at": "2024-01-01T10:00:00-03:00",
  "end_at": "2024-01-01T10:30:00-03:00",
  "subjective": "Paciente relata dor de cabeça...",
  "objective_data": "PA: 120/80...",
  "assessment": "Cefaleia tensional",
  "planning": "Prescrição de analgésico...",
  "inserted_at": "2024-01-01T10:30:00Z",
  "updated_at": "2024-01-01T10:30:00Z"
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "detail": "Record not found"
}
```

---

## Modelos de Dados

### Profile (Perfil)

Representa o perfil de um usuário no sistema.

```json
{
  "id": "uuid",
  "full_name": "string",
  "document_number": "string",
  "date_of_birth": "date (YYYY-MM-DD)",
  "gender": "string",
  "mom_full_name": "string",
  "address": "string",
  "nationality": "string",
  "priority": "boolean",
  "role": "string",
  "inserted_at": "timestamp",
  "updated_at": "timestamp"
}
```

**Campos:**
- `id`: UUID único do perfil (relacionado com `auth.users`)
- `full_name`: Nome completo
- `document_number`: Número do documento (CPF)
- `date_of_birth`: Data de nascimento
- `gender`: Gênero
- `mom_full_name`: Nome completo da mãe
- `address`: Endereço
- `nationality`: Nacionalidade
- `priority`: Indica se o paciente tem prioridade na fila
- `role`: Papel do usuário (`patient`, `doctor`, `admin`)
- `inserted_at`: Data de criação
- `updated_at`: Data de última atualização

---

### Queue (Fila)

Representa uma entrada na fila de atendimento.

```json
{
  "id": "uuid",
  "checkin": "timestamp",
  "profile_id": "uuid",
  "status": "string",
  "assigned_doctor_id": "uuid | null",
  "inserted_at": "timestamp",
  "updated_at": "timestamp"
}
```

**Campos:**
- `id`: UUID único da entrada na fila
- `checkin`: Data e hora do check-in (timezone: America/Fortaleza)
- `profile_id`: UUID do perfil do paciente
- `status`: Status da entrada (`waiting`, `being_attended`, `finished`)
- `assigned_doctor_id`: UUID do médico atribuído (null se não atribuído)
- `inserted_at`: Data de criação
- `updated_at`: Data de última atualização

---

### Record Medical (Registro Médico)

Representa um registro médico completo de um atendimento.

```json
{
  "id": "integer",
  "doctor_id": "uuid",
  "patient_id": "uuid",
  "started_at": "timestamp",
  "end_at": "timestamp",
  "subjective": "string",
  "objective_data": "string",
  "assessment": "string",
  "planning": "string",
  "inserted_at": "timestamp",
  "updated_at": "timestamp"
}
```

**Campos:**
- `id`: ID numérico único do registro
- `doctor_id`: UUID do médico que realizou o atendimento
- `patient_id`: UUID do paciente atendido
- `started_at`: Data e hora de início do atendimento
- `end_at`: Data e hora de término do atendimento
- `subjective`: Dados subjetivos (queixas, histórico)
- `objective_data`: Dados objetivos (sinais vitais, exames)
- `assessment`: Avaliação e diagnóstico
- `planning`: Plano de tratamento
- `inserted_at`: Data de criação
- `updated_at`: Data de última atualização

---

## Códigos de Status HTTP

A API utiliza os seguintes códigos de status HTTP:

| Código | Descrição | Quando é Retornado |
|--------|-----------|-------------------|
| 200 | OK | Requisição bem-sucedida |
| 404 | Not Found | Recurso não encontrado |
| 401 | Unauthorized | Token ausente, inválido ou expirado |
| 500 | Internal Server Error | Erro interno do servidor |

---

## Tratamento de Erros

Todos os erros retornados pela API seguem um formato padronizado:

```json
{
  "detail": "Mensagem descritiva do erro"
}
```

### Erros Comuns

#### 401 Unauthorized

**Causa:** Token JWT ausente, inválido ou expirado.

**Solução:** Verifique se o token está sendo enviado no cabeçalho `Authorization` no formato `Bearer <token>` e se o token é válido.

**Exemplo de Resposta:**
```json
{
  "detail": "Token de acesso ausente ou formato incorreto (deve ser 'Bearer <token>')."
}
```

#### 404 Not Found

**Causa:** Recurso solicitado não foi encontrado.

**Exemplos:**
- Perfil não encontrado
- Registro médico não encontrado
- Nenhum atendimento ativo
- Nenhum check-in encontrado

**Exemplo de Resposta:**
```json
{
  "detail": "Profile not found"
}
```

#### 500 Internal Server Error

**Causa:** Erro interno do servidor ou do banco de dados.

**Solução:** Verifique os logs do servidor para mais detalhes.

**Exemplo de Resposta:**
```json
{
  "detail": "Mensagem de erro específica"
}
```

---

## Documentação Interativa

A API fornece documentação interativa através do Swagger UI, disponível em:

```
/docs
```

Acesse esta URL no navegador para visualizar todos os endpoints, testar requisições e ver exemplos de respostas.

---

## Exemplos de Uso

### Exemplo 1: Realizar Check-in

```bash
curl -X POST "http://localhost:8000/api/v1/queue/checkin" \
  -H "Authorization: Bearer seu_token_jwt"
```

### Exemplo 2: Obter Perfil do Usuário

```bash
curl -X GET "http://localhost:8000/api/v1/profiles/me" \
  -H "Authorization: Bearer seu_token_jwt"
```

### Exemplo 3: Finalizar Atendimento

```bash
curl -X POST "http://localhost:8000/api/v1/attendance/finish" \
  -H "Authorization: Bearer seu_token_jwt" \
  -H "Content-Type: application/json" \
  -d '{
    "subjective": "Paciente relata dor de cabeça há 3 dias",
    "objective_data": "PA: 120/80, FC: 72 bpm",
    "assessment": "Cefaleia tensional",
    "planning": "Prescrição de analgésico"
  }'
```

### Exemplo 4: Chamar Próximo Paciente

```bash
curl -X POST "http://localhost:8000/api/v1/queue/next" \
  -H "Authorization: Bearer seu_token_jwt"
```

---

## Notas Importantes

1. **Timezone:** Todas as datas e horários são armazenados no timezone `America/Fortaleza` (UTC-3).

2. **Priorização na Fila:** A fila de atendimento prioriza pacientes com `priority: true`, seguidos pelos demais, ambos ordenados por horário de check-in.

3. **Validação de Papéis:** Alguns endpoints requerem papéis específicos (ex: apenas médicos podem chamar próximo paciente). A validação de papéis deve ser implementada no frontend ou através de políticas RLS do Supabase.

4. **CORS:** A API está configurada para aceitar requisições de qualquer origem (`allow_origins=["*"]`). Em produção, recomenda-se restringir às origens permitidas.

5. **Health Check:** O endpoint raiz (`/`) retorna o status da API:
   ```json
   {
     "status": "ok",
     "message": "API está funcionando! Acesse /docs para a documentação."
   }
   ```

---
