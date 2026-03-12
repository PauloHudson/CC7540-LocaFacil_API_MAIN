/**
 * <<interface>> PagamentoService
 * Interface de integração para o processamento financeiro e comunicação com o gateway.
 */
class PagamentoService {
  async processarPagamento(idLocacao, dadosPagamento) {
    throw new Error('Not implemented');
  }

  async confirmarPagamento(idTransacao) {
    throw new Error('Not implemented');
  }
}

module.exports = PagamentoService;
