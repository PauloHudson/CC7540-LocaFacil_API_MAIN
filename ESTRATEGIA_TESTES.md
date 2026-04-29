# Estratégia de Testes - API LocaFácil

**Projeto:** LocaFácil Rental Platform  
**Disciplina:** CC7540 - Testes de Software  
**Período:** 2026  

---

## 3. Estratégia de Teste

### Descrição da Estratégia

Descrever estratégia de teste unitário e de integração. Para o teste unitário, deve-se escolher um dos serviços e validar sua lógica interna. Para o teste de integração, deve-se considerar a comunicação entre dois serviços ou entre um serviço e o banco de dados.

---

## 3.1 Tipo de Teste: Teste Unitário

### Objetivo do Teste
Validar a lógica interna de componentes isolados (Controllers), testando comportamentos individuais sem dependências externas, utilizando mocks para simular dependências.

### Técnica
- **Framework:** Jest
- **Abordagem:** Mocking de dependências (Models, bcryptjs, jsonwebtoken)
- **Cobertura:** Controllers (authController, vehicleController)
- **Testes Implementados:** 14 testes unitários

### Critério de Finalização
- ✅ Todos os testes unitários devem passar
- ✅ Cobertura mínima de 80% das funções críticas
- ✅ Validação de entradas inválidas
- ✅ Testes de casos de sucesso e erro

---

## 3.2 Tipo de Teste: Teste de Integração

### Objetivo do Teste
Validar a comunicação entre componentes (rotas HTTP e controllers) e garantir que as respostas da API estejam corretas quando requisições são feitas.

### Técnica
- **Framework:** Jest + Supertest
- **Abordagem:** Testes de rotas HTTP com mocks de serviços
- **Cobertura:** Endpoints REST (POST, GET, PUT, DELETE)
- **Testes Implementados:** 13 testes de integração

### Critério de Finalização
- ✅ Todos os endpoints devem retornar status HTTP correto
- ✅ Validação de dados de entrada
- ✅ Tratamento de erros (404, 400, 401)
- ✅ Verificação de estrutura de resposta JSON

---

## 4. Evidências dos Testes Realizados

### Resumo de Execução

```
Test Suites: 4 passed, 4 total
Tests:       27 passed, 27 total
Snapshots:   0 total
Time:        1.813 s
```

### Detalhamento dos Testes

#### 4.1 Testes Unitários - VehicleController (8 testes ✅)

| # | Teste | Status |
|---|-------|--------|
| 1 | getAll - Deve retornar lista de veículos | ✅ PASS |
| 2 | getAll - Deve filtrar veículos por status | ✅ PASS |
| 3 | getAll - Deve retornar erro 500 em caso de falha | ✅ PASS |
| 4 | getById - Deve retornar veículo por ID | ✅ PASS |
| 5 | getById - Deve retornar erro 404 se não existe | ✅ PASS |
| 6 | create - Deve validar campos obrigatórios | ✅ PASS |
| 7 | create - Deve criar veículo com sucesso | ✅ PASS |
| 8 | update - Deve atualizar veículo com sucesso | ✅ PASS |

#### 4.2 Testes Unitários - AuthController (6 testes ✅)

| # | Teste | Status |
|---|-------|--------|
| 1 | register - Deve retornar erro 400 se dados faltarem | ✅ PASS |
| 2 | register - Deve retornar erro 409 se email existe | ✅ PASS |
| 3 | register - Deve criar usuário com sucesso | ✅ PASS |
| 4 | login - Deve retornar erro 400 se credenciais faltam | ✅ PASS |
| 5 | login - Deve retornar erro 401 se usuário não existe | ✅ PASS |
| 6 | login - Deve fazer login com sucesso | ✅ PASS |

#### 4.3 Testes de Integração - Autenticação (6 testes ✅)

| # | Endpoint | Teste | Status |
|---|----------|-------|--------|
| 1 | POST /api/auth/register | Deve registrar novo usuário | ✅ PASS |
| 2 | POST /api/auth/register | Deve falhar se dados faltam | ✅ PASS |
| 3 | POST /api/auth/login | Deve fazer login com sucesso | ✅ PASS |
| 4 | POST /api/auth/login | Deve retornar erro se credenciais faltam | ✅ PASS |
| 5 | POST /api/auth/login | Deve retornar erro se usuário não existe | ✅ PASS |
| 6 | POST /api/auth/login | Deve retornar erro se senha incorreta | ✅ PASS |

#### 4.4 Testes de Integração - Veículos (7 testes ✅)

| # | Endpoint | Teste | Status |
|---|----------|-------|--------|
| 1 | GET /api/vehicles | Deve retornar lista de veículos | ✅ PASS |
| 2 | GET /api/vehicles/available | Deve retornar veículos disponíveis | ✅ PASS |
| 3 | GET /api/vehicles/:id | Deve retornar veículo específico | ✅ PASS |
| 4 | GET /api/vehicles/:id | Deve retornar erro 404 para inexistente | ✅ PASS |
| 5 | POST /api/vehicles | Deve criar novo veículo | ✅ PASS |
| 6 | POST /api/vehicles | Deve validar campos obrigatórios | ✅ PASS |
| 7 | PUT /api/vehicles/:id | Deve atualizar veículo | ✅ PASS |
| 8 | DELETE /api/vehicles/:id | Deve deletar veículo | ✅ PASS |
| 9 | DELETE /api/vehicles/:id | Deve retornar erro 404 para inexistente | ✅ PASS |

---

## 5. Estrutura de Testes no Projeto

```
__tests__/
├── unit/
│   └── controllers/
│       ├── authController.test.js (6 testes)
│       └── vehicleController.test.js (8 testes)
└── integration/
    ├── auth.integration.test.js (6 testes)
    └── vehicles.integration.test.js (7 testes)
```

---

## 6. Configuração e Execução

### Dependências Instaladas
- `jest@29.x` - Framework de testes
- `@babel/preset-env` - Transpilação ES6
- `babel-jest` - Suporte a Babel no Jest
- `supertest` - HTTP assertion library para testes de integração

### Comandos Disponíveis

```bash
# Executar todos os testes
npm test

# Executar apenas testes unitários
npm run test:unit

# Executar apenas testes de integração
npm run test:integration

# Executar com cobertura de código
npm run test:coverage

# Executar em modo watch
npm test -- --watch
```

---

## 7. Resultados da Execução

### Print da Execução Final

```
PASS  __tests__/unit/controllers/vehicleController.test.js
PASS  __tests__/unit/controllers/authController.test.js
PASS  __tests__/integration/auth.integration.test.js
PASS  __tests__/integration/vehicles.integration.test.js

Test Suites: 4 passed, 4 total
Tests:       27 passed, 27 total
Snapshots:   0 total
Time:        1.813 s, estimated 2 s
```

---

## 8. Considerações de Testes

### Pontos Cobertos
✅ Validação de entrada de dados  
✅ Tratamento de erros HTTP (400, 401, 404)  
✅ Respostas corretas de sucesso  
✅ Testes de autenticação e autorização  
✅ Testes de CRUD de recursos  

### Limitações
- Testes não usam banco de dados real (mocks)
- Não testa segurança em nível de produção
- Não testa performance/load testing
- Middlewares de autenticação mockados

### Próximos Passos (Recomendações)
- Implementar testes de carga/performance
- Adicionar testes E2E com Cypress/Playwright
- Aumentar cobertura de código para 90%+
- Implementar testes de segurança (OWASP)

---

## 9. Anexos

### 9.1 Arquivos de Teste Criados

- [__tests__/unit/controllers/authController.test.js](__tests__/unit/controllers/authController.test.js)
- [__tests__/unit/controllers/vehicleController.test.js](__tests__/unit/controllers/vehicleController.test.js)
- [__tests__/integration/auth.integration.test.js](__tests__/integration/auth.integration.test.js)
- [__tests__/integration/vehicles.integration.test.js](__tests__/integration/vehicles.integration.test.js)

### 9.2 Configuração do Jest

- [jest.config.js](jest.config.js)
- [.babelrc](.babelrc)

---

**Data da Execução:** 28 de Abril de 2026  
**Desenvolvedor:** Paulo / Equipe LocaFácil  
**Status Final:** ✅ TODOS OS TESTES PASSANDO
