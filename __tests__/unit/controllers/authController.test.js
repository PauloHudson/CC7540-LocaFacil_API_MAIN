const authController = require('../../../src/controllers/authController');
const UserModel = require('../../../src/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../../src/models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthController - Testes Unitários', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('Deve retornar erro 400 se dados obrigatórios faltarem', async () => {
      mockReq = {
        body: {
          name: '',
          email: '',
          password: ''
        }
      };

      await authController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('obrigatorios')
        })
      );
    });

    it('Deve retornar erro 409 se email já existe', async () => {
      mockReq = {
        body: {
          name: 'João Silva',
          email: 'joao@test.com',
          password: '123456'
        }
      };

      UserModel.findByEmail.mockResolvedValue({ id: 1, email: 'joao@test.com' });

      await authController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('cadastrado')
        })
      );
    });

    it('Deve criar usuário com sucesso', async () => {
      mockReq = {
        body: {
          name: 'Maria Santos',
          email: 'maria@test.com',
          password: '123456',
          phone: '11999999999',
          cpf: '12345678901'
        }
      };

      const hashedPassword = 'hashed_password_123';
      const mockUser = {
        id: 1,
        name: 'Maria Santos',
        email: 'maria@test.com'
      };

      UserModel.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue(hashedPassword);
      UserModel.create.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('mock_token_123');

      await authController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Cadastro ok',
          user: mockUser,
          token: 'mock_token_123'
        })
      );
    });
  });

  describe('login', () => {
    it('Deve retornar erro 400 se email ou senha faltarem', async () => {
      mockReq = {
        body: {
          email: '',
          password: ''
        }
      };

      await authController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('Deve retornar erro 401 se usuário não encontrado', async () => {
      mockReq = {
        body: {
          email: 'inexistente@test.com',
          password: '123456'
        }
      };

      UserModel.findByEmail.mockResolvedValue(null);

      await authController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('Deve fazer login com sucesso e retornar token', async () => {
      mockReq = {
        body: {
          email: 'joao@test.com',
          password: '123456'
        }
      };

      const mockUser = {
        id: 1,
        name: 'João Silva',
        email: 'joao@test.com',
        password: 'hashed_password_123',
        is_admin: false,
        is_active: true
      };

      UserModel.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mock_token_xyz');

      await authController.login(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Login ok',
          token: 'mock_token_xyz'
        })
      );
    });
  });
});
