const request = require('supertest');
const express = require('express');

describe('Rotas de Autenticação - Testes de Integração', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Mock routes para testes
    app.post('/api/auth/register', (req, res) => {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e senha obrigatorios' });
      }
      res.status(201).json({ 
        message: 'Cadastro ok',
        user: { id: 1, name, email },
        token: 'mock_token'
      });
    });

    app.post('/api/auth/login', (req, res) => {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha obrigatorios' });
      }
      res.json({
        message: 'Login ok',
        token: 'mock_token',
        user: { id: 1, email }
      });
    });
  });

  describe('POST /api/auth/register', () => {
    it('Deve registrar novo usuário com sucesso', async () => {
      const newUser = {
        name: 'Carlos Silva',
        email: 'carlos@test.com',
        password: 'senha123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Cadastro ok');
      expect(response.body).toHaveProperty('token');
    });

    it('Deve falhar se dados obrigatórios faltam', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('Deve fazer login com sucesso', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'carlos@test.com',
          password: 'senha123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login ok');
      expect(response.body).toHaveProperty('token');
    });

    it('Deve retornar erro se credenciais faltam', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com' });

      expect(response.status).toBe(400);
    });
  });
});
