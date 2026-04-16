# Evolve Finance

Sistema de controle financeiro pessoal com foco em organização, visualização e análise de receitas e despesas por pessoa.

---

## Visão Geral

O Evolve Finance é uma aplicação fullstack que permite:

- Cadastro de pessoas
- Cadastro de categorias financeiras
- Registro de transações (receitas e despesas)
- Visualização de saldo individual e geral
- Ranking financeiro por pessoa
- Histórico detalhado de transações

O sistema foi desenvolvido com foco em clareza, consistência de interface e separação adequada de responsabilidades entre as camadas.

---

## Arquitetura

O projeto está organizado em camadas:

Controle de Gastos Residenciais/<br>
├── ControleGastos.Api → API (controllers)<br>
├── ControleGastos.Application → regras de negócio e serviços<br>
├── ControleGastos.Domain → entidades e enums<br>
├── front → aplicação React (interface)


---

## Tecnologias Utilizadas

### Backend
- .NET (ASP.NET Core)
- Entity Framework Core
- SQLite
- Arquitetura em camadas

### Frontend
- React com TypeScript
- Vite
- TailwindCSS
- Framer Motion
- Axios

---

## Funcionalidades

### Pessoas
- Cadastro de indivíduos
- Associação com transações
- Cálculo automático de:
  - Total de receitas
  - Total de despesas
  - Saldo

### Transações
- Registro de receitas e despesas
- Associação obrigatória com:
  - Pessoa
  - Categoria
- Tipos:
  - Receita (0)
  - Despesa (1)

### Categorias
- Classificação das transações
- Finalidade:
  - Receita
  - Despesa
  - Ambas

### Relatórios
- Agregações realizadas no backend
- Retorno de:
  - Totais por pessoa
  - Ranking financeiro
- Processamento otimizado evitando carga no frontend

---

## Regras de Negócio

- Menores de idade não podem possuir receitas
- Categorias devem ser compatíveis com o tipo da transação
- Valores devem ser positivos
- Identificação das entidades baseada em ID (não em nome)

---

## Decisões de Interface

- Diferenciação de usuários com mesmo nome através de:
  - Identificador único (ID)
  - Avatar com cor gerada a partir do ID
- Consistência visual entre listagens, seleção e ranking
- Uso de cores para distinção de receitas (positivo) e despesas (negativo)

---

## Execução do Projeto

### Backend

```bash
dotnet restore
dotnet ef database update
dotnet run
```
## API disponível em:
```bash
http://localhost:5000
```
Swagger:

http://localhost:5000/swagger

---

### Frontend

## Execução do Projeto
```bash
cd controle-gastos-front
npm install
npm run dev
```
## Aplicação disponível em:
```bash
http://localhost:5173
```
---

## Endpoints Principais

### Pessoas
- GET /api/pessoas
- POST /api/pessoas
- DELETE /api/pessoas/{id}

### Categorias
- GET /api/categorias
- POST /api/categorias

### Transações
- POST /api/transacoes

### Relatórios
- GET /api/relatorios/pessoas
- GET /api/relatorios/{id}/transacoes

---

## Observações Técnicas

- Banco SQLite gerenciado via migrations
- Uso de DTOs para isolamento das entidades
- Services responsáveis pelas regras de negócio
- Controllers focados em orquestração

---

## Melhorias Futuras

- Autenticação e controle de usuários
- Filtros por período
- Exportação de relatórios
- Visualizações gráficas
- Busca avançada
- Componentes de seleção customizados

---

## Responsável

Luis Henrique Nunes Alves

---

## Créditos

Logo "Evolve Finance" criada por Camila Almeida Brito.  
A identidade visual e a marca pertencem ao autor do projeto.
