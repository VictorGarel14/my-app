// Recettes détaillées pas à pas (u = ustensiles, s = étapes). Remplacent les étapes courtes de data.js.
// Les durées « X min » dans une étape affichent un bouton minuteur dans l'appli.
(function(){
var MANDO="Mandoline : utilise toujours le poussoir (protège-main), jamais les doigts à plat sur la lame.";
var RIZ="Riz : rince-le dans une passoire sous l'eau froide jusqu'à ce que l'eau soit presque claire. Mets-le dans une casserole avec 1,5 fois son volume d'eau froide et une pincée de sel. Porte à ébullition, baisse sur feu doux, couvre et laisse cuire 12 min sans soulever le couvercle. Coupe le feu et laisse reposer 5 min couvert, puis aère à la fourchette.";
var PATES="Pâtes : fais bouillir une grande casserole d'eau (environ 1 litre pour 100 g), sale-la (1 c. à café de sel), verse les pâtes et remue tout de suite pour qu'elles ne collent pas. Compte le temps indiqué sur le paquet (souvent 10 min), goûte 1 min avant : elles doivent être tendres mais encore un peu fermes. Garde une louche d'eau de cuisson avant d'égoutter.";
var QUINOA="Quinoa : rince-le bien dans une passoire fine (sinon il est amer). Mets-le dans une casserole avec 2 fois son volume d'eau salée, porte à ébullition puis feu doux, couvercle, 12 min. Il est cuit quand on voit un petit filament blanc autour de chaque grain.";
window.STEPS={
porridge:{u:["Petite casserole","Cuillère en bois","Fourchette"],s:[
 "Verse le lait et les flocons d'avoine dans la casserole.",
 "Allume sur feu moyen et remue sans arrêt pendant 5 min : ça épaissit petit à petit. Si ça accroche au fond, baisse le feu.",
 "Pendant ce temps, épluche la banane. Écrase la moitié à la fourchette dans une assiette, coupe l'autre moitié en rondelles.",
 "Hors du feu, ajoute la banane écrasée et le miel dans la casserole, mélange.",
 "Verse dans un bol, pose les rondelles de banane et le beurre de cacahuète par-dessus."]},
overnight:{u:["Bocal ou boîte avec couvercle","Cuillère"],s:[
 "La veille au soir : mets l'avoine, les graines de chia et le miel dans le bocal.",
 "Ajoute le skyr et le lait, puis mélange bien jusqu'à ce qu'il n'y ait plus de paquets d'avoine sec.",
 "Pose les fruits rouges encore surgelés par-dessus (ils décongèlent pendant la nuit et font un coulis).",
 "Ferme le bocal et mets-le au frigo au moins 6 h.",
 "Le matin, mélange une fois et mange froid. Si c'est trop épais, ajoute un trait de lait."]},
omelette:{u:["Poêle antiadhésive","Bol","Fourchette","Grille-pain","Couteau"],s:[
 "Casse les 3 œufs dans un bol, ajoute une pincée de sel et de poivre, bats à la fourchette 30 secondes.",
 "Mets le pain à griller.",
 "Fais chauffer la poêle sur feu moyen avec quelques gouttes d'huile, étale-la avec un essuie-tout.",
 "Verse les œufs. Avec une spatule, ramène doucement les bords vers le centre pendant 2 min, puis laisse prendre encore 1 min sans toucher.",
 "Coupe l'avocat en deux, retire le noyau, récupère la chair d'une moitié à la cuillère et écrase-la sur les tartines.",
 "Coupe les tomates en tranches. Plie l'omelette en deux et sers le tout."]},
skyrbowl:{u:["Poêle","Bol","Couteau"],s:[
 "Concasse grossièrement les amandes au couteau (ou mets-les dans un sac et tape dessus avec une casserole).",
 "Fais chauffer la poêle à sec sur feu moyen, ajoute l'avoine et les amandes et remue 3 min jusqu'à ce que ça sente le grillé. Attention, ça brûle vite.",
 "Verse le skyr dans un bol, ajoute la banane en rondelles.",
 "Parsème du mélange croustillant encore tiède et termine par le miel."]},
pancakes:{u:["Shaker électrique ou mixeur","Poêle antiadhésive","Spatule"],s:[
 "Mets les œufs, la banane épluchée et l'avoine dans le shaker électrique, mixe 30 secondes jusqu'à une pâte lisse.",
 "Fais chauffer la poêle sur feu moyen-doux avec un peu d'huile étalée à l'essuie-tout.",
 "Verse 2 cuillères à soupe de pâte par pancake (3-4 à la fois). Cuis 2 min : quand des petites bulles apparaissent dessus, retourne avec la spatule.",
 "Cuis encore 1 min de l'autre côté, puis recommence avec le reste de pâte.",
 "Fais tiédir les fruits rouges 1 min au micro-ondes. Sers les pancakes avec le fromage blanc et les fruits."]},
tartsaumon:{u:["Mandoline","Grille-pain","Petit bol"],s:[
 "Mets le pain à griller.",
 "Dans un petit bol, mélange le fromage blanc avec un filet de jus de citron, sel et poivre.",
 "Coupe le concombre en très fines rondelles à la mandoline (lame la plus fine). "+MANDO,
 "Étale le fromage blanc sur le pain grillé, pose les rondelles de concombre.",
 "Termine par les tranches de saumon fumé et un tour de poivre."]},
rizmiel:{u:["Petite casserole","Cuillère en bois"],s:[
 "Rince le riz rapidement dans une passoire.",
 "Mets le riz et le lait dans la casserole, porte à frémissement (petites bulles) sur feu moyen.",
 "Baisse sur feu doux et laisse cuire 15 min en remuant toutes les 2-3 min pour que ça n'attache pas. Le riz doit être tendre et le mélange crémeux.",
 "Hors du feu, ajoute le miel et les raisins secs.",
 "Sers avec la banane en rondelles. À manger 2 à 3 h avant une sortie longue : c'est léger à digérer."]},
smoothie:{u:["Shaker électrique ou blender","Bol"],s:[
 "Mets la banane en morceaux, les fruits rouges surgelés, le skyr et le lait dans le shaker électrique.",
 "Mixe 20 à 30 secondes jusqu'à ce que ce soit bien lisse. Trop épais : ajoute un peu de lait.",
 "Verse dans un bol et parsème de flocons d'avoine.",
 "À prendre dans l'heure qui suit la séance pour bien récupérer."]},
teriyaki:{u:["Casserole","Poêle","Cuit-vapeur ou passoire + couvercle","Petit bol"],s:[
 RIZ,
 "Coupe le brocoli en petits bouquets. Fais-le cuire à la vapeur 6 min (ou dans une passoire posée sur une casserole d'eau bouillante, avec un couvercle) : il doit rester vert vif et un peu croquant.",
 "Dans un petit bol, mélange la sauce soja, le miel et l'ail râpé (ou écrasé).",
 "Coupe le poulet en dés de 2 cm. Fais chauffer la poêle sur feu vif avec un filet d'huile, ajoute le poulet et laisse dorer 6-7 min en remuant de temps en temps. Coupe un morceau : l'intérieur doit être blanc, plus rosé.",
 "Verse la sauce sur le poulet, remue 1 min : elle devient brillante et nappe les morceaux.",
 "Dans un bol : riz, brocoli, poulet, et le reste de sauce par-dessus."]},
saumonpd:{u:["Plaque du four + papier cuisson","Casserole","Économe"],s:[
 "Préchauffe le four 10 min avant (réglages dans « Réglage du four » en bas de la recette).",
 "Épluche la patate douce à l'économe et coupe-la en cubes de 2 cm. Sur la plaque, mélange-les avec l'huile, du sel et du paprika.",
 "Enfourne 15 min.",
 "Ajoute le pavé de saumon sur la même plaque (sel, poivre) et remets 12 min au four. Le saumon est cuit quand il se détache en lamelles à la fourchette.",
 "Pendant ce temps, fais cuire les haricots verts 8 min dans de l'eau bouillante salée, puis égoutte.",
 "Sers le tout avec un filet de citron sur le saumon."]},
bololent:{u:["Râpe","Sauteuse ou grande poêle","Casserole"],s:[
 "Épluche et coupe l'oignon en petits dés. Épluche la carotte et râpe-la.",
 "Fais chauffer un filet d'huile dans la sauteuse sur feu moyen, ajoute l'oignon et la carotte et laisse fondre 5 min en remuant.",
 "Ajoute les lentilles corail (pas besoin de les rincer), les tomates concassées et 150 ml d'eau. Sel, poivre, un peu d'origan si tu as.",
 "Laisse mijoter à feu doux 15 min en remuant de temps en temps : les lentilles se défont et font une sauce épaisse. Ajoute un peu d'eau si ça devient trop sec.",
 PATES,
 "Mélange les pâtes à la sauce et parsème de parmesan."]},
currypc:{u:["Mandoline","Sauteuse","Casserole","Passoire"],s:[
 RIZ,
 "Coupe l'oignon en fines lamelles à la mandoline (ou au couteau). "+MANDO,
 "Coupe la courgette en demi-rondelles d'1 cm. Égoutte et rince les pois chiches.",
 "Dans la sauteuse sur feu moyen avec un filet d'huile, fais revenir l'oignon 3 min, puis ajoute le curry et remue 1 min : ça doit sentir fort.",
 "Ajoute les tomates, le lait de coco, les pois chiches et la courgette. Sale, mélange.",
 "Laisse mijoter 12 min à feu doux à découvert. La courgette doit être tendre quand on la pique au couteau.",
 "Sers le curry sur le riz."]},
chili:{u:["Mandoline","Grande sauteuse ou cocotte","Casserole","Passoire"],s:[
 "Coupe l'oignon en dés. Coupe le poivron en deux, retire les graines et la partie blanche, puis tranche-le en fines lanières à la mandoline. "+MANDO,
 "Dans la cocotte sur feu moyen avec un filet d'huile, fais revenir l'oignon et le poivron 5 min.",
 "Ajoute le bœuf haché, émiette-le à la cuillère en bois et laisse dorer 5 min jusqu'à ce qu'il n'y ait plus de rose.",
 "Ajoute les épices (cumin, paprika, un peu de piment), remue 1 min.",
 "Ajoute les tomates concassées et les haricots rouges rincés et égouttés. Sale, mélange.",
 "Laisse mijoter à feu doux 20 min, couvercle entrouvert, en remuant de temps en temps.",
 RIZ,
 "Sers le chili sur le riz. Il est encore meilleur réchauffé le lendemain."]},
wraps:{u:["Mandoline","Poêle","Petit bol"],s:[
 "Coupe le poulet en fines lanières. Saupoudre de paprika, sel et poivre.",
 "Fais chauffer la poêle sur feu vif avec un filet d'huile, cuis le poulet 6 min en remuant, jusqu'à ce qu'il soit doré partout.",
 "Tranche la tomate en fines rondelles à la mandoline. "+MANDO+" Coupe quelques feuilles de salade en lanières.",
 "Mélange le fromage blanc avec un trait de citron et une pincée de sel.",
 "Fais tiédir les wraps 20 secondes à la poêle sèche (ils se roulent mieux).",
 "Sur chaque wrap : fromage blanc, avocat écrasé, salade, tomate, poulet. Replie le bas, puis roule serré."]},
quinoafeta:{u:["Mandoline","Casserole","Passoire fine","Saladier"],s:[
 QUINOA,
 "Égoutte le quinoa et passe-le sous l'eau froide pour le refroidir.",
 "Coupe le concombre en fines rondelles à la mandoline, puis en quarts. "+MANDO,
 "Coupe les tomates en dés et la feta en cubes. Rince et égoutte les pois chiches.",
 "Dans le saladier, mélange tout avec l'huile d'olive, le jus du demi-citron, sel et poivre.",
 "Se garde 3 jours au frigo dans une boîte fermée : parfait pour le midi au bureau."]},
cabipuree:{u:["2 casseroles","Poêle","Presse-purée ou fourchette","Économe"],s:[
 "Épluche les pommes de terre à l'économe, coupe-les en gros morceaux de taille égale.",
 "Mets-les dans une casserole d'eau froide salée, porte à ébullition et cuis 20 min. Elles sont cuites quand un couteau s'y enfonce sans résistance.",
 "Égoutte, ajoute le lait chaud et écrase au presse-purée. Sale, poivre, une pincée de muscade si tu as.",
 "Pendant ce temps, cuis les petits pois 5 min dans de l'eau bouillante.",
 "Sèche le cabillaud avec un essuie-tout. Poêle sur feu moyen avec l'huile, pose le poisson et cuis 4 min de chaque côté sans le bouger. Il est cuit quand il devient blanc opaque et se défait en lamelles.",
 "Sers avec un filet de citron."]},
tortilla:{u:["Mandoline","Poêle antiadhésive de 20-24 cm avec couvercle","Saladier","Grande assiette plate"],s:[
 "Épluche les pommes de terre et coupe-les en rondelles très fines (2-3 mm) à la mandoline. "+MANDO,
 "Coupe l'oignon en fines lamelles à la mandoline aussi, et la courgette en fines rondelles.",
 "Dans la poêle sur feu moyen avec l'huile, mets les pommes de terre et l'oignon, couvre et laisse cuire 15 min en remuant toutes les 5 min. Elles doivent être tendres.",
 "Ajoute la courgette et cuis encore 5 min à découvert.",
 "Bats les œufs dans le saladier avec sel et poivre, verse les légumes dedans et mélange.",
 "Remets le tout dans la poêle sur feu doux, couvre et cuis 8 min. Le dessus doit être presque pris.",
 "Pose une grande assiette sur la poêle, retourne d'un coup, puis fais glisser la tortilla dans la poêle pour cuire l'autre face 2 min."]},
risotto:{u:["Mandoline","Sauteuse","Casserole (pour le bouillon)","Poêle","Louche"],s:[
 "Fais chauffer 600 ml d'eau avec un cube de bouillon dans une casserole, garde-la frémissante à côté.",
 "Coupe l'oignon en petits dés. Tranche les champignons à la mandoline. "+MANDO,
 "Dans la sauteuse avec un filet d'huile, fais revenir l'oignon 2 min, puis les champignons 4 min.",
 "Ajoute le riz et remue 1 min pour qu'il devienne translucide.",
 "Verse une louche de bouillon, remue jusqu'à ce qu'elle soit absorbée, puis recommence louche par louche pendant 25 min. C'est cuit quand le riz est tendre mais garde un petit cœur.",
 "En parallèle, poêle le poulet en dés 6 min sur feu vif.",
 "Hors du feu, ajoute le poulet et le parmesan au risotto, mélange et laisse reposer 1 min."]},
poke:{u:["Mandoline","Casserole","Râpe"],s:[
 RIZ,
 "Laisse tiédir le riz.",
 "Coupe le concombre en fines rondelles à la mandoline. "+MANDO,
 "Épluche et râpe la carotte. Coupe l'avocat en tranches.",
 "Égoutte le thon et émiette-le.",
 "Dans un bol : le riz, puis chaque ingrédient en petit tas à côté. Arrose de sauce soja et de graines de sésame si tu en as."]},
dahl:{u:["Râpe","Sauteuse","Casserole"],s:[
 "Coupe l'oignon en petits dés. Épluche et râpe les carottes.",
 "Dans la sauteuse sur feu moyen avec un filet d'huile, fais revenir l'oignon 3 min, puis ajoute le curry et le cumin, remue 1 min.",
 "Ajoute les lentilles, les carottes râpées, les tomates, le lait de coco et 300 ml d'eau. Sale.",
 "Laisse mijoter 15 min à feu doux en remuant de temps en temps : les lentilles doivent se défaire en purée épaisse.",
 RIZ,
 "Sers le dahl avec le riz et un filet de citron si tu en as."]},
patesaumon:{u:["Mandoline","Casserole","Poêle"],s:[
 PATES,
 "Coupe la courgette en fines demi-rondelles à la mandoline. "+MANDO,
 "Coupe le saumon en dés de 2 cm (retire la peau en glissant le couteau entre la peau et la chair).",
 "Dans la poêle sur feu moyen-vif avec un filet d'huile, saisis le saumon 3 min, ajoute la courgette et cuis encore 3 min.",
 "Hors du feu, ajoute le fromage blanc, le zeste (la peau râpée) et le jus du demi-citron, une louche d'eau des pâtes, sel, poivre.",
 "Ajoute les pâtes égouttées et mélange doucement pour ne pas écraser le saumon."]},
tofubowl:{u:["Plaque du four + papier cuisson","Casserole","Poêle","Passoire fine","Économe"],s:[
 "Préchauffe le four 10 min avant (réglages dans « Réglage du four » en bas de la recette). Épluche la patate douce, coupe-la en cubes, mélange avec un filet d'huile et du sel sur la plaque, enfourne 25 min.",
 QUINOA,
 "Coupe le brocoli en petits bouquets et cuis-les 6 min à la vapeur ou dans l'eau bouillante.",
 "Coupe le poulet en dés. Poêle sur feu vif avec un filet d'huile 6 min, puis ajoute la sauce soja et laisse caraméliser 1 min.",
 "Assemble le bowl : quinoa, patate douce, brocoli, poulet."]},
steakpdt:{u:["Plaque du four + papier cuisson","Poêle"],s:[
 "Préchauffe le four 10 min avant (réglages dans « Réglage du four » en bas de la recette).",
 "Lave les pommes de terre (pas besoin de les éplucher), coupe-les en quartiers. Sur la plaque, mélange avec l'huile, sel, poivre et herbes de Provence.",
 "Enfourne 30 min en les retournant à mi-cuisson : elles doivent être dorées et croustillantes.",
 "5 min avant la fin, fais chauffer la poêle sur feu vif sans matière grasse. Pose le steak et cuis 2 à 3 min de chaque côté selon la cuisson voulue.",
 "Sers avec la salade assaisonnée (huile, vinaigre, sel)."]},
rizcrevette:{u:["Râpe","Casserole","Grande poêle ou wok","Bol"],s:[
 RIZ+" Idéal : cuis-le la veille, le riz froid saute mieux.",
 "Épluche la carotte et coupe-la en petits dés.",
 "Dans la grande poêle sur feu vif avec un filet d'huile, fais sauter la carotte et les petits pois 5 min.",
 "Ajoute les crevettes (décongelées et séchées à l'essuie-tout) et cuis 3 min : elles deviennent roses.",
 "Ajoute le riz, remue 2 min pour le réchauffer.",
 "Pousse tout sur un côté, casse l'œuf dans la partie vide, brouille-le 30 secondes puis mélange avec le reste.",
 "Arrose de sauce soja, remue 1 min et sers."]},
soupebut:{u:["Grande casserole","Mixeur plongeant ou blender","Économe","Grille-pain"],s:[
 "Épluche la butternut à l'économe, retire les graines à la cuillère, coupe la chair en cubes de 3 cm.",
 "Coupe l'oignon en morceaux.",
 "Dans la casserole avec un filet d'huile, fais revenir l'oignon 2 min, ajoute la butternut et les lentilles.",
 "Couvre d'eau juste à hauteur, sale, porte à ébullition puis cuis 20 min à feu moyen.",
 "Ajoute le lait de coco et mixe jusqu'à ce que ce soit bien lisse.",
 "Sers avec les tartines grillées."]},
pouletsem:{u:["Mandoline","Plaque du four + papier cuisson","Saladier","Bouilloire"],s:[
 "Préchauffe le four 10 min avant (réglages dans « Réglage du four » en bas de la recette).",
 "Coupe la courgette et la carotte en fines rondelles à la mandoline, le poivron en lanières. "+MANDO,
 "Coupe le poulet en morceaux. Sur la plaque, mélange légumes et poulet avec l'huile, les épices (paprika, cumin), sel et poivre.",
 "Enfourne 25 min en remuant à mi-cuisson.",
 "Mets la semoule dans un saladier avec une pincée de sel. Verse le même volume d'eau bouillante, couvre d'une assiette et attends 5 min.",
 "Égraine la semoule à la fourchette et sers avec le poulet et les légumes."]},
salpates:{u:["Mandoline","Casserole","Passoire","Saladier"],s:[
 PATES,
 "Égoutte les pâtes et rince-les à l'eau froide pour qu'elles ne collent pas.",
 "Coupe les tomates en dés. Tranche le poivron en fines lanières à la mandoline. "+MANDO,
 "Coupe la mozzarella en cubes, égoutte le thon.",
 "Dans le saladier, mélange tout avec l'huile d'olive, sel, poivre, et un peu de basilic si tu en as.",
 "Mets en boîte : ça se garde 2-3 jours au frigo."]},
dinde:{u:["Mandoline","Casserole","Poêle"],s:[
 RIZ,
 "Coupe l'oignon en dés. Tranche les champignons à la mandoline. "+MANDO,
 "Coupe la dinde en lanières.",
 "Dans la poêle sur feu vif avec un filet d'huile, saisis la dinde 4 min, puis ajoute l'oignon et les champignons et cuis encore 6 min.",
 "Coupe le feu et ajoute le fromage blanc. Mélange (hors du feu, sinon il tranche). Sel, poivre.",
 "Sers sur le riz."]},
sardpates:{u:["Casserole","Poêle"],s:[
 PATES,
 "Épluche et écrase la gousse d'ail (pose le plat du couteau dessus et appuie avec la paume).",
 "Dans la poêle sur feu moyen avec un filet d'huile, fais revenir l'ail 30 secondes, sans le laisser brunir.",
 "Ajoute les tomates concassées et laisse réduire 8 min.",
 "Ajoute les sardines égouttées, émiette-les grossièrement et chauffe 2 min.",
 "Mélange avec les pâtes, ajoute un filet de citron et du poivre."]},
balls:{u:["Shaker électrique ou mixeur","Assiette"],s:[
 "Retire les noyaux des dattes.",
 "Mixe les dattes, l'avoine, le beurre de cacahuète et le chocolat jusqu'à obtenir une pâte qui colle quand on la presse.",
 "Si c'est trop sec, ajoute une cuillère d'eau ; si c'est trop collant, un peu d'avoine.",
 "Forme 4 boules avec les mains légèrement mouillées.",
 "Mets 30 min au frigo. Elles se gardent une semaine dans une boîte : parfait dans le sac de trail."]},
skyrmiel:{u:["Bol"],s:["Verse le skyr dans un bol.","Ajoute le miel et les noix concassées.","C'est prêt."]},
banamande:{u:[],s:["Prends une banane et une poignée d'amandes (25 g, environ 20 amandes).","À glisser dans le sac pour une collation avant ou pendant la séance."]},
tartbc:{u:["Grille-pain"],s:["Fais griller le pain.","Étale le beurre de cacahuète.","Ajoute la demi-banane en rondelles."]},
sh_pates:{u:["Grande sauteuse","Casserole","Râpe"],s:[
 "Coupe l'oignon en petits dés. Épluche et hache finement l'ail.",
 "Dans la sauteuse sur feu moyen-vif avec un filet d'huile, fais revenir l'oignon 3 min.",
 "Ajoute le bœuf haché, émiette-le à la cuillère et laisse dorer 5 min jusqu'à ce qu'il soit bien coloré.",
 "Ajoute l'ail et le paprika fumé, remue 1 min.",
 "Verse les tomates concassées et 50 ml d'eau (ou de bouillon). Laisse mijoter 10 min à feu doux.",
 PATES,
 "Hors du feu, ajoute le mascarpone et la moitié du parmesan dans la sauce et mélange jusqu'à ce que ce soit crémeux.",
 "Ajoute les pâtes, mélange, puis termine avec le reste du parmesan et un peu de persil."]},
sh_cottage:{u:["Mandoline","Petit bol","Grille-pain"],s:[
 "Mets le pain à griller.",
 "Étale le cottage cheese au fond d'une assiette creuse.",
 "Égoutte le thon et mélange-le avec du paprika et quelques gouttes de sauce piquante (sriracha ou tabasco).",
 "Coupe l'oignon rouge en très fines lamelles à la mandoline. "+MANDO,
 "Coupe l'avocat en tranches.",
 "Pose le thon au centre, l'avocat à côté, parsème d'oignon et d'herbes, arrose de citron. Sers avec le pain grillé."]},
sh_brochettes:{u:["Mandoline","Saladier","Plaque du four + papier cuisson","Piques à brochette","Couteau bien aiguisé"],s:[
 "Préchauffe le four 10 min avant (réglages dans « Réglage du four » en bas de la recette). Si tes piques sont en bois, fais-les tremper dans l'eau (sinon elles brûlent).",
 "Coupe l'oignon en tout petits dés. Dans le saladier, mélange le bœuf haché cru, l'oignon, les épices (paprika, cumin, sel, poivre) et du persil.",
 "Étale une fine couche de viande sur chaque wrap, jusqu'aux bords, puis parsème de fromage râpé.",
 "Roule chaque wrap bien serré, puis coupe-le en tronçons de 3 cm avec un couteau bien aiguisé.",
 "Pique 4-5 tronçons sur chaque brochette, pose-les sur la plaque et enfourne 20 min.",
 "Pendant ce temps, mélange le fromage blanc avec des herbes (persil, ciboulette), un peu d'ail et de citron.",
 "Tranche le concombre à la mandoline et les tomates en quartiers. "+MANDO,
 "Sers les brochettes avec la sauce et les crudités."]},
sh_skyrvert:{u:["Poêle","Assiette creuse"],s:[
 "Coupe la banane en deux dans la longueur.",
 "Fais chauffer la poêle sur feu moyen avec le miel. Pose la banane face coupée en dessous et laisse caraméliser 2-3 min, retourne et cuis 1 min.",
 "Mélange le skyr avec la crème de pistache et étale-le dans l'assiette.",
 "Pose la banane caramélisée, les fruits rouges, l'avoine et le beurre de cacahuète par-dessus."]},
sh_bouchees:{u:["Shaker électrique","Bol","Poêle antiadhésive"],s:[
 "Mets l'avoine, l'œuf, le lait et le fromage blanc dans le shaker électrique et mixe 30 secondes : tu obtiens une pâte épaisse.",
 "Verse la pâte dans un bol.",
 "Coupe la banane en rondelles d'1 cm et plonge-les dans la pâte pour bien les enrober.",
 "Fais chauffer la poêle sur feu moyen avec un peu d'huile, pose les rondelles une par une, cuis 2 min, retourne et cuis encore 2 min.",
 "Détends le beurre de cacahuète avec une cuillère de lait chaud pour en faire une sauce.",
 "Sers les bouchées avec les fruits rouges et la sauce par-dessus."]},
sh_pommes:{u:["Poêle","Bol"],s:[
 "Fais griller l'avoine 5 min à sec dans la poêle sur feu moyen, en remuant. Mets-la de côté.",
 "Coupe la pomme en petits dés (pas besoin de l'éplucher).",
 "Dans la même poêle, fais revenir la pomme avec la cannelle et le miel 4-5 min : elle doit être tendre et dorée.",
 "Verse le skyr dans un bol, ajoute l'avoine et les pommes.",
 "Termine avec les myrtilles, le chocolat haché et les amandes."]},
sh_galette:{u:["Casserole","Plaque du four + papier cuisson","Presse-purée ou fourchette"],s:[
 "Lave les pommes de terre et cuis-les entières 20 min dans de l'eau salée, jusqu'à ce qu'un couteau s'y enfonce facilement.",
 "Préchauffe le four 10 min avant (réglages dans « Réglage du four » en bas de la recette).",
 "Égoutte, pose les pommes de terre sur la plaque et écrase-les grossièrement à la fourchette pour former une grande galette d'1-2 cm d'épaisseur.",
 "Arrose d'huile, parsème de parmesan, sel et poivre. Enfourne 25 min : les bords doivent être bien dorés et croustillants.",
 "Laisse tiédir 5 min (sinon le fromage blanc fond).",
 "Mélange le fromage blanc avec du citron, étale-le sur la galette, puis pose le saumon fumé et la roquette. Coupe en parts comme une pizza."]},
sh_pouletcreme:{u:["Casserole","Grande poêle"],s:[
 "Coupe les pommes de terre en morceaux de 3 cm et cuis-les 12 min dans de l'eau salée. Garde une louche d'eau de cuisson, puis égoutte.",
 "Coupe le poulet en morceaux, assaisonne de sel, poivre et paprika.",
 "Dans la poêle sur feu moyen-vif avec l'huile, dore le poulet 5 min.",
 "Ajoute l'oignon en dés et l'ail haché, cuis 3 min.",
 "Ajoute les pommes de terre et laisse-les dorer 5 min en remuant.",
 "Coupe le feu, ajoute le fromage blanc et un peu d'eau de cuisson, mélange pour obtenir une sauce crémeuse."]},
ap_onepot:{u:["Grande cocotte","Casserole","4 boîtes de conservation"],s:[
 "Coupe l'oignon en dés.",
 "Dans la cocotte sur feu moyen-vif avec un filet d'huile, fais revenir l'oignon 3 min, puis le bœuf 5 min en l'émiettant.",
 "Ajoute les épices (paprika, piment, ail en poudre) et les tomates, laisse mijoter 5 min.",
 PATES,
 "Hors du feu, ajoute le fromage blanc dans la cocotte et mélange.",
 "Ajoute les pâtes égouttées, mélange, puis répartis dans les boîtes. Ferme quand c'est tiède et mets au frigo : 4 repas prêts."]},
ap_crispy:{u:["Mandoline","Plaque du four + papier cuisson","2 bols","Casserole"],s:[
 "Préchauffe le four 10 min avant (réglages dans « Réglage du four » en bas de la recette).",
 RIZ,
 "Coupe le poulet en bouchées. Sale, poivre.",
 "Mets la chapelure dans un bol et roule chaque bouchée dedans pour bien l'enrober. Pose-les sur la plaque.",
 "Enfourne 15-18 min, jusqu'à ce que ce soit doré.",
 "Tranche le concombre et l'oignon rouge à la mandoline. "+MANDO+" Coupe l'avocat en tranches.",
 "Dans un bol, mélange les bouchées chaudes avec la sauce chili.",
 "Assemble : riz, crudités, avocat, poulet. Parsème de sésame si tu en as."]},
ap_mealprep:{u:["Mandoline","Grande poêle ou wok","Casserole","Shaker électrique","Boîtes de conservation"],s:[
 RIZ,
 "Coupe le poulet en dés et mélange-le avec l'huile, le paprika et la moitié de la sauce soja. Laisse 10 min si tu as le temps.",
 "Émince le chou finement à la mandoline et coupe la carotte en julienne (fins bâtonnets) ou râpe-la. "+MANDO,
 "Mets le reste de la sauce soja, le lait de coco et le beurre de cacahuète dans le shaker électrique : 10 secondes, sauce lisse.",
 "Dans la poêle sur feu vif, dore le poulet 6-7 min. Verse la sauce et laisse épaissir 3 min.",
 "Retire le poulet. Dans la même poêle, fais sauter le chou et la carotte 5 min à feu vif : ils doivent rester un peu croquants.",
 "Répartis riz, légumes et poulet dans les boîtes : 3 jours au frigo."]},
ap_oats:{u:["Bocaux avec couvercle","Bol","Shaker électrique"],s:[
 "Dans un bol, mélange l'avoine et le lait (ajoute vanille ou cannelle si tu veux). Répartis au fond des bocaux.",
 "Mélange le skyr avec un peu de cacao (ou une dose de protéine chocolat au shaker) et étale-le par-dessus.",
 "Ajoute la banane en rondelles et le chocolat noir haché.",
 "Ferme et laisse une nuit au frigo. Prépare 3-4 bocaux d'un coup pour la semaine."]}
};
window.RECIPES.forEach(function(r){var d=window.STEPS[r.id];if(d){r.s=d.s;r.u=d.u}});
})();

// ---- Réglages précis : four (symbole + température + temps) et Cookeo Touch (mode manuel) ----
(function(){
// four : m = mode (tournante, trad), t = température chaleur tournante, tt = traditionnel, min = durée, g = gradin
var OV={
 saumonpd:{t:190,tt:200,min:"15 + 12",g:"milieu",note:"Patate douce 15 min, puis ajoute le saumon sur la plaque pour 12 min."},
 tofubowl:{t:190,tt:200,min:"25",g:"milieu",note:"Retourne les cubes de patate douce à mi-cuisson."},
 steakpdt:{t:200,tt:210,min:"30",g:"milieu",note:"Retourne les pommes de terre à mi-cuisson pour qu'elles dorent des deux côtés."},
 pouletsem:{t:190,tt:200,min:"25",g:"milieu",note:"Remue le poulet et les légumes à mi-cuisson."},
 sh_brochettes:{t:190,tt:200,min:"20",g:"milieu",note:"Les tronçons doivent être dorés sur les bords."},
 sh_galette:{t:200,tt:210,min:"25",g:"milieu-bas",note:"Plus bas dans le four = dessous plus croustillant."},
 ap_crispy:{t:190,tt:200,min:"15 à 18",g:"milieu",note:"Retourne les bouchées à mi-cuisson si tu peux."}
};
// Cookeo Touch, Mode manuel : [mode, intensité, minutes, couvercle, quoi]
var F="fermé et verrouillé",O="ouvert";
var RIZC=["Pression","Haute",8,F,"Riz rincé + 1,5 fois son volume d'eau + une pincée de sel"];
var CK={
 chili:[["Rissoler","Fort",5,O,"Oignon et poivron 2 min, puis le bœuf émietté"],["Pression","Haute",8,F,"Ajoute épices, tomates, haricots rouges et 100 ml d'eau"]],
 currypc:[["Rissoler","Moyen",3,O,"Oignon + curry"],["Pression","Haute",5,F,"Pois chiches, courgette, tomates, lait de coco et 50 ml d'eau"]],
 dahl:[["Rissoler","Moyen",3,O,"Oignon + curry et cumin"],["Pression","Haute",6,F,"Lentilles, carottes râpées, tomates, lait de coco et 300 ml d'eau"]],
 bololent:[["Rissoler","Moyen",4,O,"Oignon et carotte râpée"],["Pression","Haute",6,F,"Lentilles, tomates et 150 ml d'eau (pâtes à part)"]],
 risotto:[["Rissoler","Fort",5,O,"Poulet en dés, puis retire-le dans une assiette"],["Rissoler","Moyen",3,O,"Oignon, champignons et riz"],["Pression","Haute",6,F,"Ajoute l'eau chaude + bouillon (2,5 fois le volume du riz)"]],
 soupebut:[["Rissoler","Moyen",2,O,"Oignon"],["Pression","Haute",10,F,"Butternut, lentilles et eau juste à hauteur, puis mixe"]],
 cabipuree:[["Pression","Haute",8,F,"Pommes de terre en morceaux + 200 ml d'eau, puis écrase avec le lait"],["Vapeur","Douce",6,F,"Cabillaud dans le panier vapeur (après avoir vidé la cuve)"]],
 pouletsem:[["Rissoler","Fort",5,O,"Poulet et légumes"],["Pression","Basse",4,F,"Ajoute 50 ml d'eau (semoule à part)"]],
 ap_onepot:[["Rissoler","Fort",5,O,"Oignon puis bœuf émietté"],["Pression","Haute",5,F,"Épices, tomates, pâtes et eau juste à hauteur des pâtes"],["Réchauffer","",0,O,"Coupe, ajoute le fromage blanc et mélange"]],
 sh_pates:[["Rissoler","Fort",5,O,"Oignon puis bœuf émietté, ail et paprika"],["Pression","Haute",5,F,"Tomates, pâtes et eau juste à hauteur des pâtes"],["Réchauffer","",0,O,"Ajoute mascarpone et parmesan, mélange"]],
 sh_pouletcreme:[["Rissoler","Fort",5,O,"Poulet, oignon et ail"],["Pression","Haute",8,F,"Pommes de terre en morceaux + 100 ml d'eau, puis fromage blanc hors cuisson"]],
 ap_mealprep:[RIZC],
 teriyaki:[RIZC,["Vapeur","Boost",4,F,"Brocoli dans le panier vapeur"]],
 dinde:[["Rissoler","Fort",5,O,"Dinde, oignon et champignons"],["Pression","Haute",8,F,"Ajoute le riz rincé + 1,5 fois son volume d'eau"]],
 ap_crispy:[RIZC],
 poke:[RIZC],
 rizcrevette:[RIZC],
 porridge:[["Mijoter","Moyen",4,O,"Avoine + lait, remue une fois à mi-cuisson"]],
 rizmiel:[["Pression","Basse",6,F,"Riz + lait"],["Mijoter","Douce",2,O,"Ajoute le miel et remue"]]
};
window.RECIPES.forEach(function(r){r.ck=CK[r.id]||null;r.ov=OV[r.id]||null});
})();
