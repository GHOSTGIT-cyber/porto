# Ghost Consulting — Portfolio (instructions de maintenance)

Portfolio freelance de **Ghost Consulting** (développement web, mobile & SEO).
**Aucune identité réelle ne doit apparaître** sur le site : pas de nom de personne, téléphone,
e-mail perso, LinkedIn perso ni adresse. Marque = « Ghost Consulting » uniquement.
Le contact se fait via le **formulaire à étapes** (pas de coordonnées exposées).

## Mise en ligne
- Hébergé sur **GitHub Pages**, domaine **bakabi.fr** (déjà branché à ce repo `GHOSTGIT-cyber/porto`).
- **Déployer = `git push` sur `main`.** Pas de build, pas de workflow. Le site se met à jour en ~30 s.
- ⚠️ L'API publique GitHub peut indiquer `has_pages:false` à tort — ne pas s'y fier, vérifier directement https://bakabi.fr/.

## Structure (URLs propres en sous-dossiers)
| Fichier | URL | Rôle |
|---|---|---|
| `index.html` | bakabi.fr/ | redirige vers `/new/` |
| `new/index.html` | bakabi.fr/new/ | **page de choix** vers les 3 versions |
| `clair/index.html` | bakabi.fr/clair/ | design clair / premium |
| `sombre/index.html` | bakabi.fr/sombre/ | design sombre / tech |
| `ancien/index.html` | bakabi.fr/ancien/ | template d'origine, rebrandé (utilise `<base href="../">`) |

- `clair` et `sombre` partagent **la même structure HTML** ; seul le CSS (couleurs/typos) diffère.
  → **Toute modif de contenu doit être faite dans les DEUX** (et dans `ancien` si pertinent) pour rester synchrone.
- Liens internes en relatif `../` (ex : `../Projets/...`). Ne pas mettre de chemins absolus `/...`.

## Ajouter / modifier / décomposer un projet
Source de vérité du contenu projets : `~/Downloads/portfolio-case-studies.md` et `portfolio-inventory.md` (racine, non déployé).

**Dans `clair/index.html` ET `sombre/index.html`**, section `id="projets"` :
- Le projet phare **liftfoils.fr** est un bloc `.case` (étude de cas : contexte / `.case-list` / `.case-result` chiffré).
- Les autres sont des cartes `.proj` dans `.proj-grid`. Pour **ajouter** une carte, copier un bloc `<article class="proj reveal">…</article>` et remplir :
  - vignette : `<div class="thumb tN">` (classes dégradé `t1`..`t9`) + `<b>XX</b>` (initiales) + `<span class="badge">…</span>`
  - `.chips` (technos), `<h3>` (titre), `<p>` (pitch concret avec résultat), `<a class="link" href="…">`
- **Décomposer** un projet = soit le passer en bloc `.case` détaillé (comme liftfoils), soit le scinder en plusieurs cartes `.proj`.
- Garder la grille à un multiple de 3 cartes (rendu propre en 3 colonnes).

Pour `ancien/index.html` (template Bootstrap) : les projets sont dans `id="projets"`, cartes
`.col-lg-4 .hovereffect .portfolio-img` + overlay, avec classes de filtre `mix web|mobile|desktop` (MixItUp).

## Formulaire de contact
- `clair` et `sombre` ont un **formulaire à étapes** (`#briefForm`) qui envoie via **Web3Forms**.
- ⚠️ Remplacer la valeur `VOTRE_CLE_WEB3FORMS` (champ `access_key` caché) par une vraie clé
  (gratuite sur web3forms.com — la clé est un UUID lié à un e-mail côté Web3Forms, **l'e-mail n'apparaît pas** dans la page).
- Sans clé valide, le formulaire affiche le message de succès mais n'envoie rien.

## À personnaliser (placeholders en attente)
- **Tarifs** des formules (690 € / 1 900 € / sur devis) : à ajuster.
- **Témoignages** : remplacer par de vrais avis.
- **Clé Web3Forms** : à renseigner pour recevoir les demandes.
