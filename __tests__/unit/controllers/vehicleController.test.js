const vehicleController = require('../../../src/controllers/vehicleController');
const VehicleModel = require('../../../src/models/Vehicle');

jest.mock('../../../src/models/Vehicle');

describe('VehicleController - Testes Unitários', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('Deve retornar lista de veículos', async () => {
      mockReq = { query: {} };

      const mockVehicles = [
        {
          id: 1,
          name: 'Toyota Corolla',
          brand: 'Toyota',
          model: 'Corolla',
          year: 2022,
          daily_price: 150
        }
      ];

      VehicleModel.getAll.mockResolvedValue(mockVehicles);

      await vehicleController.getAll(mockReq, mockRes);

      expect(VehicleModel.getAll).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockVehicles);
    });

    it('Deve filtrar veículos por status', async () => {
      mockReq = { query: { status: 'available' } };

      const mockVehicles = [
        {
          id: 1,
          name: 'Toyota Corolla',
          status: 'available'
        }
      ];

      VehicleModel.getAll.mockResolvedValue(mockVehicles);

      await vehicleController.getAll(mockReq, mockRes);

      expect(VehicleModel.getAll).toHaveBeenCalledWith('available');
      expect(mockRes.json).toHaveBeenCalledWith(mockVehicles);
    });

    it('Deve retornar erro 500 em caso de falha', async () => {
      mockReq = { query: {} };

      VehicleModel.getAll.mockRejectedValue(new Error('Database error'));

      await vehicleController.getAll(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getById', () => {
    it('Deve retornar veículo por ID', async () => {
      mockReq = { params: { id: 1 } };

      const mockVehicle = {
        id: 1,
        name: 'Toyota Corolla',
        brand: 'Toyota'
      };

      VehicleModel.findById.mockResolvedValue(mockVehicle);

      await vehicleController.getById(mockReq, mockRes);

      expect(VehicleModel.findById).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith(mockVehicle);
    });

    it('Deve retornar erro 404 se veículo não existe', async () => {
      mockReq = { params: { id: 999 } };

      VehicleModel.findById.mockResolvedValue(null);

      await vehicleController.getById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('nao encontrado')
        })
      );
    });
  });

  describe('create', () => {
    it('Deve validar campos obrigatórios', async () => {
      mockReq = {
        body: {
          name: '',
          brand: 'Toyota'
        }
      };

      await vehicleController.create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('Campos faltando')
        })
      );
    });

    it('Deve criar veículo com sucesso', async () => {
      mockReq = {
        body: {
          name: 'Honda Civic',
          brand: 'Honda',
          model: 'Civic',
          year: 2023,
          color: 'Preto',
          license_plate: 'ABC1234',
          daily_price: 120
        }
      };

      const mockVehicle = {
        id: 1,
        ...mockReq.body,
        status: 'available'
      };

      VehicleModel.create.mockResolvedValue(mockVehicle);

      await vehicleController.create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Veiculo criado',
          vehicle: mockVehicle
        })
      );
    });
  });

  describe('update', () => {
    it('Deve atualizar veículo com sucesso', async () => {
      mockReq = {
        params: { id: 1 },
        body: {
          name: 'Honda Civic 2024',
          daily_price: 130
        }
      };

      const mockVehicle = {
        id: 1,
        name: 'Honda Civic 2024',
        daily_price: 130
      };

      VehicleModel.update.mockResolvedValue(mockVehicle);

      await vehicleController.update(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Veiculo atualizado',
          vehicle: mockVehicle
        })
      );
    });
  });
});
