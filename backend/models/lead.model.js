const db = require('../db/database'); // conexão MySQL

const Lead = {

  // Criar lead
  create: ({ nome, email, social }) => {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO leads (nome, email, social) VALUES (?, ?, ?)';
      
      db.query(query, [nome, email, social], (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  },

  // ✅ Buscar todos os leads
  getAll: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM leads ORDER BY created_at DESC';

      db.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

};

module.exports = Lead;