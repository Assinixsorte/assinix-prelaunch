require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

/* =========================
   MIDDLEWARES
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   SMTP (GMAIL)
========================= */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

/* =========================
   TEST ROUTE
========================= */
app.get('/api/test', (req, res) => {
  res.json({ ok: true });
});

/* =========================
   SEND EMAIL (PREMIUM + WHATSAPP LINK)
========================= */
app.post('/api/send-email', async (req, res) => {
  const { email, nome } = req.body;

  if (!email || !nome) {
    return res.status(400).json({ error: "Email e nome são obrigatórios" });
  }

  try {

    const logoUrl = "https://res.cloudinary.com/dvqbnvwry/image/upload/v1774977455/user_avatars/user_1/uuecclcz8qwja3wuhkcv.jpg";

    // LINK DO GRUPO WHATSAPP
    const groupLink = "https://chat.whatsapp.com/BgvS4xX8iwj6VkKmhQX5ss?mode=gi_t";

    const html = `
    <div style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">

      <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 8px 25px rgba(0,0,0,0.08);">

        <!-- HEADER -->
        <div style="padding:25px;text-align:center;background:#0f172a;">
          <img src="${logoUrl}" alt="Assinix Logo" style="max-width:120px;margin-bottom:10px;border-radius:8px;">
          <h2 style="color:#ffffff;margin:0;font-size:20px;">Assinix</h2>
          <p style="color:#94a3b8;margin:5px 0 0;font-size:13px;">Convite exclusivo para influenciadores</p>
        </div>

        <!-- BODY -->
        <div style="padding:30px;color:#111827;">

          <h2 style="margin-top:0;">Olá, ${nome} 👋</h2>

          <p style="font-size:15px;line-height:1.6;">
            Ficamos felizes em informar que você foi selecionado(a) para integrar a <strong>lista de espera VIP da Assinix</strong>.
          </p>

          <p style="font-size:15px;line-height:1.6;">
            Este grupo foi criado para reunir influenciadores selecionados que terão acesso antecipado à plataforma e às primeiras oportunidades disponíveis.
          </p>

          <div style="margin:25px 0;padding:20px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;">
            <p style="margin-top:0;font-weight:bold;">O que você terá acesso:</p>
            <ul style="padding-left:18px;line-height:1.8;font-size:14px;">
              <li>🚀 Acesso antecipado à plataforma</li>
              <li>📩 Recebimento de propostas em primeira mão</li>
              <li>⭐ Prioridade em campanhas exclusivas</li>
              <li>🔔 Notificações antes do lançamento oficial</li>
            </ul>
          </div>

          <p style="font-size:15px;line-height:1.6;">
            Nosso objetivo é construir uma comunidade de criadores preparados para aproveitar ao máximo as oportunidades desde o primeiro dia.
          </p>

          <p style="font-size:15px;line-height:1.6;">
            Assim que a plataforma for lançada, você será um dos primeiros a ser notificado e a ter acesso.
          </p>

          <!-- CTA WHATSAPP -->
          <div style="text-align:center;margin:35px 0;">
            <a href="${groupLink}" target="_blank"
               style="background:#25D366;color:#ffffff;padding:14px 30px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">
              Entrar no Grupo VIP
            </a>
          </div>

          <p style="font-size:13px;color:#6b7280;text-align:center;">
            Nos vemos lá — você pode ser um dos primeiros a acessar.
          </p>

        </div>

        <!-- FOOTER -->
        <div style="padding:20px;text-align:center;background:#f9fafb;font-size:12px;color:#6b7280;">
          © ${new Date().getFullYear()} Assinix — Todos os direitos reservados.
        </div>

      </div>
    </div>
    `;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL || '"Assinix" <aassinix@gmail.com>',
      to: email,
      subject: "🎯 Você foi selecionado(a) para a Assinix VIP",
      html
    });

    console.log("✅ Email enviado para:", email);

    res.json({ success: true });

  } catch (err) {
    console.error("❌ ERRO AO ENVIAR EMAIL:", err);
    res.status(500).json({ error: "Erro ao enviar email" });
  }
});

/* =========================
   FRONTEND
========================= */
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Server rodando em http://localhost:${PORT}`);
});