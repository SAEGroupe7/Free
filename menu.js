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

const racine = document.currentScript.src;
const page = location.href.split('#')[0];
const btn = document.getElementById('btnMenu');
const menu = document.getElementById('menu');

menu.innerHTML =
  '<button type="button" id="btnClose" aria-label="Fermer le menu">×</button>' +
  liens.map(({ href, texte }) => {
    const url = new URL(href, racine).href;
    return `<a href="${url}"${url === page ? ' aria-current="page"' : ''}>${texte}</a>`;
  }).join('');
/* Ferme le menu quand on clicke à côté */
document.addEventListener('click', (e) => {
  if (btn.contains(e.target)) menu.classList.toggle('open');
  else if (e.target.closest('#btnClose') || !menu.contains(e.target)) menu.classList.remove('open');
});
