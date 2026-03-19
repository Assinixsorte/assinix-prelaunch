require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
console.log('ADMIN PASSWORD:', process.env.ADMIN_PASSWORD);

const app = express();

// ===== MIDDLEWARES =====
app.use(cors());
app.use(express.json());

// ===== ROTA DE TESTE =====
app.get('/api/test', (req, res) => {
  res.json({ ok: true });
});

// ===== ROTAS =====
const leadsRoutes = require('./routes/leads.routes');       // rota para salvar leads
const whatsappRoutes = require('./routes/whatsapp.routes'); // rota para salvar números do WhatsApp

app.use('/api/leads', leadsRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// ===== SERVIR FRONTEND ESTÁTICO =====
app.use(express.static(path.join(__dirname, '../frontend')));

// ===== FALLBACK =====
// Qualquer rota não encontrada retorna o index.html do frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ===== PORTA =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Server rodando em http://localhost:${PORT}`);
});