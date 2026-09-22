// Génère public/qr.svg et public/qr.png pour la page de contact /c.
// Usage : npm run qr        (ou QR_URL=https://autre.domaine/c npm run qr)
// Correction d'erreur M (≈15 % de la surface récupérable : suffisant pour un
// QR imprimé, sans gonfler la densité), marge de 4 modules (zone de silence
// exigée par la norme pour une lecture fiable).
'use strict';
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const URL = process.env.QR_URL || 'https://bakabi.fr/c';
const OUT = path.join(__dirname, '..', 'public');
const opts = { errorCorrectionLevel: 'M', margin: 4 };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await QRCode.toFile(path.join(OUT, 'qr.svg'), URL, { ...opts, type: 'svg' });
  await QRCode.toFile(path.join(OUT, 'qr.png'), URL, { ...opts, type: 'png', width: 1024 });
  const v = QRCode.create(URL, opts).version;
  console.log(`QR généré pour ${URL}`);
  console.log(`  version ${v} (${17 + 4 * v}×${17 + 4 * v} modules), correction M, marge 4`);
  console.log(`  -> ${path.relative(process.cwd(), path.join(OUT, 'qr.svg'))}`);
  console.log(`  -> ${path.relative(process.cwd(), path.join(OUT, 'qr.png'))} (1024 px)`);
})().catch((e) => { console.error(e); process.exit(1); });
