const express = require('express');
const router = express.Router();

const Lead = require('../models/lead.model');

// ===== MIDDLEWARE DE PROTEÇÃO =====
function checkAdmin(req, res, next) {
  const password = req.headers['x-admin-password'];

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Acesso negado' });
  }

  next();
}

// ===== POST: cadastrar lead =====
router.post('/', async (req, res) => {
  const { nome, email, social } = req.body;

  if (!nome || !email || !social) {
    return res.status(400).json({ error: 'Nome, email e rede social são obrigatórios' });
  }

  try {
    const insertId = await Lead.create({ nome, email, social });

    res.status(201).json({
      success: true,
      id: insertId,
      message: 'Lead cadastrado com sucesso! 🚀'
    });

  } catch (err) {
    console.error('Erro ao cadastrar lead:', err);
    res.status(500).json({ error: 'Erro ao cadastrar lead' });
  }
});

// ===== GET: listar leads (PROTEGIDO) =====
router.get('/', checkAdmin, async (req, res) => {
  try {
    const leads = await Lead.getAll();
    res.json(leads);
  } catch (err) {
    console.error('Erro ao buscar leads:', err);
    res.status(500).json({ error: 'Erro ao buscar leads' });
  }
});

module.exports = router;