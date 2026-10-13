/*
  Carrousel de la page d'accueil (ul.jester).
  - ajoute les petits ronds de navigation
  - charge dragscroll (depuis un CDN), qui permet de défiler en cliquant et glissant à la souris
  Pour l'intégrer dans la page : <script src="carrousel.js" defer></script>
*/

const scriptDragscroll = document.createElement('script');
scriptDragscroll.src = 'https://cdn.jsdelivr.net/npm/dragscroll@0.0.8/dragscroll.js';
document.head.append(scriptDragscroll);

const carrousel = document.querySelector('ul.jester');
const slides = [...carrousel.children];

/* Position de défilement qui centre une slide */
const position = (slide) => slide.offsetLeft - (carrousel.clientWidth - slide.offsetWidth) / 2;
const ecart = (slide) => Math.abs(position(slide) - carrousel.scrollLeft);
const courante = () => slides.reduce((proche, slide, i) => (ecart(slide) < ecart(slides[proche]) ? i : proche), 0);
const aller = (i) => carrousel.scrollTo({ left: position(slides[i]) });

/* --=== Ronds de navigation ===-- */
const points = document.createElement('div');
points.className = 'jester-points';
slides.forEach((slide, i) => {
  const point = document.createElement('button');
  point.type = 'button';
  point.setAttribute('aria-label', `Afficher : ${slide.textContent.trim()}`);
  point.addEventListener('click', () => aller(i));
  points.append(point);
});
carrousel.after(points);

const majPoints = () => {
  const i = courante();
  [...points.children].forEach((point, j) => point.setAttribute('aria-current', j === i));
};
carrousel.addEventListener('scroll', majPoints, { passive: true });
majPoints();

/* --=== Cliquer-glisser ===-- */

/*
Fait avec dragscroll.
Il reste à couper l'aimantation (scroll-snap) pendant le glissement,
à changer de slide dès un petit glissement, et à ne pas suivre le lien de la slide qu'on vient de faire glisser.
*/

const SEUIL = 50; /* glissement minimal (en px) pour changer de slide */
let departX = 0;
let depart = 0;
carrousel.addEventListener('mousedown', (e) => {
  departX = e.clientX;
  depart = courante();
  carrousel.classList.add('glisse');
});
window.addEventListener('mouseup', (e) => {
  if (!carrousel.classList.contains('glisse')) return;
  carrousel.classList.remove('glisse');
  const dx = e.clientX - departX;
  let cible = depart;
  if (dx < -SEUIL) cible = Math.min(depart + 1, slides.length - 1);
  if (dx > SEUIL) cible = Math.max(depart - 1, 0);
  aller(cible);
});
carrousel.addEventListener('click', (e) => {
  /* e.detail vaut 0 quand le lien est activé au clavier */
  if (e.detail && Math.abs(e.clientX - departX) > 5) e.preventDefault();
}, true);

/* --=== Défilement automatique ===-- */

/*
Passe à la slide suivante toutes les DELAI ms (et revient à la première après la dernière).
En pause quand la souris est sur le carrousel ou que le focus clavier est dedans,
pour ne pas interromper l'utilisateur.
*/

const DELAI = 5000;
const PAUSE = 10000;
let survol = false;
let focusDedans = false;
let minuteur;

/* (Re)lance l'attente avant le prochain défilement automatique */
const planifier = (attente) => {
  clearTimeout(minuteur);
  minuteur = setTimeout(() => {
    if (!(survol || focusDedans || document.hidden)) aller((courante() + 1) % slides.length);
    planifier(DELAI);
  }, attente);
};

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  carrousel.addEventListener('mouseenter', () => { survol = true; });
  carrousel.addEventListener('mouseleave', () => { survol = false; planifier(PAUSE); });
  carrousel.addEventListener('focusin', () => { focusDedans = true; });
  carrousel.addEventListener('focusout', () => { focusDedans = false; planifier(PAUSE); });

  const interaction = () => planifier(PAUSE);
  ['mousedown', 'wheel', 'keydown', 'touchstart'].forEach((type) => {
    carrousel.addEventListener(type, interaction, { passive: true });
  });
  points.addEventListener('click', interaction);

  planifier(DELAI);
}
