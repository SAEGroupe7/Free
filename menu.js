/*
  Menu commun à toutes les pages.
  Pour intégrer le menu dans sa page, il faut :
  - le bouton <button type="button" id="btnMenu"> et un <nav id="menu"></nav> vide dans l'en-tête
  - <script src="menu.js" defer></script> (ou "../menu.js" depuis un dossier page)
*/

const liens = [
  { href: "index.html", texte: "Accueil" },
  { href: "page4/page4.html", texte: "Histoire de l'entreprise" },
  { href: "page2/page2.html", texte: "Services et produits" },
  { href: "page3/page3.html", texte: "Présentation des produits et services" },
  { href: "page1/page1.html", texte: "Économie" },
  { href: "page5/page5.html", texte: "Expansion du groupe Iliad en Europe" },
];

const racine = document.currentScript.src;  // dossier racine

const btn = document.getElementById('btnMenu');
const menu = document.getElementById('menu');

// création du bouton pour fermer le menu
const btnClose = document.createElement('button');
btnClose.type = 'button';
btnClose.id = 'btnClose';
btnClose.setAttribute('aria-label', 'Fermer le menu');
btnClose.textContent = '×';
menu.appendChild(btnClose);

liens.forEach((lien) => {
  const a = document.createElement('a');
  a.href = new URL(lien.href, racine).href;
  a.textContent = lien.texte;
  if (a.href === location.href.split('#')[0]) {
    a.setAttribute('aria-current', 'page');
  }
  menu.appendChild(a);
});

btn.addEventListener('click', () => {
  menu.classList.toggle('open');
});

btnClose.addEventListener('click', () => {
  menu.classList.remove('open');
});

// ferme le menu quand on clique en dehors (merci Doryann)
window.addEventListener('click', (event) => {
  if (!menu.contains(event.target) && !btn.contains(event.target)) {
    menu.classList.remove('open');
  }
});
