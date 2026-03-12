# CC7540-LocaFacil_API_MAIN

src/
  interfaces/               ← NOVO: contratos abstratos
    ProdutoService.js
    LocacaoService.js
    SeguroService.js
    PagamentoService.js
  components/               ← NOVO: implementações concretas
    ProdutoComponent.js     ← extends ProdutoService, reúne vehicles + electronics
    SeguroComponent.js      ← extends SeguroService
    LocacaoComponent.js     ← extends LocacaoService, requer Produto + Seguro
    PagamentoComponent.js   ← extends PagamentoService, requer Locacao
  controllers/
    authController.js       ← class AuthController (com constructor + bind)
    userController.js       ← class UserController (com constructor + bind)
    vehicleController.js    ← mantido (não usado pelas rotas)
    electronicController.js ← mantido (não usado pelas rotas)
    insuranceController.js  ← mantido (não usado pelas rotas)
    rentalController.js     ← mantido (não usado pelas rotas)
  routes/
    vehicles.js     ← usa ProdutoComponent
    electronics.js  ← usa ProdutoComponent
    insurance.js    ← usa SeguroComponent
    rentals.js      ← usa LocacaoComponent + PagamentoComponent
    auth.js         ← usa AuthController (sem mudança)
    users.js        ← usa UserController (sem mudança)