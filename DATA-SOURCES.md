# Données NASA exploitables pour le Crew Health Monitor

Source : catalogue `https://data.nasa.gov/dataset/` (36 518 jeux), interrogé le 14 novembre 2026 avec une soixantaine de recherches par mots-clés, une ou plusieurs par risque et par danger du brief.

Méthode et limites :

- Les colonnes « pourquoi » et « contexte » reprennent la description publiée par la NASA pour chaque jeu. Quand la fiche ne donne pas de raison, c'est indiqué par « (déduit) » : la raison est alors mon interprétation.
- Pour le mot « astronaut » (178 résultats), tous les résultats ont été parcourus ; pour les autres recherches, seuls les 12 premiers.
- Seuls deux jeux ont été ouverts et analysés : la dosimétrie ISS (année 2014) et le journal des sorties extravéhiculaires. Les autres sont décrits d'après leur fiche.
- Une recherche par mots-clés peut manquer des jeux mal décrits. « Rien trouvé » veut dire « rien trouvé avec ces mots », pas « n'existe pas ».

## 1. Verdict par risque et par danger

| Risque ou danger | Ce que le catalogue contient | Exploitable pour l'outil ? |
|---|---|---|
| Radiation spatiale | Dosimétrie ISS en continu (TEPC), dosimétrie Curiosity à la surface de Mars (RAD), dosimètres de petits satellites. Six autres fiches RAD (données brutes et calibrées) n'ont aucun fichier attaché ; je n'ai pas vérifié si elles couvrent le trajet Terre-Mars | **Oui, directement** (chiffres réels, voir §3) |
| Sorties extravéhiculaires (EVA) | Journal de 375 sorties américaines et russes, 1965-2013 | **Oui, directement** (voir §3) |
| Interactions hôte-microbes | Microbes des surfaces de l'ISS, de la capsule Dragon, de la peau, de la bouche et des selles d'équipages | Pour le protocole de collecte, pas pour des seuils |
| Système immunitaire | Salive d'astronautes (réactivation virale), expression de gènes dans le sang avant et après vol, répertoire d'anticorps IgM pendant un vol long, ARN du plasma | Pour justifier l'indicateur, pas pour des seuils |
| Isolement et confinement | Simulation MARS500 (520 jours, 6 personnes) : humeur, biochimie, microbiote | Pour le protocole, données brutes en séquençage |
| Forme physique, muscle | Études d'alitement de 21 jours et plus chez l'humain, avec ou sans exercice et protéines | Pour justifier l'indicateur |
| Hypoxie | Alitement en air appauvri (étude PlanHab, équivalent 4 000 m) | Pour le contexte de mesure |
| SANS (yeux) | Souris et rats : pression intraoculaire, pression intracrânienne, rétine | Indirect (animal) |
| Os | Rongeurs en vol : densité et microarchitecture osseuses | Indirect (animal) |
| Cardiovasculaire | Cœur de souris après 30 jours sur l'ISS, cellules en culture | Non |
| Alimentation | Cultures de salades sur l'ISS (masse récoltée, nutriments, sécurité microbienne) | Non : rien sur ce que mange l'équipage |
| Sensorimoteur | Un jeu sur l'escargot | Non |
| Gravité altérée | Rongeurs suspendus, cellules humaines en microgravité simulée | Non |
| Environnement clos (CO2, air, eau, bruit) | Rien sur l'air de cabine ; les résultats sont des mesures de l'atmosphère terrestre. Un seul jeu humain : expression de gènes dans les follicules de cheveux d'astronautes de l'ISS | Non |
| Maladie de décompression | Rien | Non |
| Distance de la Terre (kit médical, autonomie) | Rien | Non |
| Vigilance de l'équipage (hors brief) | 18 pilotes en simulateur : EEG, ECG, respiration, conductance de la peau | Hors sujet pour un suivi quotidien |

Les mesures cliniques des astronautes (tension, pouls, masse, vision, sommeil) ne sont pas sur ce portail. La fiche « NASA Life Sciences Portal (NLSP) » renvoie vers l'archive qui les contient, de Mercury (1961) à l'ISS : `https://nlsp.nasa.gov`.

## 2. Relevé : quoi, pourquoi, dans quel contexte, comment

| Jeu | Ce qui est mesuré | Pourquoi | Contexte | Comment c'est utilisé |
|---|---|---|---|---|
| ISS TEPC, Dose Analyzer | Débit de dose absorbée (µGy/min) et de dose équivalente (µSv/min), position de la station, source dominante (cosmique, ceintures, solaire), emplacement de l'instrument dans la station | « Gérer la dose reçue par l'équipage », parce que les débits en orbite sont quelques centaines de fois ceux du sol | Instrument placé dans le module de service et déplacé à l'occasion (un mois à un autre emplacement en 2014), une mesure par minute en continu | Par le groupe d'analyse des radiations du centre Johnson, pour suivre le risque en temps réel |
| MSL RAD Level 2 | Débit de dose, spectre d'énergie des particules, neutrons et rayons gamma, avec un indicateur de qualité par mesure | Caractériser le rayonnement à la surface de Mars (déduit) | Instrument du rover Curiosity | Versions « filtrée qualité » et « toutes données » publiées côte à côte |
| EVA US and Russia | Numéro, pays, équipage, véhicule, date, durée, objectif et incidents en texte libre | Tenir la chronologie des sorties (déduit ; la fiche ne donne qu'une définition) | Une ligne par sortie, de Gemini à l'ISS | Registre historique ; les problèmes de santé n'apparaissent que s'ils ont perturbé la sortie |
| ISS Microbial Observatory | Bactéries et champignons de 8 emplacements, par lingettes, 2 séances à 3 mois d'écart | Hypothèse : la population microbienne change dans le temps avec l'activité de l'équipage et dépend de l'endroit | Station vue comme un milieu bâti fermé | Séquençage au sol après retour des échantillons |
| SpaceX Inspiration4 | Prélèvements de 10 zones du corps, selles, 9 surfaces de la capsule | Suivre le microbiote de l'équipage et de la cabine (déduit) | 4 personnes, 3 jours ; prélèvements avant (J-92, J-44, J-3), pendant (jours 2 et 3) et après le vol | Séquençage au sol ; le plan de prélèvement permet de comparer chaque personne à elle-même |
| Salive d'astronautes | Microbiote salivaire | Chercher un changement lié au vol et une signature associée à la réactivation de virus | Astronautes en mission | Séquençage au sol |
| Gènes du sang, astronautes | 234 gènes de réponse au stress | Les astronautes deviennent plus sensibles aux infections | 6 astronautes, 10 jours avant le vol et 2-3 h après le retour | Comparaison avant/après par personne |
| MARS500 | Méthylation de l'ADN, état d'humeur, biochimie, microbiote intestinal | Comprendre l'adaptation à un isolement long | 6 membres d'équipage, 520 jours de simulation au sol, suivi prolongé après la sortie | Suivi longitudinal de chaque personne |
| Alitement (PlanHab et autres) | Biopsies musculaires, protéines du plasma | Comprendre la perte musculaire et tester des parades (exercice, protéines) | Volontaires alités 21 jours ou plus, parfois en air appauvri (14,1 % d'oxygène). Dans PlanHab, chaque sujet passe par toutes les conditions ; dans l'étude sur des femmes, trois groupes distincts sont comparés | Comparaison entre conditions, chez le même sujet ou entre groupes selon l'étude |
| Yeux de rongeurs | Pression intraoculaire (tonomètre), pression intracrânienne (télémétrie), IRM, tissus de la rétine | Expliquer les changements de vision observés chez les astronautes | Souris 35 jours sur l'ISS ; rats suspendus au sol | Recherche de mécanisme, pas de surveillance |
| Pilotes en simulateur | EEG 20 canaux, ECG, respiration, conductance de la peau, à 256 Hz | Entraîner des modèles à détecter trois états d'attention | 18 pilotes, exercices au sol puis vol complet en simulateur | Apprentissage automatique (concours Kaggle) |

## 3. Ce que montrent les deux jeux analysés

### Dosimétrie ISS, année 2014 (352 jours avec au moins 80 % de couverture)

| Grandeur | Valeur |
|---|---|
| Dose équivalente médiane, année entière | 0,69 mSv/jour |
| Emplacement habituel (323 jours) : médiane, et 5e au 95e centile | 0,68 mSv/jour ; 0,62 à 0,75 |
| Second emplacement (29 jours, du 1er au 29 mai) : médiane, et 5e au 95e centile | 0,83 mSv/jour ; 0,76 à 0,96 |
| Variation médiane d'un jour au suivant | 0,02 mSv |
| Dose absorbée médiane | 0,32 mGy/jour |
| Rapport équivalente / absorbée | 2,2 |
| Part des ceintures de radiation | 7 % du temps, 52 % de la dose |
| Part du rayonnement cosmique | 93 % du temps, 48 % de la dose |

Trois lectures :

1. **À emplacement fixe, la dose quotidienne est très stable** : l'écart-type vaut environ 6 % de la moyenne. Un jour qui s'écarte nettement du niveau habituel est donc un vrai signal.
2. **L'emplacement dans le vaisseau change la dose d'environ 20 %.** Les cinq jours les plus hauts de l'année tombent tous en mai, quand l'instrument était ailleurs dans le même module, à altitude de station inchangée. Sans l'emplacement enregistré avec chaque mesure, on aurait pris ce mois pour une hausse de radiation.
3. **Cette année ne dit rien sur les tempêtes solaires** : l'instrument n'a presque jamais classé le Soleil comme source dominante en 2014.

Ces chiffres valent pour l'orbite basse. Vers Mars, il n'y a ni ceintures ni protection du champ magnétique terrestre : le niveau de fond sera différent, mais la méthode (niveau habituel stable à emplacement constant, alerte sur l'écart) reste valable.

### Journal des sorties extravéhiculaires (375 sorties, 1965-2013)

- Durée médiane : 6 h ; 90 % des sorties durent moins de 7 h 21 ; maximum 8 h 56.
- La durée médiane est passée de moins d'une heure dans les années 1960 à 6 h 30 depuis 2000.
- Incidents touchant la personne, relevés à la lecture des textes :

| Type d'incident | Sorties concernées |
|---|---|
| CO2 dans le scaphandre (hausse, cartouche épuisée, capteur en panne) | 9 |
| Contamination à l'ammoniac ou décontamination du scaphandre | environ 6 |
| Buée, irritation des yeux, vision gênée | 6 |
| Gants endommagés ou coupés | 4 |
| Fatigue ou surchauffe | 2 |
| Eau dans le casque | 1 |

Lecture : les incidents consignés concernent l'air respiré, la vue et la chaleur plus que les mains et les épaules. Le journal ne mentionne ni maladie de décompression ni blessure musculaire : il enregistre ce qui a perturbé la sortie, pas l'état médical au retour.

## 4. Écarts de cohérence entre ces pratiques et l'outil

Les pistes 2 et 3 sont appliquées dans `index.html` ; les autres ne le sont pas.

1. **Référence personnelle prise avant le vol.** Les études sur équipages (Inspiration4, gènes du sang, MARS500) prennent des mesures avant le vol ou avant l'isolement pour servir de point de comparaison. L'outil accepte déjà des références d'avant vol, mais seulement via le fichier JSON ; sans elles, il se rabat sur les 3 à 7 premières mesures en vol, donc sur un corps déjà en train de s'adapter. Il manque un écran de saisie des références à la création du profil.
2. **Radiation : écart au niveau habituel, emplacement et cumul (appliqué, sauf l'emplacement).** L'outil comparait la dose du jour à des seuils fixes. Les données montrent un niveau de fond très stable à emplacement constant ; une alerte sur l'écart au niveau habituel des 7 derniers jours serait plus juste, à condition de comparer des mesures prises au même endroit. La NASA dit mesurer pour « gérer la dose » : il manque le cumul depuis le départ.
3. **EVA : un événement, pas une question quotidienne (appliqué).** La NASA consigne une ligne par sortie avec sa durée. L'outil posait chaque jour une question sur les mains et les épaules. Il serait plus cohérent de demander « sortie aujourd'hui ? », puis la durée et les symptômes que le journal fait ressortir : maux de tête (CO2), vue, surchauffe, mains.
4. **Mesure contre prélèvement.** Microbes et immunité sont suivis par des prélèvements analysés au sol, à dates fixes. Rien n'est interprétable à bord. L'outil peut garder ses questions sur les symptômes, mais ne doit pas laisser croire qu'il mesure le microbiote ; un simple rappel « prélèvement fait » serait le pendant cohérent.
5. **Contexte de chaque mesure.** Les jeux d'instruments enregistrent où et comment la mesure a été prise (emplacement du dosimètre, indicateur de qualité). L'outil ne stocke qu'un nombre par jour. Le mois de mai 2014 montre le coût de cette absence : 20 % d'écart dû au seul emplacement. La même logique vaut pour le CO2 de cabine, relevé « dans cette pièce » sans que la pièce soit notée.
6. **Oxygène de la cabine.** L'étude PlanHab décrit l'hypoxie par l'air respiré (fraction et pression partielle d'oxygène). L'outil suit l'oxygène du sang et le CO2 de la cabine, pas l'oxygène de la cabine.
7. **Indicateurs sans appui dans ce catalogue.** Maladie de décompression, équilibre, kit médical, sommeil, tension, pouls et CO2 de cabine : leurs seuils restent des valeurs d'illustration, à étayer avec l'archive NLSP ou la littérature.
