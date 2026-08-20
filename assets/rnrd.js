/* ============================================================
   RNRD — script commun
   -------------------------------------------------------------
   Regroupe tous les comportements partagés par le site :
     · apparition au chargement et transition entre pages
     · liste d'articles (page d'accueil Retex)
     · carrousel de photos
     · jauge de lecture (pages d'article)
     · année automatique dans le pied de page

   Tout se déclenche seul selon ce qui est présent dans la page :
   aucun réglage à faire, aucun appel à écrire.
   Une page d'article n'a donc AUCUN script à contenir.

   À charger en dernier, juste avant </body>, avec le bon chemin :
     racine           <script src="assets/rnrd.js"></script>
     retex/           <script src="../assets/rnrd.js"></script>
     retex/articles/  <script src="../../assets/rnrd.js"></script>
   ============================================================ */

(function(){
  'use strict';

  /* ----------------------------------------------------------
     RÉGLAGE UNIQUE DES ANIMATIONS

     false → les animations tournent toujours, quel que soit le
             réglage « effets d'animation » de Windows ou macOS.
     true  → le site suit ce réglage système et se fige si le
             visiteur a demandé de réduire les animations.

     Note : ce réglage système existe pour les personnes sujettes
     aux vertiges déclenchés par le mouvement à l'écran. Les
     animations d'ici restent brèves et de faible amplitude, mais
     le basculer sur true suffit à rendre le site conforme.
     ---------------------------------------------------------- */
  var SUIVRE_REGLAGE_SYSTEME = false;

  var reduced = false;
  if(SUIVRE_REGLAGE_SYSTEME){
    try{
      reduced = !!(window.matchMedia &&
                   window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }catch(e){ reduced = true; }
  }


  /* ----------------------------------------------------------
     0. Éléments décoratifs
     Repère de coupe, jauge de lecture et trame de camouflage ne
     portent aucun contenu : rien ne justifie de les recopier dans
     chaque page, où ils finissent toujours par manquer quelque
     part. Ils sont posés ici, à partir de ce que la page déclare
     déjà — sa feuille de style pour la trame, rien du tout pour le
     reste.

     La fonction est idempotente : si un de ces éléments figure
     encore dans le HTML d'une page, il n'est pas dupliqué.

     Conséquence assumée : sans JavaScript, ces trois éléments
     n'apparaissent pas. Ils sont décoratifs, la page reste
     entièrement lisible et navigable sans eux.
     ---------------------------------------------------------- */
  function initChrome(){
    var corps = document.body;
    if(!corps) return;

    function poser(selecteur, balise, classe, enTete){
      if(document.querySelector(selecteur)) return;
      var el = document.createElement(balise);
      el.className = classe;
      el.setAttribute('aria-hidden', 'true');
      if(enTete){ corps.insertBefore(el, corps.firstChild); }
      else { corps.appendChild(el); }
    }

    // trame de camouflage : uniquement si la page charge le mode terrain
    if(document.querySelector('link[href*="rnrd-terrain"]')){
      poser('.camo-field', 'div', 'camo-field', true);
    }

    poser('.corner-mark', 'span', 'corner-mark', true);
    poser('.read-progress', 'div', 'read-progress', true);
  }


  /* ----------------------------------------------------------
     1. Animations d'interface
     La classe n'est posée que si le script tourne et que le
     visiteur n'a pas demandé de réduire les animations. Sans
     elle, tout le contenu reste visible et cliquable.
     ---------------------------------------------------------- */
  if(!reduced){
    document.documentElement.className += ' js-anim';
  }


  /* ----------------------------------------------------------
     2. Transition entre pages
     Fondu court avant de changer de page. Ne s'applique qu'aux
     liens internes ouverts normalement : liens externes, ancres,
     téléchargements et ouvertures dans un nouvel onglet gardent
     leur comportement habituel.
     ---------------------------------------------------------- */
  function initPageTransition(){
    if(reduced) return;

    document.addEventListener('click', function(e){
      if(e.defaultPrevented) return;
      if(e.button !== 0) return;
      if(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      var link = e.target;
      while(link && link.tagName !== 'A'){ link = link.parentNode; }
      if(!link || !link.getAttribute) return;

      var href = link.getAttribute('href');
      if(!href) return;
      if(link.target && link.target !== '_self') return;
      if(link.hasAttribute('download')) return;
      if(href.charAt(0) === '#') return;
      if(/^(mailto:|tel:|javascript:)/i.test(href)) return;
      if(link.host && link.host !== window.location.host) return;

      e.preventDefault();
      document.documentElement.className += ' is-leaving';

      // Sécurité : la navigation a lieu même si la transition échoue.
      setTimeout(function(){ window.location.href = link.href; }, 250);
    });

    // Retour arrière : la page peut être restaurée en état « sortant ».
    window.addEventListener('pageshow', function(){
      document.documentElement.className =
        document.documentElement.className.replace(/\s*is-leaving/g, '');
    });
  }


  /* ----------------------------------------------------------
     3. Liste d'articles
     S'active si la page contient #articleList et que la variable
     globale ARTICLES est définie (déclarée dans retex/index.html).
     Tri par date, du plus récent au plus ancien.
     ---------------------------------------------------------- */
  function initArticleList(){
    var list = document.getElementById('articleList');
    if(!list || typeof window.ARTICLES === 'undefined') return;

    var sorted = window.ARTICLES.slice().sort(function(a, b){
      return new Date(b.date) - new Date(a.date);
    });

    function pad(n){ return ('0' + n).slice(-2); }

    // Aucun article publié : afficher un message plutôt qu'une page
    // vide, qui donnerait l'impression d'un site en panne.
    if(sorted.length === 0){
      var vide = document.createElement('p');
      vide.className = 'empty-state';
      vide.textContent = 'Premiers tests en cours de rédaction. ' +
                         'Ils paraîtront ici dès qu\'ils auront assez de recul pour être utiles.';
      list.appendChild(vide);
      var c0 = document.querySelector('[data-article-count]');
      if(c0){ c0.textContent = '00'; }
      return;
    }

    sorted.forEach(function(a, i){
      var link = document.createElement('a');
      link.className = 'article-item';
      link.href = a.slug;

      var dateFmt = new Date(a.date + 'T12:00:00').toLocaleDateString('fr-FR', {
        day:'numeric', month:'long', year:'numeric'
      });

      // Numéro d'ordre : rang réel de publication (le plus ancien = 01).
      // Un préfixe déclaré sur la liste (data-code-prefix) transforme le
      // numéro en code de série, à la manière des fiches Terrain.
      var prefixe = list.getAttribute('data-code-prefix');
      var idx = document.createElement('div');
      idx.className = 'article-index num';
      idx.textContent = (prefixe ? prefixe + '-' : '') + pad(sorted.length - i);

      var thumb = document.createElement('div');
      thumb.className = a.cover ? 'article-thumb' : 'article-thumb empty';
      if(a.cover){
        var img = document.createElement('img');
        img.src = a.cover;
        img.alt = '';
        img.loading = 'lazy';
        thumb.appendChild(img);
      }

      var body = document.createElement('div');

      var meta = document.createElement('div');
      meta.className = 'article-meta';
      meta.textContent = a.tag + ' · ' + dateFmt;

      var title = document.createElement('div');
      title.className = 'article-title';
      title.textContent = a.title;

      var excerpt = document.createElement('div');
      excerpt.className = 'article-excerpt';
      excerpt.textContent = a.excerpt;

      body.appendChild(meta);
      body.appendChild(title);
      body.appendChild(excerpt);

      link.appendChild(idx);
      link.appendChild(thumb);
      link.appendChild(body);
      list.appendChild(link);
    });

    var count = document.querySelector('[data-article-count]');
    if(count){ count.textContent = pad(sorted.length); }
  }


  /* ----------------------------------------------------------
     4. Carrousel
     S'active seul sur chaque bloc [data-carousel] de la page.
     Il peut y en avoir plusieurs dans un même article.
     ---------------------------------------------------------- */
  function initCarousels(){
    var carousels = document.querySelectorAll('[data-carousel]');

    Array.prototype.forEach.call(carousels, function(root){
      var track   = root.querySelector('.carousel-track');
      var slides  = root.querySelectorAll('.carousel-slide');
      var dotsBox = root.querySelector('[data-carousel-dots]');
      var caption = root.querySelector('[data-carousel-caption]');
      var prevBtn = root.querySelector('[data-carousel-prev]');
      var nextBtn = root.querySelector('[data-carousel-next]');
      var curEl   = root.querySelector('[data-carousel-current]');
      var totEl   = root.querySelector('[data-carousel-total]');
      if(!track || slides.length === 0) return;

      var current = 0;
      var dots = [];

      function pad(n){ return ('0' + n).slice(-2); }

      if(totEl){ totEl.textContent = pad(slides.length); }

      if(dotsBox){
        for(var i=0; i<slides.length; i++){
          (function(index){
            var dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.type = 'button';
            dot.setAttribute('aria-label', 'Photo ' + (index+1) + ' sur ' + slides.length);
            dot.addEventListener('click', function(){ goTo(index); });
            dotsBox.appendChild(dot);
            dots.push(dot);
          })(i);
        }
      }

      function render(){
        for(var i=0; i<dots.length; i++){
          dots[i].className = (i === current) ? 'carousel-dot current' : 'carousel-dot';
        }
        if(caption){
          caption.textContent = slides[current].getAttribute('data-caption') || '';
        }
        if(curEl){ curEl.textContent = pad(current + 1); }
        if(prevBtn){ prevBtn.disabled = (current === 0); }
        if(nextBtn){ nextBtn.disabled = (current === slides.length - 1); }
      }

      function goTo(index){
        current = Math.max(0, Math.min(slides.length - 1, index));
        var left = slides[current].offsetLeft - track.offsetLeft;
        if(track.scrollTo){
          track.scrollTo({ left: left, behavior: reduced ? 'auto' : 'smooth' });
        } else {
          track.scrollLeft = left;
        }
        render();
      }

      if(prevBtn){ prevBtn.addEventListener('click', function(){ goTo(current - 1); }); }
      if(nextBtn){ nextBtn.addEventListener('click', function(){ goTo(current + 1); }); }

      track.addEventListener('keydown', function(e){
        if(e.key === 'ArrowRight'){ e.preventDefault(); goTo(current + 1); }
        if(e.key === 'ArrowLeft'){  e.preventDefault(); goTo(current - 1); }
      });

      // suit le défilement manuel (doigt, pavé tactile)
      var ticking;
      track.addEventListener('scroll', function(){
        clearTimeout(ticking);
        ticking = setTimeout(function(){
          var nearest = 0, best = Infinity;
          for(var i=0; i<slides.length; i++){
            var d = Math.abs((slides[i].offsetLeft - track.offsetLeft) - track.scrollLeft);
            if(d < best){ best = d; nearest = i; }
          }
          if(nearest !== current){ current = nearest; render(); }
        }, 90);
      });

      render();
    });
  }


  /* ----------------------------------------------------------
     5. Jauge de lecture
     S'active si la page contient <div class="read-progress">.
     ---------------------------------------------------------- */
  function initReadProgress(){
    var bar = document.querySelector('.read-progress');
    if(!bar) return;

    function update(){
      var doc = document.documentElement;
      var h = doc.scrollHeight - window.innerHeight;
      var pct = h > 0 ? (window.pageYOffset / h) * 100 : 0;
      bar.style.width = Math.max(0, Math.min(100, pct)) + '%';
    }

    window.addEventListener('scroll', update, { passive:true });
    window.addEventListener('resize', update);
    update();
  }


  /* ----------------------------------------------------------
     6. Apparition des images
     Une image qui arrive après le texte surgit brutalement. Ici,
     chaque image encore en cours de chargement est masquée puis
     révélée en fondu une fois prête.
     Sans JavaScript, aucune classe n'est posée : les images
     s'affichent normalement.
     ---------------------------------------------------------- */
  function initImageFade(){
    if(reduced) return;

    var imgs = document.querySelectorAll(
      '.article-cover img, article.body img, .journal-figure img, .carousel-slide img'
    );

    Array.prototype.forEach.call(imgs, function(img){
      if(img.complete && img.naturalWidth > 0) return;  // déjà en cache

      img.className += ' is-loading';

      function reveal(){
        img.className = img.className.replace(/\s*is-loading/g, '') + ' is-loaded';
      }
      img.addEventListener('load', reveal);
      img.addEventListener('error', reveal);   // image absente : on la démasque quand même

      // filet de sécurité : rien ne reste invisible plus de 3 secondes
      setTimeout(reveal, 3000);
    });
  }


  /* ----------------------------------------------------------
     7. Annotations d'angle et compteurs
     Le code de section est déclaré une seule fois, sur la balise
     <body> (attribut data-code). Tout le reste est calculé ici :
     aucune valeur à tenir à jour à la main dans les pages.
     ---------------------------------------------------------- */
  function initEdgeNotes(){
    var code = document.body.getAttribute('data-code');
    if(!code) return;

    function note(cote, html){
      var el = document.createElement('span');
      el.className = 'edge-note ' + cote;
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = html;
      document.body.appendChild(el);
    }

    note('left',  'RNRD.SPACE');
    note('right', code + '<span class="sep">//</span>' + new Date().getFullYear());
  }

  function initCounts(){
    function pad(n){ return ('0' + n).slice(-2); }

    // Numérotation des modules : recalculée à l'intérieur de chaque
    // groupe, et compteur posé sur l'étiquette du groupe. Réordonner
    // les sections, en déplacer une d'un groupe à l'autre ou créer un
    // troisième groupe ne demande aucune correction manuelle.
    var groupes = document.querySelectorAll('.modules');
    Array.prototype.forEach.call(groupes, function(groupe, g){
      var mods = groupe.querySelectorAll('.module');

      Array.prototype.forEach.call(mods, function(mod, i){
        var gauche = mod.querySelector('.module-left');
        if(!gauche) return;
        var idx = document.createElement('span');
        idx.className = 'module-index';
        idx.setAttribute('aria-hidden', 'true');
        idx.textContent = pad(i + 1);
        gauche.insertBefore(idx, gauche.firstChild);
      });

      var etiquette = document.querySelector('[data-count-modules="' + (g + 1) + '"]');
      if(etiquette){
        etiquette.innerHTML = '<span class="sep">//</span>' + pad(mods.length);
      }
    });


    // nombre de notes du carnet
    var ce = document.querySelector('[data-count-entries]');
    if(ce){ ce.innerHTML = '<span class="sep">//</span>' + pad(document.querySelectorAll('.journal-entry').length); }

    // nombre de planches photographiques
    var cp = document.querySelector('[data-count-plates]');
    if(cp){ cp.innerHTML = '<span class="sep">//</span>' + pad(document.querySelectorAll('.plate').length); }

    // nombre de fiches de la section Terrain
    var cf = document.querySelector('[data-count-fiches]');
    if(cf){ cf.innerHTML = '<span class="sep">//</span>' + pad(document.querySelectorAll('.fiche').length); }
  }


  /* ----------------------------------------------------------
     8. Année automatique
     Remplit tout élément portant l'attribut data-year.
     ---------------------------------------------------------- */
  function initYear(){
    var els = document.querySelectorAll('[data-year]');
    var y = new Date().getFullYear();
    Array.prototype.forEach.call(els, function(el){ el.textContent = y; });
  }


  /* ----------------------------------------------------------
     9. Frappe du sur-titre
     S'applique au sur-titre de TOUTES les pages : c'est un
     comportement de la direction artistique, pas un effet posé au
     cas par cas. Aucun attribut à déclarer dans les pages.

     Le texte est écrit dans le HTML : si le script ne s'exécute
     pas, il s'affiche normalement, sans animation.

     Le curseur disparaît après quelques clignotements — laissé en
     place indéfiniment, il finirait par accrocher l'œil.
     ---------------------------------------------------------- */
  function initTyping(){
    if(reduced) return;

    var el = document.querySelector('.eyebrow');
    if(!el) return;

    var texte = el.textContent;
    el.textContent = '';

    var caret = document.createElement('span');
    caret.className = 'caret';
    caret.setAttribute('aria-hidden', 'true');
    el.appendChild(caret);

    var i = 0;
    var pas = 52;   // millisecondes par caractère

    function frappe(){
      if(i >= texte.length){
        // trois clignotements, puis effacement du curseur
        setTimeout(function(){
          if(caret.parentNode) caret.parentNode.removeChild(caret);
        }, 2700);
        return;
      }
      el.insertBefore(document.createTextNode(texte.charAt(i)), caret);
      i++;
      setTimeout(frappe, pas);
    }

    setTimeout(frappe, 260);
  }


  /* ----------------------------------------------------------
     10. Totaux de l'inventaire
     Additionne les masses déclarées en grammes sur chaque ligne
     (attribut data-poids) et remplit les cellules de synthèse.
     Rien à tenir à jour : ajouter ou retirer un objet suffit.
     ---------------------------------------------------------- */
  function initInventaire(){
    var lignes = document.querySelectorAll('[data-poids]');
    if(!lignes.length) return;

    var total = 0, nb = 0;
    Array.prototype.forEach.call(lignes, function(l){
      var v = parseFloat(l.getAttribute('data-poids'));
      if(!isNaN(v)){ total += v; nb++; }
    });

    var cObjets = document.querySelector('[data-total-objets]');
    if(cObjets){ cObjets.textContent = nb; }

    var cPoids = document.querySelector('[data-total-poids]');
    if(cPoids){
      cPoids.innerHTML = (total / 1000).toFixed(2).replace('.', ',') +
                         '<span class="unit">kg</span>';
    }

    var cCat = document.querySelector('[data-total-categories]');
    if(cCat){ cCat.textContent = document.querySelectorAll('.specs-title').length; }
  }


  /* ----------------------------------------------------------
     11. État de la station d'écoute
     Le site étant statique, il ne peut pas deviner si le récepteur
     émet. On interroge donc réellement le serveur au chargement :
     une image minuscule est demandée à signal.rnrd.space, et sa
     réponse — ou son absence — donne le verdict.

     La station étant coupée en éteignant le serveur, l'absence de
     réponse signifie bien « hors ligne » et non « en panne ».

     Limite assumée : ce test constate que le serveur répond, pas
     que le récepteur radio fonctionne. Si le serveur tournait sans
     le récepteur, le témoin annoncerait « en ligne » à tort.

     Sans JavaScript, le module conserve la mention neutre écrite
     dans le HTML : « Intermittent », qui reste vraie en toutes
     circonstances.
     ---------------------------------------------------------- */
  function initSignalStatus(){
    var mod = document.querySelector('.module.intermittent');
    if(!mod) return;

    var etiquette = mod.querySelector('.module-tag');
    var fleche    = etiquette ? etiquette.querySelector('.ext') : null;
    var hote      = mod.getAttribute('data-station');
    if(!etiquette || !hote) return;

    function ecrire(texte){
      etiquette.textContent = texte + ' ';
      if(fleche){ etiquette.appendChild(fleche); }
    }

    function etat(classe, texte){
      mod.className = mod.className.replace(/\s*(verification|en-ligne|hors-ligne)/g, '');
      mod.className += ' ' + classe;
      ecrire(texte);
    }

    etat('verification', 'Vérification');

    var sonde = new Image();
    var tranche = false;

    function verdict(enLigne){
      if(tranche) return;
      tranche = true;
      etat(enLigne ? 'en-ligne' : 'hors-ligne',
           enLigne ? 'En ligne'  : 'Hors ligne');
    }

    sonde.onload  = function(){ verdict(true); };
    sonde.onerror = function(){ verdict(false); };

    // au-delà de trois secondes sans réponse, on considère la
    // station arrêtée : un serveur allumé répond bien plus vite
    setTimeout(function(){ verdict(false); }, 3000);

    sonde.src = hote + '/favicon.ico?t=' + Date.now();
  }


  /* ----------------------------------------------------------
     12. Sommaire flottant
     Se construit à partir des articles identifiés de la page, à
     partir de trois. Le titre repris est celui du sur-titre de
     l'article (le code : TER-01, TER-02…), plus court et plus
     lisible dans une marge que le titre complet.
     Le suivi de lecture se fait au défilement : la fiche marquée
     est celle dont le titre est passé au-dessus du tiers haut de
     la fenêtre.
     ---------------------------------------------------------- */
  function pad2(n){ return ('0' + n).slice(-2); }

  /* Coupe un titre trop long à la dernière limite de mot utile.
     La troncature se fait ici plutôt qu'en CSS : les propriétés de
     limitation du nombre de lignes restent inégalement appliquées
     d'un navigateur à l'autre, et laissent parfois une ligne
     déborder sur l'entrée suivante. */
  function tronquer(texte, maxi){
    if(texte.length <= maxi) return texte;
    var coupe = texte.slice(0, maxi);
    var espace = coupe.lastIndexOf(' ');
    if(espace > maxi * 0.55){ coupe = coupe.slice(0, espace); }
    return coupe.replace(/[\s,;:.–—-]+$/, '') + '\u2026';
  }

  function initToc(){
    // Deux cas de figure, une seule mécanique.
    // A. Page réunissant plusieurs articles identifiés (Terrain) :
    //    le sommaire liste les articles, sous leur code.
    // B. Page d'un article unique et long (un test Retex) :
    //    le sommaire liste ses titres de section.
    var cibles = [], mode = 'articles';

    var articles = document.querySelectorAll('article.body[id]');
    if(articles.length >= 3){
      cibles = Array.prototype.slice.call(articles);
    } else {
      var titres = document.querySelectorAll('article.body h2');
      if(titres.length < 3) return;
      cibles = Array.prototype.slice.call(titres);
      mode = 'titres';
    }

    var nav = document.createElement('nav');
    nav.className = 'toc';
    nav.setAttribute('aria-label', 'Sommaire');

    var titre = document.createElement('p');
    titre.className = 'toc-label';
    titre.textContent = 'Sommaire';
    nav.appendChild(titre);

    var liens = [];
    cibles.forEach(function(cible, i){
      // un titre de section n'a pas forcément d'identifiant : on lui
      // en attribue un, stable, pour pouvoir l'atteindre par lien
      if(!cible.id){ cible.id = 'sct-' + pad2(i + 1); }

      var texte;
      if(mode === 'articles'){
        var code = cible.querySelector('.eyebrow');
        texte = code ? code.textContent.trim() : cible.id.toUpperCase();
      } else {
        var num = cible.querySelector('.h2-index');
        texte = cible.textContent.replace(num ? num.textContent : '', '').trim();
      }
      texte = tronquer(texte, 26);

      var a = document.createElement('a');
      a.href = '#' + cible.id;
      a.textContent = texte;
      nav.appendChild(a);
      liens.push({ a:a, art:cible });
    });

    document.body.appendChild(nav);

    var enCours = -1;
    function suivre(){
      var seuil = window.innerHeight / 3;
      var actif = 0;
      for(var i = 0; i < liens.length; i++){
        if(liens[i].art.getBoundingClientRect().top <= seuil){ actif = i; }
      }
      if(actif === enCours) return;
      enCours = actif;
      for(var j = 0; j < liens.length; j++){
        liens[j].a.className = (j === actif) ? 'current' : '';
      }
    }

    window.addEventListener('scroll', suivre, { passive:true });
    window.addEventListener('resize', suivre);
    suivre();
  }


  /* ----------------------------------------------------------
     13. Retour en haut de page
     Créé sur toute page dépassant deux hauteurs d'écran, et
     affiché après un écran et demi de défilement. Sur une page
     courte, il n'existe pas : rien à masquer, rien à régler.
     ---------------------------------------------------------- */
  function initToTop(){
    if(document.documentElement.scrollHeight < window.innerHeight * 2) return;

    var btn = document.createElement('button');
    btn.className = 'to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Revenir en haut de la page');
    btn.innerHTML = '&#8593;';
    document.body.appendChild(btn);

    btn.addEventListener('click', function(){
      window.scrollTo({ top:0, behavior: reduced ? 'auto' : 'smooth' });
    });

    function afficher(){
      var seuil = window.innerHeight * 1.5;
      btn.className = (window.pageYOffset > seuil) ? 'to-top visible' : 'to-top';
    }

    window.addEventListener('scroll', afficher, { passive:true });
    afficher();
  }


  /* ----------------------------------------------------------
     14. Donnée expurgée
     Corruption active à l'emplacement d'une donnée personnelle.
     Rien n'est masqué : il n'existe aucune valeur d'origine, ni
     dans le HTML, ni ici. Tout est tiré au sort à l'exécution.

     Le comportement raconte une lutte, en trois phases qui
     s'enchaînent sans fin :

       BROUILLAGE  état de repos. Le champ est illisible, les
                   caractères changent mollement, l'intensité est
                   basse. Rien ne se passe.

       SONDE       quelque chose cherche à lire. Les caractères se
                   figent un à un, les symboles cèdent la place à
                   des lettres, l'intensité monte : la donnée
                   commence à se former.

       RIPOSTE     le système intervient. Tout est disloqué d'un
                   coup, les caractères tremblent, l'intensité
                   sature, puis retombe. Ce qui s'était formé est
                   détruit.

     La montée de la sonde est progressive, ce qui rend la riposte
     lisible comme une réaction et non comme un simple scintillement.

     Si le visiteur a demandé de réduire les animations, l'état de
     brouillage est dessiné puis figé.
     ---------------------------------------------------------- */
  function initRedacted(){
    var blocs = document.querySelectorAll('.redacted');
    if(!blocs.length) return;

    var LETTRES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var CHIFFRES = '0123456789';
    var SYMBOLES = '#%&@$?!/\\|<>^~*+=:;.-_';
    var VIDE = '\u00A0';

    // Plus « lisible » est élevé, plus le tirage penche vers des
    // lettres : c'est ce qui donne l'impression d'un mot en train
    // de se former.
    function glyphe(lisible){
      var r = Math.random();
      if(!lisible && r < 0.07) return VIDE;
      if(r < 0.55 + lisible * 0.4) return LETTRES.charAt(Math.floor(Math.random() * LETTRES.length));
      if(r < 0.70 + lisible * 0.3) return CHIFFRES.charAt(Math.floor(Math.random() * CHIFFRES.length));
      return SYMBOLES.charAt(Math.floor(Math.random() * SYMBOLES.length));
    }

    function intensite(base, dispersion){
      var v = base + (Math.random() - 0.5) * dispersion;
      return Math.max(0.08, Math.min(1, v)).toFixed(2);
    }

    Array.prototype.forEach.call(blocs, function(bloc){
      var n = parseInt(bloc.getAttribute('data-length'), 10) || 9;

      bloc.textContent = '';
      var cellules = [];
      for(var i = 0; i < n; i++){
        var c = document.createElement('span');
        c.textContent = glyphe(0);
        c.style.opacity = intensite(0.35, 0.5);
        bloc.appendChild(c);
        cellules.push({ el: c, fige: 0 });
      }

      if(reduced) return;

      var PHASES = {
        brouillage: { min: 34, max: 78 },
        sonde:      { min: 16, max: 26 },
        riposte:    { min: 7,  max: 13 }
      };

      var phase = 'brouillage';
      var reste = 40;
      var duree = 40;

      function basculer(vers){
        phase = vers;
        var p = PHASES[vers];
        duree = reste = p.min + Math.floor(Math.random() * (p.max - p.min));
        bloc.className = bloc.className.replace(/\s*(surge|probe)/g, '');
        if(vers === 'sonde')   bloc.className += ' probe';
        if(vers === 'riposte') bloc.className += ' surge';
      }

      setInterval(function(){
        reste--;

        // avancement dans la phase, de 0 à 1
        var t = duree > 0 ? 1 - (reste / duree) : 1;

        var proba, lisible, base, dispersion;

        if(phase === 'brouillage'){
          proba = 0.30; lisible = 0; base = 0.34; dispersion = 0.55;
        } else if(phase === 'sonde'){
          // tout monte à mesure que la sonde progresse
          proba = 0.34 - t * 0.22;
          lisible = t;
          base = 0.42 + t * 0.42;
          dispersion = 0.4 - t * 0.28;
        } else {
          proba = 1; lisible = 0; base = 0.7; dispersion = 0.9;
        }

        for(var i = 0; i < cellules.length; i++){
          var cel = cellules[i];

          if(phase === 'riposte'){
            cel.fige = 0;                       // plus rien ne tient
          } else if(cel.fige > 0){
            cel.fige--;
            continue;
          }

          if(Math.random() < proba){
            cel.el.textContent = glyphe(lisible);
            cel.el.style.opacity = intensite(base, dispersion);

            // pendant la sonde, les caractères s'accrochent de plus
            // en plus longtemps : la donnée se stabilise
            if(phase === 'sonde' && Math.random() < 0.2 + t * 0.5){
              cel.fige = 2 + Math.floor(Math.random() * (3 + t * 9));
            } else if(phase === 'brouillage' && Math.random() < 0.1){
              cel.fige = 2 + Math.floor(Math.random() * 4);
            }
          }
        }

        if(reste <= 0){
          if(phase === 'brouillage')   basculer('sonde');
          else if(phase === 'sonde')   basculer('riposte');
          else                         basculer('brouillage');
        }
      }, 62);
    });
  }


  /* ----------------------------------------------------------
     DÉMARRAGE
     ---------------------------------------------------------- */
  /* Chaque module est isolé : si l'un échoue — navigateur ancien,
     page particulière, contenu inattendu — les autres continuent de
     fonctionner. Sans cela, une seule erreur laisse la page sans
     décor, sans sommaire et sans brouillage, sans rien indiquer.
     L'avertissement en console dit lequel a lâché. */
  function lancer(nom, fn){
    try{
      fn();
    }catch(e){
      if(window.console && console.warn){
        console.warn('RNRD — module « ' + nom + ' » interrompu :', e);
      }
    }
  }

  function start(){
    lancer('decor',       initChrome);
    lancer('expurge',     initRedacted);
    lancer('annee',       initYear);
    lancer('annotations', initEdgeNotes);
    lancer('compteurs',   initCounts);
    lancer('frappe',      initTyping);
    lancer('inventaire',  initInventaire);
    lancer('station',     initSignalStatus);
    lancer('sommaire',    initToc);
    lancer('retour',      initToTop);
    lancer('articles',    initArticleList);
    lancer('carrousels',  initCarousels);
    lancer('images',      initImageFade);
    lancer('lecture',     initReadProgress);
    lancer('transition',  initPageTransition);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
