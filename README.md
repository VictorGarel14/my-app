# Mes applis

Deux petites applis web installables (PWA), sans serveur ni compte :

- **Mon budget** (`/budget`) : dépenses fixes et variables, journal du mois, reste à dépenser, mode simulation, onglet Investir (projection, clôture des mois).
- **VictorTrail OS** (`/trail`) : carnet d'entraînement façon « faux téléphone » : séances, semaine, stats et charge, courses 2027, zones, ravito.
- **Ma cuisine** (`/cuisine`) : planning de repas sur 4 semaines orienté ultra-trail, recettes healthy, liste de courses (semaine ou mois) et estimation du budget courses.

Les données restent dans le navigateur du téléphone (localStorage). Les réglages de chaque appli permettent d'exporter ou d'importer une sauvegarde JSON.

## Mise en ligne

Settings → Pages → *Deploy from a branch* → `main` / `(root)`.
L'appli est ensuite disponible sur `https://<utilisateur>.github.io/<dépôt>/`.

## Modifier les recettes ou les prix

Tout est dans `cuisine/data.js` (ingrédients avec prix moyens, recettes avec quantités pour une portion).
Après une modification, augmenter le numéro de version dans `sw.js` (`CACHE = "cuisine-v2"`) pour que les téléphones récupèrent la nouvelle version.
