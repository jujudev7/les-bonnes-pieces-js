import { ajoutListenersAvis, ajoutListenerEnvoyerAvis, afficherAvis, afficherGraphiqueAvis } from "./avis.js";
//Récupération des pièces eventuellement stockées dans le localStorage
let pieces = window.localStorage.getItem("pieces");

if (pieces === null) {
  // Récupération des pièces depuis le fichier JSON
  // const reponse = await fetch("pieces-autos.json");
  // Récupération des pièces depuis l'API'
  const reponse = await fetch("http://localhost:8081/pieces");
  pieces = await reponse.json();
  // Transformation des pièces en JSON
  const valeurPieces = JSON.stringify(pieces);
  // Stockage des informations dans le localStorage
  window.localStorage.setItem("pieces", valeurPieces);
} else {
  pieces = JSON.parse(pieces);
}

// on appelle la fonction pour ajouter le listener au formulaire
ajoutListenerEnvoyerAvis();

function genererPieces(pieces) {
  for (let i = 0; i < pieces.length; i++) {
    const article = pieces[i];
    // Récupération de l'élément du DOM qui accueillera les fiches
    const sectionFiches = document.querySelector(".fiches");
    // Création d’une balise dédiée à une pièce automobile
    const pieceElement = document.createElement("article");
    // Création des balises
    const imageElement = document.createElement("img");
    imageElement.src = article.image;
    const nomElement = document.createElement("h2");
    nomElement.innerText = article.nom;
    const prixElement = document.createElement("p");
    prixElement.innerText = `Prix: ${article.prix} € (${
      article.prix < 35 ? "€" : "€€€"
    })`;
    const categorieElement = document.createElement("p");
    categorieElement.innerText = article.categorie ?? "(aucune catégorie)";
    const descriptionElement = document.createElement("p");
    descriptionElement.innerText =
      article.description ?? "Pas de description pour le moment.";
    const stockElement = document.createElement("p");
    stockElement.innerText = article.disponibilite
      ? "En stock"
      : "Rupture de stock";
    // Ajout bouton Avis
    const avisBouton = document.createElement("button");
    avisBouton.dataset.id = article.id;
    avisBouton.textContent = "Afficher les avis";

    // On rattache la balise article à la section Fiches
    sectionFiches.appendChild(pieceElement);
    // On rattache l’image à pieceElement (la balise article)
    pieceElement.appendChild(imageElement);
    pieceElement.appendChild(nomElement);
    pieceElement.appendChild(prixElement);
    pieceElement.appendChild(categorieElement);
    //Ajout des éléments au DOM pour l'exercice
    pieceElement.appendChild(descriptionElement);
    pieceElement.appendChild(stockElement);
    pieceElement.appendChild(avisBouton);
  }
  // Ajout de la fonction ajoutListenersAvis
  ajoutListenersAvis();
}

genererPieces(pieces);

for(let i = 0; i < pieces.length; i++){
  const id = pieces[i].id;
  const avisJSON = window.localStorage.getItem(`avis-piece-${id}`);
  const avis = JSON.parse(avisJSON);

  if(avis !== null){
      const pieceElement = document.querySelector(`article[data-id="${id}"]`);
      afficherAvis(pieceElement, avis)
  }
}

//Gestion des boutons
const boutonTrier = document.querySelector(".btn-trier");
// Copie de la liste avec Array.from pour ne pas modifier la liste originale
boutonTrier.addEventListener("click", function () {
  const piecesOrdonnees = Array.from(pieces);
  piecesOrdonnees.sort(function (a, b) {
    return a.prix - b.prix;
  });
  document.querySelector(".fiches").innerHTML = "";
  genererPieces(piecesOrdonnees);
});

const boutonFiltrer = document.querySelector(".btn-filtrer");

boutonFiltrer.addEventListener("click", function () {
  const piecesFiltrees = pieces.filter(function (piece) {
    return piece.prix <= 35;
  });
  document.querySelector(".fiches").innerHTML = "";
  genererPieces(piecesFiltrees);
});

// Filtrer la liste des pièces pour n’afficher que celles qui ont une description
const boutonNoDescription = document.querySelector(".btn-nodescription");

boutonNoDescription.addEventListener("click", function () {
  const piecesFiltrees = pieces.filter(function (piece) {
    return piece.description;
  });
  document.querySelector(".fiches").innerHTML = "";
  genererPieces(piecesFiltrees);
});

// Ordonner les listes selon le prix en ordre décroissant
const boutonDecroissant = document.querySelector(".btn-decroissant");

boutonDecroissant.addEventListener("click", function () {
  const piecesOrdonnees = Array.from(pieces);
  piecesOrdonnees.sort(function (a, b) {
    return b.prix - a.prix;
  });
  document.querySelector(".fiches").innerHTML = "";
  genererPieces(piecesOrdonnees);
});

const noms = pieces.map(piece => piece.nom);
for (let i = pieces.length - 1; i >= 0; i--) {
  if (pieces[i].prix > 35) {
    noms.splice(i, 1);
  }
}
console.log(noms);

//Création de l'en-tête
const pElement = document.createElement("p");
pElement.innerText = "Pièces abordables";
//Création de la liste des pièces abordables
const abordablesElements = document.createElement("ul");
//Ajout de chaque nom à la liste
for (let i = 0; i < noms.length; i++) {
  const nomElement = document.createElement("li");
  nomElement.innerText = noms[i];
  abordablesElements.appendChild(nomElement);
}
// Ajout de l'en-tête puis de la liste au bloc résultats filtres
document
  .querySelector(".abordables")
  .appendChild(pElement)
  .appendChild(abordablesElements);

// Afficher une description des pièces disponibles et de leur prix
const nomsDisponibles = pieces.map(piece => piece.nom);
const prixDisponibles = pieces.map(piece => piece.prix);

for (let i = pieces.length - 1; i >= 0; i--) {
  if (pieces[i].disponibilite === false) {
    nomsDisponibles.splice(i, 1);
    prixDisponibles.splice(i, 1);
  }
}

const disponiblesElement = document.createElement("ul");

for (let i = 0; i < nomsDisponibles.length; i++) {
  const nomElement = document.createElement("li");
  nomElement.innerText = `${nomsDisponibles[i]} - ${prixDisponibles[i]} €`;
  disponiblesElement.appendChild(nomElement);
}

const pElementDisponible = document.createElement("p");
pElementDisponible.innerText = "Pièces disponibles:";
document
  .querySelector(".disponibles")
  .appendChild(pElementDisponible)
  .appendChild(disponiblesElement);

const inputPrixMax = document.querySelector("#prix-max");
inputPrixMax.addEventListener("input", function () {
  const piecesFiltrees = pieces.filter(function (piece) {
    return piece.prix <= inputPrixMax.value;
  });
  document.querySelector(".fiches").innerHTML = "";
  genererPieces(piecesFiltrees);
})

// Ajout du listener pour mettre à jour des données du localStorage
const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener("click", function () {
   window.localStorage.removeItem("pieces");
});

await afficherGraphiqueAvis();