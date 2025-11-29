# 🏥 JCS Hospital - Sistema de Gestão de Atendimentos

Sistema multiplataforma para gestão de atendimentos em clínicas de saúde, desenvolvido como parte do Projeto Aplicado Multiplataforma Etapa 2 (N708). O sistema permite que pacientes realizem check-in digital, médicos gerenciem atendimentos e registrem prontuários eletrônicos, e administradores gerenciem o sistema.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Instalação e Execução](#instalação-e-execução)
- [Acesso ao Sistema](#acesso-ao-sistema)
- [Validação com Público-Alvo](#validação-com-público-alvo)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Documentação](#documentação)
- [Equipe de Desenvolvimento](#equipe-de-desenvolvimento)

---

## 🎯 Sobre o Projeto

### Objetivo

O JCS Hospital é um sistema de gestão de atendimentos desenvolvido para modernizar e otimizar o fluxo de atendimento em clínicas de saúde. O sistema visa:

- **Reduzir filas físicas** através do check-in digital
- **Organizar prontuários médicos** com metodologia SOAP
- **Facilitar o acesso ao histórico** de atendimentos
- **Melhorar a experiência** de pacientes e profissionais de saúde

### Problema Solucionado

O sistema resolve problemas comuns em clínicas de saúde:

- ❌ Filas físicas longas e desorganizadas
- ❌ Prontuários em papel, difíceis de consultar
- ❌ Falta de organização no fluxo de atendimento
- ❌ Dificuldade em acessar histórico de pacientes

**Solução oferecida:**

- ✅ Check-in digital com visualização de posição na fila
- ✅ Prontuários eletrônicos organizados e acessíveis
- ✅ Sistema de fila inteligente com priorização
- ✅ Histórico completo e consultável de atendimentos

### Vinculação ao ODS 11

Este projeto está vinculado ao **Objetivo de Desenvolvimento Sustentável 11: Cidades e Comunidades Sustentáveis**, contribuindo para:

- **Cidades mais inteligentes**: Uso de tecnologia para melhorar serviços de saúde
- **Acesso universal**: Sistema acessível via web, funcionando em diferentes dispositivos
- **Eficiência de recursos**: Redução de desperdício de papel e tempo
- **Qualidade de vida**: Melhoria no atendimento de saúde da comunidade

---

## ✨ Funcionalidades Implementadas

### Para Pacientes 👤

- ✅ **Check-in Digital**: Realizar check-in ao chegar à clínica
- ✅ **Visualização de Posição**: Ver posição atual na fila em tempo real
- ✅ **Cancelamento de Check-in**: Cancelar check-in se necessário
- ✅ **Histórico de Atendimentos**: Visualizar todos os atendimentos realizados
- ✅ **Detalhamento de Registros**: Acessar informações completas de cada atendimento
- ✅ **Cadastro e Login**: Criar conta e fazer login seguro

### Para Médicos 👨‍⚕️

- ✅ **Visualização da Fila**: Ver todos os pacientes aguardando atendimento
- ✅ **Chamada de Pacientes**: Chamar próximo paciente da fila (com priorização)
- ✅ **Atendimento Atual**: Visualizar paciente em atendimento
- ✅ **Registro de Prontuário**: Preencher prontuário usando metodologia SOAP:
  - **Subjective**: Dados subjetivos (queixas, histórico)
  - **Objective**: Dados objetivos (sinais vitais, exames)
  - **Assessment**: Avaliação e diagnóstico
  - **Planning**: Plano de tratamento
- ✅ **Histórico de Pacientes**: Consultar histórico completo de qualquer paciente
- ✅ **Finalização de Atendimento**: Finalizar atendimento e criar registro médico

### Para Administradores 👨‍💼

- ✅ **Painel Administrativo**: Acesso a todas as funcionalidades do sistema
- ✅ **Gerenciamento de Usuários**: Criar e gerenciar contas de usuários
- ✅ **Gerenciamento de Roles**: Atribuir e alterar perfis (patient, doctor, admin)
- ✅ **Visualização de Perfis**: Ver todos os perfis cadastrados
- ✅ **Visualização de Registros**: Acessar todos os registros médicos do sistema
- ✅ **Relatórios**: Visualizar dados gerais do sistema

### Funcionalidades do Sistema 🔧

- ✅ **Sistema de Priorização**: Pacientes com flag de prioridade são atendidos primeiro
- ✅ **Autenticação Segura**: Login via Supabase Auth com JWT tokens
- ✅ **Interface Responsiva**: Funciona perfeitamente em desktop, tablet e mobile
- ✅ **API RESTful**: Backend com endpoints padronizados e documentados
- ✅ **Validação de Dados**: Validação no frontend e backend
- ✅ **Tratamento de Erros**: Mensagens de erro claras e informativas

---

## 🛠️ Tecnologias Utilizadas

### Frontend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| React | 19.1.1 | Biblioteca para construção de interfaces |
| TypeScript | 5.8.3 | Tipagem estática |
| Vite | 7.1.7 | Build tool e dev server |
| React Router | 7.6.3 | Roteamento client-side |
| TanStack Query | 5.81.5 | Gerenciamento de estado do servidor |
| Zustand | 5.0.8 | Estado global |
| Tailwind CSS | 4.1.13 | Estilização |
| shadcn/ui | 3.3.1 | Componentes UI |
| Supabase JS | 2.81.1 | Cliente Supabase para autenticação |

### Backend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| Python | 3.13 | Linguagem de programação |
| FastAPI | Latest | Framework web |
| Uvicorn | Latest | Servidor ASGI |
| Supabase | Latest | Cliente banco de dados |
| Pydantic | Latest | Validação de dados |
| Pytest | Latest | Framework de testes |

### Banco de Dados e Infraestrutura

| Tecnologia | Propósito |
|------------|-----------|
| PostgreSQL | Banco de dados relacional |
| Supabase | Backend-as-a-Service (BaaS) |
| Supabase Auth | Autenticação e autorização |

### Ferramentas de Desenvolvimento

- **Git**: Controle de versão
- **ESLint**: Linting JavaScript/TypeScript
- **Pytest**: Testes backend
- **Husky**: Git hooks

---

## 🏗️ Arquitetura do Sistema

### Visão Geral

O sistema segue uma **arquitetura cliente-servidor** em camadas:

```
Frontend (React) → Backend (FastAPI) → Supabase (PostgreSQL + Auth)
```

### Componentes Principais

1. **Frontend Web**: Aplicação React responsiva
2. **Backend API**: API RESTful desenvolvida com FastAPI
3. **Banco de Dados**: PostgreSQL gerenciado pelo Supabase
4. **Autenticação**: Sistema de autenticação via Supabase Auth (JWT)

### Integrações

- **Supabase Auth**: Autenticação e gerenciamento de usuários
- **Supabase Database**: Persistência de dados
- **API REST**: Comunicação entre frontend e backend

Para mais detalhes sobre a arquitetura, consulte: [`docs/architecture/architecture.md`](docs/architecture/architecture.md)

---

## 🚀 Instalação e Execução

### Pré-requisitos

- **Node.js**: 22.x ou superior
- **Yarn**: 1.22 ou superior (gerenciador de pacotes)
- **Python**: 3.13 ou superior
- **Conta Supabase**: Para banco de dados e autenticação

### Configuração do Ambiente

#### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd tcc
```

#### 2. Configuração do Backend

```bash
# Entre na pasta do backend
cd backend

# Crie um ambiente virtual
python -m venv venv

# Ative o ambiente virtual
# No Windows:
venv\Scripts\activate
# No Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Crie um arquivo .env baseado no example.env
cp example.env .env

# Edite o .env com suas credenciais do Supabase
# SUPABASE_URL=sua_url_do_supabase
# SUPABASE_KEY=sua_chave_do_supabase
```

#### 3. Configuração do Frontend

```bash
# Volte para a raiz e entre na pasta do frontend
cd ../frontend

# Instale as dependências
yarn install

# Crie um arquivo .env baseado no example.env
cp example.env .env

# Edite o .env com suas credenciais:
# VITE_SUPABASE_URL=sua_url_do_supabase
# VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
# VITE_API_BASE_URL=localhost:8000 (para desenvolvimento)
```

#### 4. Configuração do Banco de Dados

Execute o script SQL em seu projeto Supabase:

```bash
# O arquivo está em database/schema.sql
# Execute no SQL Editor do Supabase
```

### Execução

#### Backend

```bash
cd backend

# Ative o ambiente virtual (se ainda não estiver ativo)
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Execute o servidor
python main.py

# Ou usando uvicorn diretamente:
uvicorn main:app --reload --port 8000
```

O backend estará disponível em: `http://localhost:8000`  
Documentação interativa (Swagger): `http://localhost:8000/docs`

#### Frontend

```bash
cd frontend

# Execute o servidor de desenvolvimento
yarn dev

O frontend estará disponível em: `http://localhost:5173`

### Comandos Úteis

#### Backend

```bash
# Executar testes
pytest

# Executar testes com cobertura
pytest --cov=app tests/
```

#### Frontend

```bash
# Build para produção
yarn build

# Preview da build
yarn preview

# Verificar tipos
yarn type-check

# Executar linter
yarn lint

# Executar testes
yarn test
```

---

## 🔐 Acesso ao Sistema

### Credenciais de Teste

⚠️ **Nota**: As credenciais de teste devem ser configuradas no ambiente Supabase. Para criar usuários de teste:

1. Acesse o painel do Supabase
2. Vá em Authentication → Users
3. Crie usuários manualmente ou use o painel admin do sistema

### Perfis de Usuário

O sistema possui três perfis:

- **Patient** (`patient`): Paciente que busca atendimento
- **Doctor** (`doctor`): Médico que realiza atendimentos
- **Admin** (`admin`): Administrador do sistema

### URLs de Acesso

- **Frontend (Desenvolvimento)**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000`
- **Documentação da API**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/`

### Deploy em Produção

O sistema está preparado para deploy em produção:

- **Frontend**: Pode ser deployado em Vercel, Netlify ou similar
- **Backend**: Pode ser deployado em Heroku, Railway, Render ou similar
- **Banco de Dados**: Gerenciado pelo Supabase (já em produção)

---

## 👥 Validação com Público-Alvo

### Público-Alvo Específico

A validação foi realizada com **profissionais reais da área da saúde**:

1. **Rebeca Aragão Linhares Cordeiro**
   - Estudante de Medicina, 7º semestre
   - UniChristus, Fortaleza
   - Atua semanalmente com pacientes em postos de saúde

2. **Nicole Camelo**
   - Estudante de Medicina, 7º semestre
   - UniChristus, Fortaleza
   - Utiliza sistemas hospitalares semanalmente

3. **Davi Vieira Machado Alves**
   - Estudante de Medicina, 5º semestre
   - Universidade de Fortaleza (Unifor)
   - Participa de ligas acadêmicas

### Resumo do Processo de Validação

A validação incluiu:

- ✅ Apresentação do sistema funcional
- ✅ Demonstração das principais funcionalidades
- ✅ Execução de tarefas guiadas pelos participantes
- ✅ Coleta de feedback estruturado
- ✅ Análise e implementação de melhorias

### Principais Feedbacks Recebidos

#### Pontos Positivos ✅

- Interface clean, intuitiva e de fácil navegação
- Fluxo estruturado pelo método SOAP, alinhado com práticas médicas
- Sistema simples sem perder robustez
- Boa experiência em diferentes dispositivos (tablets, computadores)
- Processo de registro objetivo e organizado
- Adequado para diferentes níveis educacionais

#### Sugestões de Melhoria 💡

- Seção para solicitar e anexar exames
- Número do prontuário como identificação adicional
- Possibilidade de salvar prontuário parcialmente (✅ **já implementado**)
- Atender pacientes fora da ordem da fila
- Aba de receitas com impressão
- Chat médico-paciente
- Upload de exames pelo paciente antes do atendimento

### Ajustes Implementados

Com base no feedback recebido, foram implementados:

- ✅ **Salvamento parcial de prontuário**: Permite sair e voltar mantendo informações
- ✅ **Melhorias na interface**: Ajustes baseados em sugestões de usabilidade
- ✅ **Otimizações no fluxo**: Melhorias na experiência do usuário

### Documentação da Validação

Para mais detalhes sobre a validação, consulte:

- [`validation/target_audience.md`](validation/target_audience.md) - Definição do público-alvo
- [`validation/validation_report.md`](validation/validation_report.md) - Relatório completo da validação
- [`validation/feedbacks/`](validation/feedbacks/) - Feedbacks individuais dos participantes
- [`validation/evidence/`](validation/evidence/) - Evidências fotográficas da validação

---

## 📁 Estrutura do Projeto

```
/
├── README.md                    # Este arquivo
├── docs/                        # Documentação técnica
│   ├── requirements/
│   │   └── requirements.md      # Requisitos atualizados
│   ├── architecture/
│   │   └── architecture.md      # Arquitetura final implementada
│   └── api/
│       └── api_documentation.md # Documentação da API
├── validation/                  # Validação com público-alvo
│   ├── target_audience.md      # Definição do público-alvo
│   ├── validation_report.md    # Relatório de validação
│   ├── evidence/                # Evidências fotográficas
│   └── feedbacks/               # Feedbacks coletados
├── frontend/                    # Código do frontend
│   ├── src/
│   │   ├── pages/              # Páginas da aplicação
│   │   ├── components/         # Componentes React
│   │   ├── api/                # Cliente API
│   │   └── utils/              # Utilitários
│   ├── public/
│   └── package.json
├── backend/                     # Código do backend
│   ├── app/
│   │   ├── api/                # Endpoints
│   │   ├── services/           # Serviços
│   │   └── core/               # Configurações
│   ├── tests/                  # Testes automatizados
│   ├── main.py
│   └── requirements.txt
└── database/                    # Scripts de banco
    └── schema.sql              # Esquema do banco de dados
```

---

## 📚 Documentação

### Documentação Técnica

- **[Requisitos](docs/requirements/requirements.md)**: Requisitos funcionais e não funcionais atualizados
- **[Arquitetura](docs/architecture/architecture.md)**: Arquitetura final implementada com justificativas
- **[API](docs/api/api_documentation.md)**: Documentação completa da API REST

### Documentação de Validação

- **[Público-Alvo](validation/target_audience.md)**: Definição específica do público-alvo
- **[Relatório de Validação](validation/validation_report.md)**: Processo completo de validação
- **[Feedbacks](validation/feedbacks/)**: Feedbacks individuais dos participantes

### Documentação Interativa

- **Swagger UI**: Disponível em `http://localhost:8000/docs` (quando backend estiver rodando)
- **ReDoc**: Disponível em `http://localhost:8000/redoc` (quando backend estiver rodando)

---

## 👨‍💻 Equipe de Desenvolvimento

### Membros da Equipe

**Adauto Dorta** (Desenvolvedor Full Stack)
- Desenvolvimento do frontend (React + TypeScript)
- Desenvolvimento do backend (FastAPI + Python)
- Integração com Supabase
- Testes e documentação

### Contribuições Principais

- **Arquitetura**: Definição e implementação da arquitetura em camadas
- **Frontend**: Desenvolvimento completo da interface React
- **Backend**: Desenvolvimento da API RESTful com FastAPI
- **Banco de Dados**: Modelagem e implementação do esquema
- **Testes**: Implementação de testes automatizados
- **Documentação**: Criação de toda a documentação técnica
- **Validação**: Coordenação do processo de validação com público-alvo

---

## 📝 Licença

Este projeto foi desenvolvido como parte do Projeto Aplicado Multiplataforma Etapa 2 (N708) da disciplina de Projeto Aplicado Multiplataforma.

---

## 🔗 Links Úteis

- [Supabase](https://supabase.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [ODS 11 - Cidades e Comunidades Sustentáveis](https://brasil.un.org/pt-br/sdgs/11)

**Última Atualização**: 29 de novembro de 2025  
**Versão**: 1.0.0

