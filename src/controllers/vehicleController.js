const VehicleModel = require('../models/Vehicle');

const vehicleController = {
  async getAll(req, res) {
    try {
      const { status } = req.query;
      const vehicles = await VehicleModel.getAll(status);
      res.json(vehicles);
    } catch (error) {
      console.error('Erro ao listar veículos:', error);
      res.status(500).json({ error: 'Erro ao listar' });
    }
  },

  async getAvailable(req, res) {
    try {
      const vehicles = await VehicleModel.getAvailable();
      res.json(vehicles);
    } catch (error) {
      console.error('Erro ao listar veículos disponíveis:', error);
      res.status(500).json({ error: 'Erro ao listar' });
    }
  },

  async getById(req, res) {
    try {
      const vehicle = await VehicleModel.findById(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ error: 'Veiculo nao encontrado' });
      }
      res.json(vehicle);
    } catch (error) {
      console.error('Erro ao buscar veículo:', error);
      res.status(500).json({ error: 'Erro ao buscar' });
    }
  },

  async create(req, res) {
    try {
      const { name, brand, model, year, color, license_plate, daily_price } = req.body;

      if (!name || !brand || !model || !year || !daily_price) {
        return res.status(400).json({ error: 'Campos faltando' });
      }

      const vehicle = await VehicleModel.create({
        name,
        brand,
        model,
        year,
        color,
        license_plate,
        daily_price
      });

      res.status(201).json({
        message: 'Veiculo criado',
        vehicle
      });
    } catch (error) {
      console.error('Erro ao criar veículo:', error);
      res.status(500).json({ error: 'Erro ao criar' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, brand, model, year, color, license_plate, daily_price, status } = req.body;

      const vehicle = await VehicleModel.update(id, {
        name: name || undefined,
        brand: brand || undefined,
        model: model || undefined,
        year: year || undefined,
        color: color || undefined,
        license_plate: license_plate || undefined,
        daily_price: daily_price || undefined,
        status: status || undefined
      });

      res.json({
        message: 'Veiculo atualizado',
        vehicle
      });
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      res.status(500).json({ error: 'Erro ao atualizar' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const success = await VehicleModel.delete(id);

      if (!success) {
        return res.status(404).json({ error: 'Veiculo nao encontrado' });
      }

      res.json({ message: 'Veiculo deletado' });
    } catch (error) {
      console.error('Erro ao deletar veículo:', error);
      res.status(500).json({ error: 'Erro ao deletar' });
    }
  }
};

module.exports = vehicleController;
