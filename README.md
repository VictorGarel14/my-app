# Mes applis

Deux petites applis web installables (PWA), sans serveur ni compte :

- **Mon budget** (`/budget`) : dépenses fixes et variables, journal du mois, reste à dépenser, mode simulation, onglet Investir (projection, clôture des mois).
- **VictorTrail OS** (`/trail`) : copie du site VictorTrail habillée façon 25H OS. Elle relit les données à jour de `/victorTrail/` quand il est en ligne, sinon elle utilise sa copie locale.
- **Ma cuisine** (`/cuisine`) : planning de repas sur 4 semaines orienté ultra-trail, recettes healthy, liste de courses (semaine ou mois) et estimation du budget courses.

Les données restent dans le navigateur du téléphone (localStorage). Les réglages de chaque appli permettent d'exporter ou d'importer une sauvegarde JSON.

## Mise en ligne

Settings → Pages → *Deploy from a branch* → `main` / `(root)`.
L'appli est ensuite disponible sur `https://<utilisateur>.github.io/<dépôt>/`.

## Modifier les recettes ou les prix

Tout est dans `cuisine/data.js` (ingrédients avec prix moyens, recettes avec quantités pour une portion).
Après une modification, augmenter le numéro de version dans `sw.js` (`CACHE = "cuisine-v2"`) pour que les téléphones récupèrent la nouvelle version.
