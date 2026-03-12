/**
 * <<interface>> SeguroService
 * Interface especializada para a categoria de automóveis.
 */
class SeguroService {
  async listarOpcoesSeguro() {
    throw new Error('Not implemented');
  }

  async vincularSeguro(idLocacao, idSeguro) {
    throw new Error('Not implemented');
  }
}

module.exports = SeguroService;
