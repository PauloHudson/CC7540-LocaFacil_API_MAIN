const ElectronicModel = require('../models/Electronic');

const electronicController = {
  async getAll(req, res) {
    try {
      const { status } = req.query;
      const electronics = await ElectronicModel.getAll(status);
      res.json(electronics);
    } catch (error) {
      console.error('Erro ao listar eletrônicos:', error);
      res.status(500).json({ error: 'Erro ao listar' });
    }
  },

  async getAvailable(req, res) {
    try {
      const electronics = await ElectronicModel.getAvailable();
      res.json(electronics);
    } catch (error) {
      console.error('Erro ao listar eletrônicos disponíveis:', error);
      res.status(500).json({ error: 'Erro ao listar' });
    }
  },

  async getById(req, res) {
    try {
      const electronic = await ElectronicModel.findById(req.params.id);
      if (!electronic) {
        return res.status(404).json({ error: 'Eletronico nao encontrado' });
      }
      res.json(electronic);
    } catch (error) {
      console.error('Erro ao buscar eletrônico:', error);
      res.status(500).json({ error: 'Erro ao buscar' });
    }
  },

  async create(req, res) {
    try {
      const { name, brand, model, specifications, daily_price, image_urls } = req.body;
      console.log('Debug: electronic.create received image_urls ->', image_urls);

      if (!name || !brand || !model || !daily_price) {
        return res.status(400).json({ error: 'Campos faltando' });
      }

      const electronic = await ElectronicModel.create({
        name,
        brand,
        model,
        specifications,
        daily_price,
        image_urls
      });

      res.status(201).json({
        message: 'Eletronico criado',
        electronic
      });
    } catch (error) {
      console.error('Erro ao criar eletrônico:', error);
      res.status(500).json({ error: 'Erro ao criar' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, brand, model, specifications, daily_price, status, image_urls } = req.body;

      const electronic = await ElectronicModel.update(id, {
        name: name || undefined,
        brand: brand || undefined,
        model: model || undefined,
        specifications: specifications || undefined,
        daily_price: daily_price || undefined,
        status: status || undefined,
        image_urls: image_urls || undefined
      });

      res.json({
        message: 'Eletronico atualizado',
        electronic
      });
    } catch (error) {
      console.error('Erro ao atualizar eletrônico:', error);
      res.status(500).json({ error: 'Erro ao atualizar' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const success = await ElectronicModel.delete(id);

      if (!success) {
        return res.status(404).json({ error: 'Eletronico nao encontrado' });
      }

      res.json({ message: 'Eletronico deletado' });
    } catch (error) {
      console.error('Erro ao deletar eletrônico:', error);
      res.status(500).json({ error: 'Erro ao deletar' });
    }
  }
};

module.exports = electronicController;
