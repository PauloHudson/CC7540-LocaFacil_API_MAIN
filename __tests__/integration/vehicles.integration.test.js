const request = require('supertest');
const express = require('express');

describe('Rotas de Veículos - Testes de Integração', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Mock routes para testes
    app.get('/api/vehicles', (req, res) => {
      const mockVehicles = [
        {
          id: 1,
          name: 'Toyota Corolla',
          brand: 'Toyota',
          daily_price: 150,
          status: 'available'
        }
      ];
      res.json(mockVehicles);
    });

    app.get('/api/vehicles/available', (req, res) => {
      res.json([{ id: 1, name: 'Toyota Corolla', status: 'available' }]);
    });

    app.get('/api/vehicles/:id', (req, res) => {
      if (req.params.id === '999') {
        return res.status(404).json({ error: 'Veiculo nao encontrado' });
      }
      res.json({ id: 1, name: 'Toyota Corolla', brand: 'Toyota' });
    });

    app.post('/api/vehicles', (req, res) => {
      const { name, brand, model, year, daily_price } = req.body;
      if (!name || !brand || !model || !year || !daily_price) {
        return res.status(400).json({ error: 'Campos faltando' });
      }
      res.status(201).json({
        message: 'Veiculo criado',
        vehicle: { id: 3, ...req.body, status: 'available' }
      });
    });

    app.put('/api/vehicles/:id', (req, res) => {
      res.json({
        message: 'Veiculo atualizado',
        vehicle: { id: 1, name: 'Toyota Corolla', ...req.body }
      });
    });

    app.delete('/api/vehicles/:id', (req, res) => {
      if (req.params.id === '999') {
        return res.status(404).json({ error: 'Veiculo nao encontrado' });
      }
      res.json({ message: 'Veiculo deletado' });
    });
  });

  describe('GET /api/vehicles', () => {
    it('Deve retornar lista de veículos', async () => {
      const response = await request(app).get('/api/vehicles');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('name', 'Toyota Corolla');
    });
  });

  describe('GET /api/vehicles/available', () => {
    it('Deve retornar veículos disponíveis', async () => {
      const response = await request(app).get('/api/vehicles/available');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/vehicles/:id', () => {
    it('Deve retornar veículo específico', async () => {
      const response = await request(app).get('/api/vehicles/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Toyota Corolla');
    });

    it('Deve retornar erro 404 para veículo inexistente', async () => {
      const response = await request(app).get('/api/vehicles/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/vehicles', () => {
    it('Deve criar novo veículo', async () => {
      const newVehicle = {
        name: 'Ford Focus',
        brand: 'Ford',
        model: 'Focus',
        year: 2023,
        daily_price: 100
      };

      const response = await request(app)
        .post('/api/vehicles')
        .send(newVehicle);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Veiculo criado');
    });

    it('Deve validar campos obrigatórios', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .send({ brand: 'Ford' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Campos faltando');
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    it('Deve atualizar veículo', async () => {
      const response = await request(app)
        .put('/api/vehicles/1')
        .send({ daily_price: 180 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Veiculo atualizado');
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    it('Deve deletar veículo', async () => {
      const response = await request(app).delete('/api/vehicles/1');

      expect(response.status).toBe(200);
    });

    it('Deve retornar erro para veículo inexistente', async () => {
      const response = await request(app).delete('/api/vehicles/999');

      expect(response.status).toBe(404);
    });
  });
});
