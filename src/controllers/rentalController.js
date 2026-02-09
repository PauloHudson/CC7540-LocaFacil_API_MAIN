const RentalModel = require('../models/Rental');
const VehicleModel = require('../models/Vehicle');
const ElectronicModel = require('../models/Electronic');

const rentalController = {
  async create(req, res) {
    try {
      const {
        vehicle_id,
        electronic_id,
        start_date,
        end_date,
        insurance_selected,
        insurance_price
      } = req.body;

      const user_id = req.user.id;

      // Validação
      if (!start_date || !end_date) {
        return res.status(400).json({ error: 'Datas obrigatorias' });
      }

      if (!vehicle_id && !electronic_id) {
        return res.status(400).json({ error: 'Selecione item' });
      }

      // Calcular dias
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

      if (totalDays <= 0) {
        return res.status(400).json({ error: 'Datas invalidas' });
      }

      let daily_rate = 0;
      let rentalType = '';
      let item_id = null;

      if (vehicle_id) {
        const vehicle = await VehicleModel.findById(vehicle_id);
        if (!vehicle) {
          return res.status(404).json({ error: 'Veiculo nao encontrado' });
        }

        // Verificar disponibilidade
        const isAvailable = await RentalModel.checkAvailability(
          vehicle_id,
          'vehicle',
          start_date,
          end_date
        );

        if (!isAvailable) {
          return res.status(409).json({ error: 'Veiculo indisponivel' });
        }

        daily_rate = vehicle.daily_price;
        rentalType = 'vehicle';
        item_id = vehicle_id;
      } else {
        const electronic = await ElectronicModel.findById(electronic_id);
        if (!electronic) {
          return res.status(404).json({ error: 'Eletronico nao encontrado' });
        }

        // Verificar disponibilidade
        const isAvailable = await RentalModel.checkAvailability(
          electronic_id,
          'electronic',
          start_date,
          end_date
        );

        if (!isAvailable) {
          return res.status(409).json({ error: 'Eletronico indisponivel' });
        }

        daily_rate = electronic.daily_price;
        rentalType = 'electronic';
        item_id = electronic_id;
      }

      const total_price = daily_rate * totalDays;
      const finalInsurancePrice = insurance_selected ? (insurance_price || 0) : 0;
      const final_total = total_price + (finalInsurancePrice * totalDays);

      const rental = await RentalModel.create({
        user_id,
        vehicle_id: vehicle_id || null,
        electronic_id: electronic_id || null,
        rental_type: rentalType,
        start_date,
        end_date,
        total_days: totalDays,
        daily_rate,
        total_price,
        insurance_selected: insurance_selected || false,
        insurance_price: finalInsurancePrice,
        final_total
      });

      res.status(201).json({
        message: 'Locacao criada',
        rental
      });
    } catch (error) {
      console.error('Erro ao criar locação:', error);
      res.status(500).json({ error: 'Erro ao criar' });
    }
  },

  async getById(req, res) {
    try {
      const rental = await RentalModel.findById(req.params.id);
      if (!rental) {
        return res.status(404).json({ error: 'Locacao nao encontrada' });
      }

      // Verificar se o usuário é dono da locação ou admin
      if (rental.user_id !== req.user.id && !req.user.is_admin) {
        return res.status(403).json({ error: 'Sem acesso' });
      }

      res.json(rental);
    } catch (error) {
      console.error('Erro ao buscar locação:', error);
      res.status(500).json({ error: 'Erro ao buscar' });
    }
  },

  async getUserRentals(req, res) {
    try {
      const rentals = await RentalModel.getByUserId(req.user.id);
      res.json(rentals);
    } catch (error) {
      console.error('Erro ao listar locações do usuário:', error);
      res.status(500).json({ error: 'Erro ao listar' });
    }
  },

  async getAllRentals(req, res) {
    try {
      const rentals = await RentalModel.getAll();
      res.json(rentals);
    } catch (error) {
      console.error('Erro ao listar locações:', error);
      res.status(500).json({ error: 'Erro ao listar' });
    }
  },

  async processPayment(req, res) {
    try {
      const { id } = req.params;
      const { payment_method } = req.body;

      const rental = await RentalModel.findById(id);
      if (!rental) {
        return res.status(404).json({ error: 'Locacao nao encontrada' });
      }

      if (rental.user_id !== req.user.id && !req.user.is_admin) {
        return res.status(403).json({ error: 'Sem acesso' });
      }

      // Simulação de pagamento (sem integração real)
      const updatedRental = await RentalModel.updatePaymentStatus(id, 'confirmed');

      res.json({
        message: 'Pagamento ok',
        rental: updatedRental
      });
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      res.status(500).json({ error: 'Erro no pagamento' });
    }
  },

  async cancelRental(req, res) {
    try {
      const { id } = req.params;

      const rental = await RentalModel.findById(id);
      if (!rental) {
        return res.status(404).json({ error: 'Locacao nao encontrada' });
      }

      if (rental.user_id !== req.user.id && !req.user.is_admin) {
        return res.status(403).json({ error: 'Sem acesso' });
      }

      const updatedRental = await RentalModel.updateStatus(id, 'cancelled');

      res.json({
        message: 'Locacao cancelada',
        rental: updatedRental
      });
    } catch (error) {
      console.error('Erro ao cancelar locação:', error);
      res.status(500).json({ error: 'Erro ao cancelar' });
    }
  }
};

module.exports = rentalController;
