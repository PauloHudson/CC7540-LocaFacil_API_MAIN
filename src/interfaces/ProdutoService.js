/**
 * <<interface>> ProdutoService
 * Responsável pela gestão e visualização do catálogo de itens disponíveis para locação.
 */
class ProdutoService {
  async visualizarProdutos() {
    throw new Error('Not implemented');
  }

  async obterDetalhesProduto(idProduto, tipo) {
    throw new Error('Not implemented');
  }

  async verificarDisponibilidade(idProduto, tipo) {
    throw new Error('Not implemented');
  }
}

module.exports = ProdutoService;
