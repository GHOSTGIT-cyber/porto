<p align="center">
  <img src=".github/readme/banner.svg" alt="Portfolio — bakabi.fr" width="100%">
</p>

> Mon portfolio et mes offres de services, en HTML statique.

![HTML](https://img.shields.io/badge/HTML-0B1A2A?style=flat-square&labelColor=0B1A2A&color=1E3A52) ![CSS](https://img.shields.io/badge/CSS-0B1A2A?style=flat-square&labelColor=0B1A2A&color=1E3A52) ![JAVASCRIPT](https://img.shields.io/badge/JAVASCRIPT-0B1A2A?style=flat-square&labelColor=0B1A2A&color=1E3A52) ![DOCKER](https://img.shields.io/badge/DOCKER-0B1A2A?style=flat-square&labelColor=0B1A2A&color=1E3A52)

<p align="center">
  <a href="https://bakabi.fr"><img src=".github/readme/screenshot.jpg" alt="Capture de Portfolio — bakabi.fr" width="100%"></a>
</p>

**Statut** — 🟢 En production sur [bakabi.fr](https://bakabi.fr)

---

# Portfolio — bakabi.fr

## Le problème

Un indépendant a besoin d'une vitrine qui charge vite, qu'il peut corriger en deux minutes sans passer par un CMS, et qui se redéploie n'importe où.

## Ce que fait le projet

- Une page par offre : agents IA, audit SEO et GEO, automatisation n8n, infogérance VPS, maintenance WordPress
- Des fiches projets avec captures, un blog et une page de contact
- Un `llms.txt` à la racine, pour que les moteurs de réponse IA sachent quoi citer
- Aucune base de données, aucun build : des fichiers servis tels quels

## Structure

`index.html` et une page par offre · `Projets/` les fiches · `blog/` · `assets/` · `Dockerfile` pour le déploiement

## Lancer le projet

Ouvrir `index.html` dans un navigateur. Pour servir en local : `python -m http.server 8080`.

---

<sub>Développé par **Bakari Abidina** · [bakabi.fr](https://bakabi.fr)</sub>
