const UserModel = require('../models/User');

class UserController {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.makeAdmin = this.makeAdmin.bind(this);
    this.deactivateUser = this.deactivateUser.bind(this);
  }

  async getAll(req, res) {
    try {
      const users = await UserModel.getAll();
      res.json(users);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ error: 'Erro ao listar' });
    }
  }

  async getById(req, res) {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario nao encontrado' });
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        cpf: user.cpf,
        is_admin: user.is_admin,
        is_active: user.is_active,
        created_at: user.created_at
      });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ error: 'Erro ao buscar' });
    }
  }

  async update(req, res) {
    try {
      const { name, phone, cpf } = req.body;
      const userId = req.user.id;

      const updatedUser = await UserModel.update(userId, {
        name: name || undefined,
        phone: phone || undefined,
        cpf: cpf || undefined
      });

      res.json({
        message: 'Usuario atualizado',
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          cpf: updatedUser.cpf
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ error: 'Erro ao atualizar' });
    }
  }

  async makeAdmin(req, res) {
    try {
      const { userId } = req.params;

      const updatedUser = await UserModel.update(userId, { is_admin: true });

      res.json({
        message: 'Usuario virou ADM',
        user: updatedUser
      });
    } catch (error) {
      console.error('Erro ao promover usuário:', error);
      res.status(500).json({ error: 'Erro ao promover' });
    }
  }

  async deactivateUser(req, res) {
    try {
      const { userId } = req.params;

      const success = await UserModel.delete(userId);
      if (!success) {
        return res.status(404).json({ error: 'Usuario nao encontrado' });
      }

      res.json({ message: 'Usuario desativado' });
    } catch (error) {
      console.error('Erro ao desativar usuário:', error);
      res.status(500).json({ error: 'Erro ao desativar' });
    }
  }
}

module.exports = new UserController();
