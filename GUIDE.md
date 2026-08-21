# RNRD — Guide du site

## 1. Structure des dossiers

```
RNRD/
├── GUIDE.md                    ce fichier
├── CNAME                       domaine personnalisé (GitHub Pages)
├── robots.txt                  autorisation d'indexation
├── sitemap.xml                 plan du site (à tenir à jour)
│
├── outils/                     scripts de contrôle — NON PUBLIÉS
│   ├── verifier.py             contrôle avant publication
│   └── nettoyer_images.py      suppression des métadonnées
│
├── index.html                  page d'accueil (rnrd.space)
├── projet.html                 intention, vie privée, mentions légales
├── histoire.html               genèse du projet
│
├── carnet/
│   └── index.html              notes courtes — tout tient dans cette page
│
├── retex/                      MODE TERRAIN
│   ├── index.html              liste des tests
│   └── articles/
│       ├── modele.html         gabarit privé (noindex) — à dupliquer
│       ├── photos/             (à créer) photos des tests
│       └── videos/             (à créer) vidéos des tests
│
├── terrain/                    MODE TERRAIN
│   └── index.html              fiches pratiques — tout tient dans cette page
│
├── vision/                     EN SOMMEIL — planches photographiques
│   ├── index.html
│   └── photos/
│
├── necessaire/                 EN SOMMEIL — inventaire
│   └── index.html
│
└── assets/
    ├── rnrd.css                apparence de tout le site
    ├── rnrd.js                 comportements de tout le site
    ├── rnrd-terrain.css        bascule de palette (Retex + Terrain)
    ├── img/
    │   ├── partage.png         aperçu affiché au partage d'un lien
    │   └── camo.jpg            trame du mode terrain
    └── fonts/                  sept fichiers .woff2
```

Deux fichiers seulement contiennent du code partagé : `rnrd.css` pour
l'apparence, `rnrd.js` pour les comportements. Une modification faite
là s'applique à tout le site, y compris aux articles déjà publiés.

**Un article ne contient jamais de script.** Il n'a que du contenu.
La galerie, la jauge de lecture et les transitions se branchent seules.

---

## 2. Publier un article : la marche à suivre

**Étape 1 — créer le fichier**
Dupliquer `retex/articles/modele.html` et le renommer sans accent ni
espace, en minuscules, avec des tirets :
`civivi-elementum-2.html`, `sac-30-litres.html`, `lampe-frontale-nitecore.html`

**Étape 2 — remplir le contenu**
Le modèle est découpé en six sections numérotées par des commentaires
(`══ 1. EN-TÊTE ══`, etc.). Suivre l'ordre, remplacer les textes.

**Étape 3 — déposer les photos**
Les mettre dans `retex/articles/photos/`, puis y renvoyer depuis
l'article : `src="photos/nom-de-la-photo.jpg"`

**Étape 4 — déclarer l'article dans la liste**
Ouvrir `retex/index.html`, y ajouter une entrée dans le tableau
`ARTICLES`. C'est la seule étape à ne pas oublier : sans elle,
l'article existe mais n'apparaît nulle part.

```js
{
  slug:    "articles/sac-30-litres.html",
  title:   "Sac 30 litres — un an sur le dos",
  date:    "2026-09-02",
  excerpt: "Une phrase de résumé, deux lignes maximum.",
  cover:   "articles/photos/sac-vignette.jpg",
  tag:     "Sacs · Portage"
},
```

L'ordre des entrées dans le tableau n'a aucune importance : le tri se
fait par `date`, du plus récent au plus ancien. Les numéros affichés
(01, 02, 03…) correspondent au rang réel de publication.

---

## 3. Les blocs disponibles dans un article

Tous sont facultatifs. Aucun n'est obligatoire sauf le titre.
Ils peuvent être répétés et remis dans l'ordre souhaité.

### Titre et chapô

```html
<p class="eyebrow">Catégorie · Sous-catégorie</p>
<h1>Titre principal<br>sur deux lignes</h1>
<p class="article-deck">Une ou deux phrases d'accroche.</p>
```

Le `<br>` dans le titre est un choix de mise en page : il coupe la
ligne là où c'est lisible. À ajuster ou retirer selon le titre.

### Contexte du test

Trois ou quatre entrées maximum. Au-delà, ça relève de la fiche
technique.

```html
<div class="meta-row">
  <span>Testé depuis <b>6 mois</b></span>
  <span>Contexte <b>Rando, bivouac</b></span>
  <span>Publié le <b>14 juillet 2026</b></span>
</div>
```

### Photo de couverture

Format libre, jamais recadrée. Une hauteur maximale évite qu'une photo
verticale occupe tout l'écran.

```html
<div class="article-cover">
  <img src="photos/couverture.jpg" alt="Description de la photo">
</div>
```

### Fiche technique

Deux colonnes sur ordinateur, une seule sur téléphone. **Plusieurs
blocs sont possibles** : c'est ce qui rend le format utilisable pour
n'importe quel objet.

```html
<div class="specs">
  <p class="specs-title">Caractéristiques</p>
  <dl class="specs-grid">
    <div class="spec-row"><dt>Poids</dt><dd>77,4 g</dd></div>
    <div class="spec-row"><dt>Matériau</dt><dd>Aluminium</dd></div>
  </dl>

  <p class="specs-title">Entretien</p>
  <dl class="specs-grid">
    <div class="spec-row"><dt>Lavage</dt><dd>30 °C, sans adoucissant</dd></div>
  </dl>
</div>
```

Exemples de blocs selon l'objet :
- **Couteau** — Caractéristiques / Entretien
- **Veste** — Matériaux / Coupe et tailles / Imperméabilité / Entretien
- **Duvet** — Isolation / Encombrement / Confort thermique
- **Lampe** — Éclairage / Autonomie / Résistance / Alimentation
- **Sac** — Volumes / Portage / Matériaux / Accès et rangements

### Titre de section

Le numéro est facultatif, mais utile quand l'article suit une
progression réelle.

```html
<h2><span class="h2-index">01</span>Titre de la section</h2>
```

### Photo seule

```html
<figure>
  <img src="photos/detail.jpg" alt="Description">
  <figcaption>Légende, une ou deux lignes.</figcaption>
</figure>
```

### Galerie (carrousel)

Une photo visible à la fois, glissement au doigt, flèches, points et
navigation au clavier. **Ajouter ou retirer des `carousel-slide`
suffit** : le compteur et les points s'ajustent tout seuls.

```html
<div class="carousel" data-carousel>
  <div class="carousel-head">
    <span class="carousel-head-label">Galerie</span>
    <span class="carousel-counter">
      <span data-carousel-current>01</span><span class="total"> / <span data-carousel-total>00</span></span>
    </span>
  </div>

  <div class="carousel-track" tabindex="0" aria-label="Galerie de photos, utilisez les flèches du clavier">

    <div class="carousel-slide" data-caption="Légende de la première photo.">
      <img src="photos/1.jpg" alt="Description">
    </div>
    <div class="carousel-slide" data-caption="Légende de la deuxième photo.">
      <img src="photos/2.jpg" alt="Description">
    </div>

  </div>

  <div class="carousel-foot">
    <p class="carousel-caption" data-carousel-caption></p>
    <div class="carousel-nav">
      <button class="carousel-btn" type="button" data-carousel-prev aria-label="Photo précédente">‹</button>
      <div class="carousel-dots" data-carousel-dots></div>
      <button class="carousel-btn" type="button" data-carousel-next aria-label="Photo suivante">›</button>
    </div>
  </div>
</div>
```

Laisser `data-carousel-total` à `00` : la valeur est calculée seule.
Plusieurs galeries dans un même article sont possibles.

### Vidéo

Même cadre que la galerie, largeur de l'article respectée. Deux
variantes selon l'hébergement.

**A — fichier hébergé avec le site** (recommandé : pas de traceur
extérieur, cohérent avec un site sobre)

```html
<div class="video">
  <div class="video-head">
    <span class="video-head-label">Vidéo</span>
    <span class="video-duration">0:42</span>
  </div>
  <div class="video-frame">
    <video controls preload="metadata" poster="photos/apercu.jpg">
      <source src="videos/nom-du-fichier.mp4" type="video/mp4">
      Votre navigateur ne peut pas lire cette vidéo.
    </video>
  </div>
  <div class="video-foot">
    <p class="video-caption">Légende de la vidéo.</p>
  </div>
</div>
```

Déposer les fichiers dans `retex/articles/videos/`.
`preload="metadata"` ne charge que la durée au chargement de la page,
pas la vidéo entière : indispensable pour ne pas plomber le temps
d'affichage. `poster` affiche une image fixe avant lecture.

**B — plateforme externe**

```html
<div class="video-frame">
  <iframe src="https://www.youtube-nocookie.com/embed/IDENTIFIANT"
          title="Description de la vidéo"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
</div>
```

Le reste du bloc (`video-head`, `video-foot`) est identique.
Le domaine `youtube-nocookie.com` limite le pistage.

**Vidéo verticale** (filmée au téléphone) : ajouter `portrait`.

```html
<div class="video-frame portrait">
```

**Autre proportion** : remplacer le ratio directement.

```html
<div class="video-frame" style="aspect-ratio: 4 / 3;">
```

Sur le poids des fichiers : une vidéo de plus de 30 à 40 Mo sur un
hébergement statique gratuit devient pénalisante. Au-delà d'une
minute, la variante B est plus raisonnable.

### Note en marge

Pour une précision technique, une mise en garde, ou une mise à jour
postérieure à la publication.

```html
<div class="note">
  <p class="note-label">Mise à jour</p>
  <p>Le texte de la note.</p>
</div>
```

### Citation détachée

Une seule par article — c'est ce qui lui donne son poids.

```html
<blockquote class="pull-quote">
  La phrase qui résume le test.
</blockquote>
```

### Appréciations

Un critère par ligne, cinq barres. Mettre `filled` sur les barres
remplies, en partant de la gauche.

```html
<div class="ratings">
  <div class="rating">
    <p class="rating-label">Nom du critère</p>
    <div class="rating-scale">
      <span class="rating-tick filled"></span>
      <span class="rating-tick filled"></span>
      <span class="rating-tick filled"></span>
      <span class="rating-tick"></span>
      <span class="rating-tick"></span>
    </div>
    <span class="rating-value">3 / 5</span>
  </div>
</div>
```

Choisir des critères propres à l'objet plutôt que des critères
génériques : « Prise en main humide » dit quelque chose,
« Qualité générale » ne dit rien.

### Verdict

Toujours en fin d'article.

```html
<div class="verdict">
  <div class="verdict-label">En résumé</div>
  <p>Le bilan, deux à quatre phrases.</p>
  <p>Pour qui c'est adapté, pour qui ça ne l'est pas.</p>
</div>
```

---

## 4. Le carnet

Le carnet est volontairement plus rudimentaire que Retex : **une seule
page contient toutes les notes**. Pas de fichier par entrée, pas de
tableau à tenir à jour, pas de tri automatique.

Publier une note prend dix secondes : ouvrir `carnet/index.html`,
copier un bloc `journal-entry`, le coller **en haut de la liste**, et
écrire. L'ordre affiché est celui du fichier.

Le carnet est volontairement large dans ce qu'il accueille : une
sortie, un objet essayé quelques jours, un conseil qui tient en trois
lignes, une réflexion personnelle. Les catégories (`journal-tag`)
servent à s'y retrouver — par exemple : Sortie, Matériel, Tri,
Réflexion, Conseil, Lecture. La liste est libre, à faire évoluer
selon ce que tu écris réellement.

```html
<div class="journal-entry">
  <div class="journal-date">
    <span class="journal-day">31</span>
    <span class="journal-month">Juil 26</span>
  </div>
  <div class="journal-body">
    <p class="journal-tag">Catégorie</p>
    <p>Le texte de la note, deux à cinq phrases.</p>
  </div>
</div>
```

**Donner un identifiant à chaque note** permet de la citer
directement. La date devient alors un lien permanent :

```html
<div class="journal-entry" id="n-2026-09-02">
  <a class="journal-date" href="#n-2026-09-02" aria-label="Lien vers cette note">
    <span class="journal-day">02</span>
    <span class="journal-month">Sept 26</span>
  </a>
  ...
```

Convention retenue : `n-` suivi de la date au format `AAAA-MM-JJ`.
L'adresse `rnrd.space/carnet/#n-2026-09-02` mène alors droit à la note.

Trois éléments facultatifs dans une entrée :

**Une photo**
```html
<figure class="journal-figure">
  <img src="photos/nom.jpg" alt="Description">
  <figcaption>Légende courte.</figcaption>
</figure>
```

**Un renvoi vers un article Retex**
```html
<a class="journal-link" href="../retex/articles/nom.html">
  Lire le test <span class="chev">›</span>
</a>
```

**La catégorie** (`journal-tag`) : à supprimer si la note n'en a pas.

Quand la page devient longue (au-delà d'une centaine de notes), il
suffira de la scinder par année : `carnet/2026.html`, `carnet/2027.html`.
Rien à refaire d'ici là.

---

## 5. Ouvrir une section en sommeil

Deux sections sont déjà construites mais dormantes : **Vision**
(planches photographiques) et **Nécessaire** (inventaire). Les pages
existent, sont conformes à la direction artistique, mais ne sont ni
liées depuis l'accueil, ni visibles des moteurs de recherche.

Les ouvrir demande **trois modifications**, dans cet ordre :

**1. Retirer la balise d'exclusion** dans l'en-tête de la page
(`vision/index.html` ou `necessaire/index.html`) :

```html
<meta name="robots" content="noindex, nofollow">
```

**2. Rendre le module actif** dans `index.html` — remplacer le bloc
`module pending` par un lien :

```html
<a class="module active" href="vision/index.html">
  <div class="module-left">
    <span class="status-dot"></span>
    <div>
      <div class="module-name">Vision</div>
      <div class="module-desc">Photographie — le dehors tel que je le vois.</div>
    </div>
  </div>
  <span class="module-tag">Actif <span class="chev">›</span></span>
</a>
```

Le numéro d'ordre se recalcule seul : il n'y a rien à renuméroter,
et les sections peuvent être remises dans n'importe quel ordre.

**3. Décommenter l'entrée** correspondante dans `sitemap.xml`, et
mettre `lastmod` à la date réelle de mise en ligne.

Ne pas ouvrir une section avant qu'elle ait de quoi être remplie :
une page vide indexée vaut moins qu'une page absente.

### Vision — ajouter une planche

Copier un bloc `.plate` et le placer **en haut** de la liste. Photos
dans `vision/photos/`. Format libre, jamais recadrée.

```html
<figure class="plate">
  <div class="plate-frame">
    <img src="photos/nom.jpg" alt="Description" loading="lazy">
  </div>
  <figcaption class="plate-caption">
    <p class="plate-title">Une phrase, si elle ajoute quelque chose.</p>
    <span class="plate-meta">Lieu · 14.07.26</span>
  </figcaption>
</figure>
```

### Nécessaire — ajouter un objet

```html
<div class="spec-row" data-poids="340">
  <dt>Nom de l'objet
    <span class="spec-note">Précision facultative.</span>
  </dt>
  <dd>340 g</dd>
</div>
```

`data-poids` se déclare **toujours en grammes, sans unité** : c'est
lui qui alimente les trois totaux en haut de page (nombre d'objets,
masse totale, nombre de catégories). Ces totaux se recalculent seuls.

Pour créer une catégorie : un `<p class="specs-title">` suivi d'un
`<dl class="specs-grid">`.

---

## 6. La section Terrain

Comme le carnet, **toutes les fiches vivent dans une seule page**.
Chacune est un `<article class="body" id="ter-XX">` placé à la suite
des autres, et la liste du haut sert d'index par ancres.

Publier une fiche demande deux gestes : écrire l'article, puis
transformer son entrée de la liste en lien.

**1. Écrire la fiche**, à la fin de la page, avant le pied de page :

```html
<article class="body" id="ter-10">
  <p class="eyebrow" style="margin-bottom:14px;">TER-10</p>
  <h2 style="font-size:26px; margin:0 0 24px;">Titre de la fiche</h2>

  <p>Un paragraphe de cadrage : ce que la fiche traite, dans quel
     contexte, et ce qu'elle ne traite pas.</p>

  <div class="procedure">
    <div class="etape">
      <div>
        <p class="etape-titre">Titre de l'étape</p>
        <p>Le texte de l'étape.</p>
      </div>
    </div>
    <!-- autant d'étapes que nécessaire, numérotées automatiquement -->
  </div>

  <div class="warn">
    <p class="warn-label">Points de prudence</p>
    <p>Les limites, les erreurs classiques, ce qui peut mal tourner.</p>
  </div>

  <div class="specs">
    <p class="specs-title">Nécessaire</p>
    <dl class="specs-grid">
      <div class="spec-row"><dt>Objet</dt><dd>Précision</dd></div>
    </dl>
  </div>
</article>
```

Les étapes se numérotent seules : ajouter, retirer ou déplacer un
bloc `.etape` ne demande aucune correction.

**2. Ajouter l'entrée dans la liste**, en haut de page :

```html
<a class="fiche" href="#ter-10">
  <span class="fiche-code">TER-10</span>
  <span>
    <span class="fiche-name">Titre de la fiche</span>
    <span class="fiche-desc">Une ligne de résumé.</span>
  </span>
  <span class="fiche-state">Rédigée</span>
</a>
```

Une fiche annoncée mais pas encore écrite s'écrit en
`<div class="fiche pending">` avec l'état « À venir », et sans lien.

**Les fiches sont groupées** par étape de progression — s'orienter,
progresser, tenir, alerter — au moyen d'un intertitre :

```html
<p class="fiches-group">S'orienter</p>
```

L'ordre suit une logique d'apprentissage : lire une carte avant de
naviguer dessus, se préparer avant de partir, alerter en dernier.
Les codes `TER-XX` suivent cet ordre d'affichage, pas l'ordre de
rédaction. **Renuméroter modifie les ancres** (`#ter-04`) : à éviter
une fois que des liens extérieurs peuvent pointer vers une fiche.

Le compteur du titre de section et le sommaire flottant se mettent à
jour tout seuls.

### Exigences de contenu

Cette section transmet des informations qui peuvent engager la
sécurité de quelqu'un. Trois règles, à ne pas assouplir :

- **Vérifiable.** Les chiffres et les procédures viennent de sources
  identifiables (agences sanitaires, organismes de secours,
  fédérations), pas d'un souvenir de lecture.
- **Avec ses limites.** Chaque fiche dit ce que la méthode ne fait
  pas, et dans quelles conditions elle échoue. Une technique
  présentée sans ses limites est un piège.
- **Universelle.** Ce qui dépend d'un pays ou d'une réglementation
  est signalé comme tel, avec l'indication de se renseigner
  localement.

Une fiche qui ne peut pas satisfaire ces trois points ne se publie
pas : elle reste en « À venir ».

---

## 7. La section Prévoyance

Même structure que Terrain : toutes les fiches dans une seule page,
codes `PRV-XX`, groupes par étape, mode terrain. Se reporter à la
section 6 pour la marche à suivre, elle est identique.

### Exigences propres à cette section

Le contenu touche à la sécurité des personnes et cite des dispositifs
administratifs qui évoluent. Trois règles s'ajoutent à celles de
Terrain :

- **S'appuyer sur les sources publiques françaises** — Géorisques,
  guide gouvernemental *Tous responsables*, sécurité civile — et non
  sur des contenus de préparation individuelle non sourcés.
- **Ne jamais encourager l'initiative isolée sur un lieu de crise.**
  L'aide utile est celle qui a été demandée par la commune, la
  préfecture ou une association agréée.
- **Dater ce qui peut changer.** Les dispositifs d'alerte, les
  obligations d'équipement et les recommandations chiffrées évoluent :
  vérifier les chiffres cités une fois par an, et corriger plutôt que
  laisser vieillir.

### Référencement de cette section

C'est la page du site la plus susceptible d'être trouvée par
recherche, parce qu'elle répond à des questions que les gens posent
réellement. Quatre points la portent :

- **Le titre de la balise** contient les termes cherchés et tient
  sous 60 caractères, au-delà desquels il est tronqué dans les
  résultats.
- **La description** fait 155 caractères et cite les expressions
  courantes — kit d'urgence 72h, risques de sa commune.
- **Les données structurées** décrivent la page comme une liste
  ordonnée de fiches, chacune avec son ancre.
- **Les liens croisés** avec Terrain : chaque section renvoie vers
  l'autre depuis son encadré d'introduction. C'est ce qui répartit
  l'autorité entre les pages, et il faut le refaire à chaque nouvelle
  section.

Le reste tient au contenu : des intertitres qui posent une question
réelle, des sources publiques citées, et pas de bourrage de mots-clés.

### Ce qui reste hors sujet

Cette section ne traite ni d'armement, ni de scénarios
d'effondrement, ni de retrait hors de la société. Le cadrage annoncé
dans l'encadré d'introduction — l'intelligence de la préservation
plutôt que la posture — engage tout le contenu qui suit.

---

## 8. Les photos

- **Format libre** partout sauf les vignettes de la liste d'articles,
  qui sont recadrées en 4:3 pour garder un rythme régulier.
- **Poids** : redimensionner à 1600 px de large maximum et enregistrer
  en JPEG qualité 80 environ. Une photo de 6 Mo sortie du téléphone
  ralentit la page sans rien apporter à l'écran.
- **Nommage** : minuscules, sans accent, avec des tirets.
- **Texte alternatif** (`alt`) : décrire ce que montre la photo. C'est
  ce que lisent les moteurs de recherche et les lecteurs d'écran.
  Le laisser vide (`alt=""`) uniquement pour une photo purement
  décorative.

---

## 9. Ce qui fonctionne tout seul

Rien de tout cela n'est à déclarer dans une page. Chaque comportement
se déclenche en détectant ce qu'il trouve.

| Comportement | Déclencheur |
|---|---|
| Repère de coupe | posé par le script, toutes les pages |
| Jauge de lecture | posée par le script, toutes les pages |
| Trame de camouflage | posée par le script si la feuille terrain est chargée |
| Annotations d'angle | attribut `data-code` sur `<body>` |
| Frappe du sur-titre | présence d'un `.eyebrow` |
| Apparition au chargement | classe `reveal` sur un bloc |
| Transition entre pages | tous les liens internes |
| Fondu des images | toute image d'article, de planche ou de galerie |
| Galerie | présence d'un bloc `data-carousel` |
| Sommaire flottant | trois articles identifiés, ou trois `h2` |
| Retour en haut | page dépassant deux hauteurs d'écran |
| Année du pied de page | attribut `data-year` |
| Liste d'articles, tri, numérotation | tableau `ARTICLES` |
| Codes de série (RTX-01…) | attribut `data-code-prefix` sur la liste |
| Nombre d'articles | attribut `data-article-count` |
| Nombre de modules, par groupe | attribut `data-count-modules="1"`, `"2"`… |
| Numérotation des modules | position dans son groupe |
| Nombre de notes | attribut `data-count-entries` |
| Nombre de planches | attribut `data-count-plates` |
| Nombre de fiches Terrain | attribut `data-count-fiches` |
| Numérotation des étapes | position dans `.procedure` |
| Totaux d'inventaire | attributs `data-poids` sur les lignes |
| État de la station Signal | attribut `data-station` sur le module |
| Mise en page à l'impression | automatique (Ctrl+P) |
| Défilement doux vers une ancre | lien commençant par `#` |
| Flèche sur les liens externes | adresse commençant par `http` |

### Répertoire des blocs

Où trouver la documentation de chaque composant.

| Bloc | Emploi | Section |
|---|---|---|
| `.specs` / `.spec-row` | fiche technique, inventaire | 3, 6 |
| `.carousel` | galerie de photos | 3 |
| `.video` | vidéo hébergée ou externe | 3 |
| `.note` | précision, mise à jour | 3 |
| `.pull-quote` | citation détachée | 3 |
| `.ratings` | échelle d'appréciation | 3 |
| `.verdict` | bilan de fin d'article | 3 |
| `.journal-entry` | note du carnet | 4 |
| `.plate` | planche photographique | 5 |
| `.inv-summary` | totaux d'inventaire | 5 |
| `.fiche` | entrée de la liste Terrain | 6 |
| `.procedure` / `.etape` | suite d'opérations numérotées | 6 |
| `.warn` | avertissement, limites | 6 |
| `.brief` | encadré d'introduction | 6 |
| `.empty-state` | section créée mais vide | automatique |
| `.toc` | sommaire flottant | automatique |
| `.to-top` | retour en haut | automatique |
| `.camo-field` | trame du mode terrain | automatique |
| `.redacted` | donnée personnelle non publiée | automatique |
| `.section-qualifier` | précision derrière « Sections » | 9 |
| `.footer-links` | liens du pied de page | 9 |
| `.module` | section sur la page d'accueil | 9 |

---

## 10. Vocabulaire graphique

Quatre éléments structurent l'apparence du site. Les connaître évite
d'en inventer d'autres qui feraient doublon.

**Repères de coupe** — quatre équerres fines aux angles de la fenêtre,
comme sur un plan technique. Fixes, indépendantes du contenu.

**Annotations d'angle** — micro-texte en petites capitales très
espacées, posé sous les repères : `RNRD.SPACE` à gauche,
`SECTION // ANNÉE` à droite. Le code de section se déclare une seule
fois par page :

```html
<body data-code="CARNET">
```

Volontairement au seuil de la lisibilité : c'est une indication de
bord, pas une information à lire. Masqué sous 900 px et à l'impression.

**Sommaire** — deux niveaux partout : le repère au-dessus, le titre en
dessous. Le repère est le code de série pour un article codé
(`TER-01`, `PRV-01`), le numéro de section pour une subdivision de
document (`01`, `02`). Cette distinction est délibérée et constitue la
règle de nommage du site : **un préfixe désigne un document citable
séparément, un numéro nu une partie d'un document**. Donner un préfixe
aux sections de « Le projet » leur prêterait un statut qu'elles n'ont
pas, et répéterait une information que le titre de la page porte déjà.

**Numérotation** — tout ce qui forme une série est numéroté sur deux
chiffres : les sections de la page d'accueil (`01`–`04`), les articles
de la liste Retex, les titres de section d'un article, les photos d'une
galerie. Les compteurs se calculent seuls.

**Barre oblique double** (`//`) — sépare une étiquette de son compteur.
Réservée à cet usage : elle perd son sens si elle sert d'ornement.

### Ce que la page n'a plus à déclarer

Trois éléments décoratifs sont désormais posés par le script à partir
de ce que la page déclare déjà : le **repère de coupe**, la **jauge de
lecture** et, sur les pages en mode terrain, le **calque de trame**.

Ils ne portent aucun contenu, et les recopier dans chaque page
revenait à en oublier un tôt ou tard. Une page nouvelle n'a donc
besoin que de son en-tête, de son contenu et de son pied de page.

L'injection ne duplique rien : si l'un de ces éléments figure encore
dans une ancienne page, il est laissé tel quel.

Contrepartie assumée : sans JavaScript, ces trois éléments
n'apparaissent pas. La page reste entièrement lisible et navigable.

### Ce qui vaut pour toutes les pages

Ces comportements sont automatiques et identiques partout. Aucun n'est
à déclarer, sauf mention contraire :

| Élément | Portée |
|---|---|
| Repères de coupe aux angles | toutes les pages |
| Annotations d'angle | toutes les pages (`data-code` sur `<body>`) |
| Repère de coupe | posé par le script |
| Jauge de lecture | posée par le script |
| Trame de camouflage | posée par le script en mode terrain |
| Frappe du sur-titre | toutes les pages, automatique |
| Apparition au chargement | toutes les pages (classe `reveal`) |
| Transition entre pages | toutes les pages, automatique |
| Ligne d'horizon en bas | toutes les pages |

**Deux groupes de sections** sur la page d'accueil : « Personnel »
(ce qui ne regarde que soi) et « Ressources » (ce qui peut servir à
quelqu'un d'autre). Chaque groupe est un `<div class="modules">` avec
son étiquette portant `data-count-modules="1"` ou `"2"`. La
numérotation et le compteur se calculent par groupe : déplacer une
section d'un groupe à l'autre, ou créer un troisième groupe, ne
demande aucune correction manuelle.

**Une seule largeur de colonne** pour toutes les pages : 760 px. Ne
pas la surcharger page par page — le cadre de lecture doit rester
identique d'une page à l'autre. La longueur de ligne du texte est
limitée séparément, en caractères, bloc par bloc.

**La classe `reveal`** se pose sur les blocs de premier niveau, dans
l'ordre de lecture : fil d'Ariane, sur-titre, titre, chapô, bandeau de
contexte, couverture, corps, pied de page. Le décalage entre chaque
bloc est calculé automatiquement selon sa position, jusqu'au douzième.
Au-delà, un bloc apparaîtrait sans décalage, donc avant ceux qui le
précèdent : ajouter alors les lignes `nth-child` manquantes dans
`rnrd.css`.

### Les trois états d'un module

| État | Témoin | Étiquette |
|---|---|---|
| Actif | point d'accent, halo continu | Actif › |
| En sommeil | point creux, gris | À venir |
| Intermittent | dépend de la réponse du serveur | En ligne / Hors ligne |

Le **halo** garde partout le même sens : une activité constatée. Il
n'apparaît jamais sur une section dormante, ni sur une station qui ne
répond pas.

La section **Signal** (`signal.rnrd.space`) pointe vers un serveur
distinct — un récepteur radio OpenWebRX+. Son état ne peut pas être
supposé : au chargement de la page, le script demande une image
minuscule au serveur. S'il répond, la station est en ligne ; sinon,
elle est arrêtée. L'adresse interrogée se déclare une seule fois :

```html
<a class="module intermittent" href="https://signal.rnrd.space"
   target="_blank" rel="noopener" data-station="https://signal.rnrd.space">
```

Sans JavaScript, l'étiquette conserve la mention écrite dans le HTML,
« Intermittent », qui reste vraie en toutes circonstances.

**Limite assumée** : le test constate que le serveur répond, pas que
le récepteur radio fonctionne. Comme la station est coupée en
éteignant le serveur, les deux coïncident aujourd'hui — mais si un
jour le serveur tournait sans le récepteur, le témoin annoncerait
« en ligne » à tort.

**Signal ne figure pas dans `sitemap.xml`** : un plan de site ne peut
lister que des adresses du même hôte, et un récepteur SDR n'a pas
vocation à être indexé.

### Le mode terrain

**Retex, Terrain et Prévoyance partagent le mode terrain.** Les deux réunissent
du contenu de référence — fiches techniques, mesures, procédures —
et se lisent souvent dehors ou en préparation de sortie. Le reste du
site (accueil, Carnet, Vision, Nécessaire, Projet, Histoire) conserve
la palette claire.

Deux éléments suffisent sur une page en mode terrain :

```html
<meta name="theme-color" content="#0e0f0d">
<meta name="color-scheme" content="dark">
...
<link rel="stylesheet" href="../assets/rnrd.css">
<link rel="stylesheet" href="../assets/rnrd-terrain.css">
```

La trame de camouflage est posée automatiquement dès que le script
détecte la feuille du mode terrain : il n'y a rien à ajouter dans le
corps de la page.

**L'icône du site** suit le mode de la page : accent bleu et anneau
clair en mode normal, accent ambre et anneau sourd en mode terrain.
Elle est déclarée dans l'en-tête, il faut donc penser à reprendre
celle d'une page du même mode en créant une nouvelle page.

**Le bloc expurgé** remplace une donnée personnelle. Le nom n'est pas
masqué : il n'existe nulle part, ni dans le HTML, ni dans le script.
Les caractères affichés sont tirés au sort à l'exécution.

Le comportement enchaîne trois phases sans fin, définies dans
`rnrd.js` : **brouillage** (repos, illisible), **sonde** (quelque
chose cherche à lire, la donnée commence à se former), **riposte**
(le système disloque ce qui s'était formé). Les durées se règlent
dans l'objet `PHASES`.

Le bloc ne porte ni bordure, ni rembourrage, ni débordement masqué :
un élément en ligne dont le débordement est coupé voit sa ligne de
base calée sur le bas de sa boîte, ce qui décale tout le texte
environnant.

```html
<span class="redacted" data-length="9" role="img"
  aria-label="Nom volontairement non publié">#4?m%7@q</span>
```

Les caractères écrits dans le HTML ne servent que si le script ne
s'exécute pas — **ils ne doivent contenir aucune initiale réelle**,
le contrôle le vérifie. `data-length` fixe la largeur du bloc, qui ne
varie jamais pour ne pas faire bouger la ligne de texte, et n'a pas à
correspondre à la longueur de la donnée d'origine.

Le nom n'apparaît nulle part sur le site : ni dans les textes, ni dans
les descriptions, ni dans les données structurées — qui portent
« RNRD » comme nom d'auteur. **Vérifier ce point avant chaque
publication**, notamment dans les blocs JSON-LD recopiés d'une page à
l'autre.

**Le code de série** figure dans le sur-titre : `TER-01` pour une
fiche Terrain, `RTX-01 · Catégorie` pour un test Retex. C'est la
seule convention de nommage partagée entre les deux sections.

La section **Terrain** emploie une palette inversée : fond sombre,
tons relevés sur un camouflage, accent ambre. Ce n'est pas une
seconde direction artistique, c'est la même en configuration
nocturne — mêmes filets, mêmes espacements, mêmes repères de coupe,
même numérotation.

Techniquement, rien n'est réécrit. La feuille `rnrd-terrain.css`
redéfinit les variables de `:root` et ajoute quatre blocs propres à
la section (`.brief`, `.fiche`, `.procedure`, `.warn`). Elle se
charge **après** la feuille commune :

```html
<link rel="stylesheet" href="../assets/rnrd.css">
<link rel="stylesheet" href="../assets/rnrd-terrain.css">
```

L'ordre est impératif : inversé, la palette claire écraserait la
sombre.

Conséquence utile : toute amélioration apportée à `rnrd.css`
bénéficie automatiquement à la section Terrain, et réciproquement.
Un seul système à maintenir.

La trame de camouflage est fixée à la fenêtre et s'efface en
dégradé avant d'atteindre le texte courant : elle sert de matière
derrière l'en-tête, jamais de fond de lecture. Son intensité se
règle par la variable `--camo-opacity`.

**À l'impression**, la section redevient noir sur blanc : une fiche
de terrain a vocation à être glissée dans une poche, et un fond
sombre viderait une cartouche d'encre pour rien.

### La seule exception, et pourquoi

**L'animation de la signature** (l'interlettrage de `RNRD` qui se
resserre) n'existe que sur la page d'accueil, via la classe
`wordmark`. Ce n'est pas un oubli : `RNRD` y est un logotype, pas un
titre de page. Lui donner un traitement propre relève de la
hiérarchie, pas de l'incohérence — de la même façon qu'un en-tête de
courrier ne compose pas son logo comme ses intertitres.

Appliquer cette animation aux titres des autres pages serait d'ailleurs
contre-productif : sur une phrase de deux lignes, l'interlettrage qui
se resserre provoque un recalcul de la mise en page à chaque image, et
le texte tressaute.

---

## 11. Modifier l'apparence

Toutes les couleurs et les mesures de base sont regroupées en haut de
`assets/rnrd.css`, dans le bloc `:root`. Les modifier là suffit à
changer tout le site d'un coup.

```css
--bg          fond général
--ink         texte principal
--ink-soft    texte secondaire
--ink-faint   étiquettes, légendes
--line        filets fins
--line-strong filets de structure
--accent      accent (jauge, témoins d'état) — à employer rarement
              sert aussi aux deux lueurs diffuses du fond de page
--radius      arrondi des cadres
```

Direction artistique à conserver : blanc immaculé, typographie fine et
aérée, filets d'un cheveu, angles à peine adoucis, un seul accent
couleur. Rien de décoratif — chaque filet, chaque étiquette, chaque
chiffre porte une information réelle.

---

## 12. Polices

Les polices sont hébergées dans `assets/fonts/`. Le site n'envoie
aucune requête vers un serveur extérieur : rien n'est transmis à
Google ni à personne d'autre, et l'affichage est plus rapide.

Sept fichiers `.woff2` sont nécessaires (Inter en 300/400/500,
Manrope en 200/300/400/500). Ils sont déclarés en haut de
`assets/rnrd.css`, et les deux graisses les plus utilisées sont
préchargées dans l'en-tête de chaque page.

En cas de mise à jour vers une version plus récente (v21, v22...),
il faut modifier les noms de fichiers à deux endroits : le bloc
`@font-face` de `rnrd.css`, et les balises `<link rel="preload">`
de chaque page HTML.

---

## 13. Réglage des animations

Les animations tournent en permanence, indépendamment du réglage
« effets d'animation » de Windows ou macOS.

Pour revenir au comportement conforme aux préférences système, ouvrir
`assets/rnrd.js` et basculer la première variable :

```js
var SUIVRE_REGLAGE_SYSTEME = true;
```

Ce réglage système existe pour les personnes sujettes aux vertiges
déclenchés par le mouvement à l'écran. Les animations d'ici restent
brèves et de faible amplitude, mais le basculer rend le site conforme.

---

## 14. Impression

Un article s'imprime proprement sans réglage : les repères d'écran
disparaissent, le carrousel se déplie en colonne, l'adresse des liens
externes apparaît entre parenthèses, et les blocs (fiche technique,
verdict, photos) ne sont jamais coupés entre deux pages.

Les vidéos sont retirées de la version imprimée.

---

## 15. Référencement

Chaque page comporte un titre, une description, une adresse canonique
et des métadonnées de partage (l'aperçu qui s'affiche quand un lien
est envoyé sur une messagerie). Les articles portent en plus un bloc
de données structurées décrivant l'auteur et la date.

**À faire pour chaque nouvel article**, dans l'en-tête du fichier :
mettre à jour `canonical`, `og:title`, `og:description`, `og:url`,
`article:published_time`, le fil d'Ariane (`BreadcrumbList`) en haut
de page, puis le bloc `Article` en bas de page. Trois endroits à
garder cohérents : l'adresse, le titre et la description.

**À faire aussi** : ajouter une entrée dans `sitemap.xml`.

Le reste du référencement tient au contenu lui-même : un titre clair,
une description honnête, des textes alternatifs sur les photos, et des
articles qui répondent vraiment à ce que quelqu'un cherche. Aucun outil
ne compense un contenu creux.

---

## 16. Confidentialité

Le nom n'apparaît **nulle part** sur le site : ni dans les textes, ni
dans les descriptions, ni dans les données structurées, ni dans les
mentions légales. Deux blocs de bruit le remplacent visuellement, et
ils n'encodent rien — il n'existe aucune valeur à révéler.

### Avant chaque publication

```
python3 outils/verifier.py
```

Le script examine tous les fichiers publiés et signale :

| Contrôle | Ce qu'il cherche |
|---|---|
| Identité | nom, prénom, variantes, dans les textes comme dans le code |
| Coordonnées | courriels autres que celui du site, téléphones, IBAN, comptes de paiement |
| Images | métadonnées, et surtout coordonnées GPS |
| Ressources extérieures | scripts, images ou styles chargés depuis un autre domaine |
| Localisation | communes citées en clair, coordonnées géographiques |
| Chemins | chemins de fichiers d'une machine personnelle |
| Blocs expurgés | repli laissant deviner des initiales |
| Cohérence | liens morts, ancres orphelines, données structurées invalides |

Il ne modifie rien, il signale. Un point rouge veut dire : ne pas
publier avant correction.

La liste des termes surveillés est en haut de `outils/verifier.py` —
c'est le seul fichier du projet où le nom figure, et le dossier
`outils/` n'est pas destiné à être servi.

### Les photos

```
python3 outils/nettoyer_images.py --appliquer
```

Une photo sortie d'un téléphone contient la date, le modèle de
l'appareil, parfois son numéro de série, et **très souvent les
coordonnées GPS du lieu de prise de vue**. Publier une photo de
bivouac sans la nettoyer revient à publier l'emplacement du bivouac.

Le script réécrit chaque image à partir de ses seuls pixels : aucune
métadonnée n'y survit. Il applique au passage la rotation enregistrée
et redimensionne au-delà de 1600 px.

### Les ressources extérieures

**Ne jamais pointer vers une image, un script ou une police hébergés
ailleurs.** Le navigateur du visiteur irait les chercher, transmettant
son adresse IP à ce site, sans consentement ni moyen de le savoir.

C'est la fuite la plus courante et la moins visible : elle s'introduit
en copiant une image depuis le site d'un fabricant, ou en collant un
badge, un compteur, une carte.

Une seule exception existe, documentée dans `projet.html` : la
vérification d'état du récepteur radio, qui interroge
`signal.rnrd.space` depuis la page d'accueil.

### Ce qui a été retiré, et pourquoi

- **Badge d'empreinte carbone** — il chargeait un script depuis
  `unpkg.com` puis interrogeait `websitecarbon.com` à chaque visite.
  Remplacé par un relevé statique.
- **Lien PayPal** — l'adresse `paypal.me` contenait le prénom.
- **Origine du nom RNRD** dans `histoire.html` — la phrase donnait le
  nom de famille en clair.
- **Photos du fabricant** dans le gabarit Retex — cinq images chargées
  depuis `civivi.com`.

---

## 17. Cache du navigateur

Les feuilles de style et le script portent un numéro de version dans
leur adresse :

```html
<link rel="stylesheet" href="assets/rnrd.css?v=3">
<script src="assets/rnrd.js?v=3"></script>
```

**Après chaque modification de `rnrd.css`, `rnrd-terrain.css` ou
`rnrd.js`, incrémenter ce numéro dans toutes les pages.** Sans cela,
les navigateurs continuent de servir l'ancienne version pendant des
heures ou des jours, et les corrections semblent sans effet — c'est
la cause la plus fréquente d'un « bug qui persiste après
publication ».

Commande pour tout mettre à jour d'un coup :

```bash
grep -rl 'rnrd.*\.\(css\|js\)?v=' --include='*.html' . \
  | xargs sed -i 's/?v=[0-9]*/?v=4/g'
```

Pour vérifier qu'une page charge bien la dernière version : recharger
en forçant le cache (Ctrl+Maj+R), puis comparer.

---

## 18. Entretien courant

Le site est en ligne. Cette liste remplace celle de la mise en ligne
initiale.

### À chaque publication

- [ ] Article Retex : entrée ajoutée au tableau `ARTICLES`, ligne
      ajoutée à `sitemap.xml`, balise `noindex` retirée de la page.
- [ ] Fiche Terrain : entrée de liste transformée en lien.
- [ ] Note du carnet : rien à déclarer, sauf mettre à jour de temps en
      temps la date `lastmod` du carnet dans `sitemap.xml`.
- [ ] Photos redimensionnées à 1600 px de large et texte alternatif
      rempli.

### Réglé, à ne pas défaire

- [x] Polices hébergées avec le site
- [x] Adresse de contact dans `projet.html`
- [x] Mentions légales de l'hébergeur (GitHub)
- [x] Aperçu de partage, plan du site, `robots.txt`, données structurées
- [x] `CNAME` à la racine du dépôt, HTTPS actif

### Restant

- [ ] **`retex/articles/modele.html`** conserve les photos du fabricant
      et un texte d'exemple. Il porte une balise `noindex` et n'est
      listé nulle part : il sert de gabarit privé. **Retirer cette
      balise** en créant un vrai article à partir de lui.
- [ ] **Notes d'exemple du carnet** : à remplacer par tes vraies notes,
      et retirer la photo sans source (`src=""`).
- [ ] **Moyen de don** : le lien PayPal a été retiré, son adresse
      contenant le prénom. Le bloc est en commentaire dans
      `projet.html`, section 05 — le rétablir avec un identifiant
      neutre, ou un service qui n'expose pas le nom du bénéficiaire.
- [ ] **Recopier `assets/fonts/`** après extraction d'une archive
      fournie par Claude : elles n'y sont jamais incluses.

### Points de contrôle périodiques

- Le témoin de la station Signal repose sur `favicon.ico` : si une mise
  à jour d'OpenWebRX+ déplace ce fichier, le module affichera « Hors
  ligne » à tort.
- Le `lastmod` du carnet et de Terrain : une date figée depuis des mois
  fait considérer la page comme inactive.
- Les liens externes d'un article ancien : ils meurent sans prévenir.

---

## 19. Quand le site grandira

Le référencement et le plan du site restent valables en l'état
jusqu'à un certain volume. Voici les seuils réels et ce qu'il faudra
faire, le moment venu.

### Le plan du site (`sitemap.xml`)

Il est tenu à la main. Chaque nouvel **article** doit y être ajouté :
c'est une ligne, mais c'est un oubli possible.

Le **carnet** n'a besoin que d'une seule entrée quelle que soit sa
longueur, puisque toutes les notes vivent dans la même page. Il faut
en revanche mettre à jour sa date `lastmod` de temps en temps, sinon
les moteurs finissent par la considérer comme figée.

La limite technique d'un plan de site est de 50 000 adresses. Aucun
risque de la franchir.

### Le référencement des articles

Il reste efficace en grandissant, à une condition : chaque article
doit avoir son **titre, sa description et son adresse propres**.
Dupliquer le modèle sans changer ces trois champs est l'erreur qui
ferait le plus de dégâts — deux pages annonçant le même titre se
concurrencent l'une l'autre dans les résultats.

La liste d'articles de `retex/index.html` est construite par script.
Les moteurs exécutent le JavaScript, mais avec un délai et moins de
fiabilité que du HTML brut. Ce n'est pas gênant : les articles sont
des pages autonomes, déclarées dans le plan du site, donc trouvées
même si la liste n'est pas lue. À partir d'une trentaine d'articles,
écrire cette liste directement en HTML deviendrait toutefois
préférable.

### Le carnet

Toutes les notes dans une seule page reste un bon choix jusqu'à
**une centaine de notes environ**, ou jusqu'à ce que la page dépasse
1 Mo. Au-delà, deux signes doivent alerter : le temps d'affichage sur
téléphone, et le fait que les moteurs ne retiennent qu'un seul titre
et une seule description pour l'ensemble.

La suite naturelle est alors de scinder par année :
`carnet/index.html` pour l'année en cours, `carnet/2026.html` pour
les précédentes. Chaque page a son titre, sa description et son
entrée au plan du site. Les identifiants de notes (`#n-2026-07-31`)
continuent de fonctionner à l'intérieur de leur page.

### Ce qui ne bougera pas

Les feuilles de style et le script restent uniques, quel que soit le
nombre de pages. Les fils d'Ariane, les données structurées et les
métadonnées de partage se recopient d'un fichier à l'autre sans
maintenance particulière.

---

## 20. Points de vigilance

- **Ne jamais oublier l'étape 4** (déclarer l'article dans `ARTICLES`).
  C'est le seul lien manuel du système, donc le seul oubli possible.
- **`modele.html` est un gabarit privé**, conservé comme base de départ.
  Il porte une balise `noindex` qui l'exclut des moteurs de recherche.
  **Retirer cette ligne** lors de la création d'un vrai article à partir
  de lui, sinon l'article ne sera jamais référencé.
- **Ne jamais inscrire deux adresses pour une même page** dans
  `sitemap.xml` (par exemple `/retex/` et `/retex/index.html`) : les
  moteurs y voient deux pages concurrentes pour un seul contenu.
  La forme courte, terminée par une barre oblique, suffit.
- **Vérifier les chemins relatifs** à chaque nouvelle page. La règle :
  une page à la racine écrit `assets/rnrd.css`, une page dans un
  sous-dossier écrit `../assets/rnrd.css`, une page dans un
  sous-sous-dossier écrit `../../assets/rnrd.css`. Une erreur d'un
  seul niveau et la page s'affiche sans mise en forme, ou un lien
  du pied de page mène à une adresse inexistante.
- **Vérifier les chemins de photos** : depuis un article, ils partent
  du dossier `articles/`, pas de la racine du site.
- **Photos du fabricant** : ne pas publier des visuels officiels
  comme s'ils étaient tes photos. Le modèle en contient à titre
  provisoire, à remplacer avant toute mise en ligne.
- **Liens affiliés** : la loi française impose de signaler clairement
  qu'un lien est rémunéré. À prévoir dans le pied de page le jour où
  tu les ajoutes.
