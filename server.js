// Mini-serveur Ghost Consulting : sert le site statique + endpoint formulaire.
// Déployé sur Coolify (Build Pack = Dockerfile). Secrets via variables d'environnement.
const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Reçoit le formulaire de contact -> WhatsApp (CallMeBot) et/ou e-mail (SMTP)
app.post('/api/contact', async (req, res) => {
  const b = req.body || {};
  if (b.botcheck) return res.json({ ok: true });           // honeypot anti-spam
  if (!b.email && !b.message) return res.status(400).json({ ok: false });

  const msg =
`Nouvelle demande - Ghost Consulting
Type   : ${b.type || '-'}
Budget : ${b.budget || '-'}
Delai  : ${b.delai || '-'}
Email  : ${b.email || '-'}
Site   : ${b.site || '-'}
Message: ${b.message || '-'}`;

  let wa = false, mail = false, tg = false, waDebug = 'non tenté';

  // 1) Notification WhatsApp via CallMeBot (numéro + clé dans l'env, jamais dans la page)
  try {
    const phone = String(process.env.WA_PHONE || '').replace(/[^0-9]/g, ''); // enlève +, espaces, etc.
    if (phone && process.env.WA_APIKEY) {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}`
        + `&text=${encodeURIComponent(msg)}&apikey=${encodeURIComponent(process.env.WA_APIKEY)}`;
      const r = await fetch(url);
      const txt = await r.text();
      wa = /queued|sent|will receive/i.test(txt);
      waDebug = r.status + ' | ' + txt.replace(/<[^>]+>/g, ' ').replace(/\+?\d{6,}/g, '***').replace(/\s+/g, ' ').trim().slice(0, 150);
      console.log('CallMeBot:', waDebug);
    } else {
      waDebug = 'env manquant -> WA_PHONE(' + (phone ? 'ok' : 'VIDE') + ') WA_APIKEY(' + (process.env.WA_APIKEY ? 'ok' : 'VIDE') + ')';
      console.log('WhatsApp ignoré :', waDebug);
    }
  } catch (e) { waDebug = 'fetch error: ' + e.message; console.error('WhatsApp KO:', e.message); }

  // 2) E-mail via SMTP (optionnel - actif seulement si SMTP_HOST + MAIL_TO sont définis)
  try {
    if (process.env.SMTP_HOST && process.env.MAIL_TO) {
      const nodemailer = require('nodemailer');
      const t = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await t.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.MAIL_TO,
        replyTo: b.email || undefined,
        subject: 'Nouvelle demande - Ghost Consulting',
        text: msg,
      });
      mail = true;
    }
  } catch (e) { console.error('Mail KO:', e.message); }

  // 3) Notification Telegram (fiable depuis un serveur, contrairement à CallMeBot)
  try {
    if (process.env.TG_TOKEN && process.env.TG_CHAT) {
      const r = await fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: process.env.TG_CHAT, text: msg }),
      });
      tg = r.ok;
      console.log('Telegram:', r.status, 'ok=' + tg);
    }
  } catch (e) { console.error('Telegram KO:', e.message); }

  res.json({ ok: true, wa, mail, tg, waDebug });
});

// Sert le site statique (index.html à la racine, /clair/, /bleu/, /Projets/, assets...)
app.use(express.static(__dirname, { extensions: ['html'] }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Ghost Consulting en ligne sur le port ' + port));
