// Mini-serveur Ghost Consulting : sert le site statique + endpoint formulaire.
// Déployé sur Coolify (Build Pack = Dockerfile). Secrets via variables d'environnement.
const express = require('express');
const path = require('path');
const app = express();

// Derrière Cloudflare : fait confiance aux en-têtes X-Forwarded-* (proto, host, ip)
app.set('trust proxy', true);

// Redirections canoniques (SEO) + forçage HTTPS. Placé TRÈS TÔT, avant tout traitement.
// Anti-boucle : l'apex en HTTPS ne déclenche AUCUNE redirection ici.
app.use((req, res, next) => {
  const host = (req.headers.host || '').toLowerCase();
  const proto = req.headers['x-forwarded-proto'];

  // Force HTTPS : seulement si Cloudflare indique explicitement 'http' (sinon on ne touche à rien)
  if (proto === 'http') {
    return res.redirect(301, 'https://' + host + req.url);
  }
  // Redirige www -> apex (SEO : une seule URL canonique). N'agit pas sur l'apex (pas de boucle).
  if (host === 'www.bakabi.fr') {
    return res.redirect(301, 'https://bakabi.fr' + req.url);
  }
  // Redirige /index.html -> / (SEO : pas de doublon). Conserve la query string éventuelle.
  if (req.path === '/index.html') {
    const qs = req.url.slice(req.path.length); // garde "?..." s'il existe
    return res.redirect(301, '/' + qs);
  }
  next();
});

// En-tête de sécurité HSTS (force HTTPS côté navigateur pendant 1 an)
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  next();
});

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

  let mail = false, tg = false;
  // NB : WhatsApp est envoyé CÔTÉ NAVIGATEUR (CallMeBot bloque l'IP serveur en 403). Voir index.html.

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

  res.json({ ok: true, mail, tg });
});

// Sert le site statique (index.html à la racine, /clair/, /bleu/, /Projets/, assets...)
app.use(express.static(__dirname, { extensions: ['html'] }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Ghost Consulting en ligne sur le port ' + port));
