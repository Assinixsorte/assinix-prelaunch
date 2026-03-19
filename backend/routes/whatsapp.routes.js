const express = require('express');
const router = express.Router();

const WhatsappLead = require('../models/whatsapp.model');

// ===== MIDDLEWARE DE PROTEÇÃO =====
function checkAdmin(req, res, next) {
  const password = req.headers['x-admin-password'];

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Acesso negado' });
  }

  next();
}

// ===== POST: salvar número =====
router.post('/', async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Número é obrigatório' });
  }

  if (phone.length < 9) {
    return res.status(400).json({ error: 'Número inválido' });
  }

  try {
    const insertId = await WhatsappLead.create(phone);

    res.status(201).json({
      success: true,
      id: insertId,
      message: 'Número salvo com sucesso'
    });

  } catch (err) {
    console.error('Erro ao salvar número:', err);

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Número já registrado' });
    }

    res.status(500).json({ error: 'Erro ao salvar número' });
  }
});

// ===== GET: listar números (PROTEGIDO) =====
router.get('/', checkAdmin, async (req, res) => {
  try {
    const numbers = await WhatsappLead.getAll();
    res.json(numbers);
  } catch (err) {
    console.error('Erro ao buscar números:', err);
    res.status(500).json({ error: 'Erro ao buscar números' });
  }
});

module.exports = router;