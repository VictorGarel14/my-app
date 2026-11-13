# Mes applis

Deux petites applis web installables (PWA), sans serveur ni compte :

- **Mon budget** (`/budget`) : dépenses fixes et variables, journal du mois, reste à dépenser, mode simulation, onglet Investir (projection, clôture des mois).
- **VictorTrail OS** (`/trail`) : copie du site VictorTrail habillée façon 25H OS. Elle relit les données à jour de `/victorTrail/` quand il est en ligne, sinon elle utilise sa copie locale.
- **Le Bestiaire** (dans VictorTrail OS, menu Plus) : une carte TCG par semaine jusqu'à la Diagonale des Fous. Chaque vendredi à 8 h une nouvelle carte se débloque ; on la touche pour la retourner. Cartes et illustrations dans `trail/cartes/` (`cards.json` + `img/`).
- **Parcours conseillés** (dans VictorTrail OS, fiche de chaque séance de course) : propose un itinéraire qui colle à la distance et au D+ de la séance, au choix depuis la maison (Nice), le bureau (Monaco) ou une gare de la ligne Monaco → Nice (descendre du train et rentrer en courant). Les itinéraires (liste `IDEES` dans `trail/parcours.js`) sont tracés sur les sentiers OpenStreetMap par BRouter puis gardés dans le téléphone ; carte, profil, « Y aller » et export GPX pour l'appli Coros. Onglet « Mes sorties » : mes anciennes traces Coros (`trail/parcours.enc.json`, chiffré : lisible seulement une fois connecté).
- **Ma cuisine** (`/cuisine`) : planning de repas sur 4 semaines orienté ultra-trail, recettes healthy, liste de courses (semaine ou mois) et estimation du budget courses.

Les données restent dans le navigateur du téléphone (localStorage). Les réglages de chaque appli permettent d'exporter ou d'importer une sauvegarde JSON.

## Mise en ligne

Settings → Pages → *Deploy from a branch* → `main` / `(root)`.
L'appli est ensuite disponible sur `https://<utilisateur>.github.io/<dépôt>/`.

## Modifier les recettes ou les prix

Tout est dans `cuisine/data.js` (ingrédients avec prix moyens, recettes avec quantités pour une portion).
Après une modification, augmenter le numéro de version dans `sw.js` (`CACHE = "cuisine-v2"`) pour que les téléphones récupèrent la nouvelle version.

## Ajouter une carte au Bestiaire

1. Mettre l'illustration dans `trail/cartes/img/` (JPEG ~600 px de large).
2. Dans `trail/cartes/cards.json`, ajouter ou compléter l'entrée du bon `slot` (1 = ven. 13 nov. 2026, puis +1 chaque vendredi ; 49 = jour de la Diagonale) avec `img`.
3. Rien d'autre à faire : l'appli relit `cards.json` à chaque ouverture.
