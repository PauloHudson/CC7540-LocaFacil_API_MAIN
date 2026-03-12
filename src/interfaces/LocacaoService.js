/**
 * <<interface>> LocacaoService
 * Gerencia o ciclo de vida do contrato de locação e o histórico do cliente.
 */
class LocacaoService {
  async iniciarLocacao(idUsuario, idProduto, prazo) {
    throw new Error('Not implemented');
  }

  async registrarLocacao(dadosLocacao) {
    throw new Error('Not implemented');
  }

  async consultarHistorico(idUsuario) {
    throw new Error('Not implemented');
  }
}

module.exports = LocacaoService;
