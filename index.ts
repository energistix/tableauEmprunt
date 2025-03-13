import "./index.css";

type Periodicite = "mensuel" | "trimestriel" | "semestriel" | "annuel";

let baseMontant = 0;
let baseTaux = 0;
let baseDuree = 0;
let basePeriodicite: Periodicite = "mensuel";

document.getElementById("montant")?.addEventListener("input", function () {
  baseMontant = parseFloat((<HTMLInputElement>this).value);
  buildTable();
});

document.getElementById("taux")?.addEventListener("input", function () {
  baseTaux = parseFloat((<HTMLInputElement>this).value);
  buildTable();
});

document.getElementById("durée")?.addEventListener("input", function () {
  baseDuree = parseFloat((<HTMLInputElement>this).value);
  buildTable();
});

document.getElementById("periodicite")?.addEventListener("change", function () {
  basePeriodicite = (<HTMLSelectElement>this).value as Periodicite;
  buildTable();
});

function periodiciteMultiplier() {
  switch (basePeriodicite) {
    case "mensuel":
      return 12;
    case "trimestriel":
      return 4;
    case "semestriel":
      return 2;
    case "annuel":
      return 1;
  }
}

function beautifyPeriodicity() {
  switch (basePeriodicite) {
    case "mensuel":
      return "Mensualité";
    case "trimestriel":
      return "Trimestrialité";
    case "semestriel":
      return "Semestrialité";
    case "annuel":
      return "Annuité";
  }
}

function buildTable() {
  console.log("Building table");
  let montant = baseMontant;
  let taux = (1 + baseTaux / 100) ** (1 / periodiciteMultiplier()) - 1;
  let duree = baseDuree * periodiciteMultiplier();
  let tableBody = document.getElementById("tableau-body");
  if (tableBody === null) throw new Error("tableau-body not found");
  //remove all children of tableBody
  tableBody.innerHTML = "";
  let annuitéConstante = (montant * taux) / (1 - (1 + taux) ** -duree);

  const periodDisplay = document.getElementById("periodDisplay");
  if (periodDisplay === null) throw new Error("periodDisplay not found");
  periodDisplay.innerText = `${beautifyPeriodicity()} constante`;

  let totalInteret = 0;
  let totalAmortissement = 0;
  let totalAnnuité = 0;

  for (let currentPeriode = 0; currentPeriode < duree; currentPeriode++) {
    let row = document.createElement("tr");
    let periode = document.createElement("td");
    let capital = document.createElement("td");
    let interet = document.createElement("td");
    let amortissement = document.createElement("td");
    let annuité = document.createElement("td");
    let capitalRestant = document.createElement("td");

    periode.innerText = `${currentPeriode + 1}`;
    capital.innerText = montant.toFixed(2);
    interet.innerText = (montant * taux).toFixed(2);
    totalInteret += montant * taux;
    amortissement.innerText = (annuitéConstante - montant * taux).toFixed(2);
    totalAmortissement += annuitéConstante - montant * taux;
    annuité.innerText = annuitéConstante.toFixed(2);
    totalAnnuité += annuitéConstante;
    capitalRestant.innerText = (
      montant -
      (annuitéConstante - montant * taux)
    ).toFixed(2);

    row.appendChild(periode);
    row.appendChild(capital);
    row.appendChild(interet);
    row.appendChild(amortissement);
    row.appendChild(annuité);
    row.appendChild(capitalRestant);

    tableBody?.appendChild(row);

    montant = montant - (annuitéConstante - montant * taux);
  }

  let row = document.createElement("tr");
  row.id = "total";
  let periode = document.createElement("td");
  let capital = document.createElement("td");
  let interet = document.createElement("td");
  let amortissement = document.createElement("td");
  let annuité = document.createElement("td");
  let capitalRestant = document.createElement("td");

  periode.innerText = "Total";
  capital.innerText = "";
  interet.innerText = totalInteret.toFixed(2);
  amortissement.innerText = totalAmortissement.toFixed(2);
  annuité.innerText = totalAnnuité.toFixed(2);
  capitalRestant.innerText = "";

  row.appendChild(periode);
  row.appendChild(capital);
  row.appendChild(interet);
  row.appendChild(amortissement);
  row.appendChild(annuité);
  row.appendChild(capitalRestant);

  tableBody?.appendChild(row);
}
