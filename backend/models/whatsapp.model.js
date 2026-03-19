const db = require('../config/db');

const Whatsapp = {

  // Criar número
  create: async (phone) => {
    try {
      const [result] = await db.execute(
        'INSERT INTO whatsapp_numbers (phone) VALUES (?)',
        [phone]
      );
      return result.insertId;

    } catch (err) {
      console.error('Erro ao salvar número:', err);
      throw err;
    }
  },

  // ✅ Buscar todos os números
  getAll: async () => {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM whatsapp_numbers ORDER BY created_at DESC'
      );
      return rows;

    } catch (err) {
      console.error('Erro ao buscar números:', err);
      throw err;
    }
  }

};

module.exports = Whatsapp;