import "./index.css";

type Periodicite = "mensuel" | "trimestriel" | "semestriel" | "annuel";
type BaseType = "annuité" | "amortissement";

let baseMontant = 0;
let baseTaux = 0;
let baseDuree = 0;
let basePeriodicite: Periodicite = "mensuel";
let baseType: BaseType = "annuité";

function validateInputAndBuild() {
  const errorElement = document.getElementById("error");
  if (!errorElement) throw new Error("error element not found");
  if (baseMontant <= 0) {
    errorElement.innerText = "Montant doit être supérieur à 0";
    errorElement.style.display = "block";
    return;
  }
  if (baseTaux < 0) {
    errorElement.innerText = "Taux doit être supérieur ou égal à 0";
    errorElement.style.display = "block";
    return;
  }
  if (baseDuree <= 0) {
    errorElement.innerText = "Durée doit être positive";
    errorElement.style.display = "block";
    return;
  }
  errorElement.style.display = "none";
  buildTable();
}

document.getElementById("montant")?.addEventListener("input", function () {
  baseMontant = parseFloat((<HTMLInputElement>this).value);
  validateInputAndBuild();
});

document.getElementById("taux")?.addEventListener("input", function () {
  baseTaux = parseFloat((<HTMLInputElement>this).value);
  validateInputAndBuild();
});

document.getElementById("durée")?.addEventListener("input", function () {
  baseDuree = parseFloat((<HTMLInputElement>this).value);
  validateInputAndBuild();
});

document.getElementById("periodicite")?.addEventListener("change", function () {
  basePeriodicite = (<HTMLSelectElement>this).value as Periodicite;
  validateInputAndBuild();
});

document.getElementById("type")?.addEventListener("change", function () {
  baseType = (<HTMLSelectElement>this).value as BaseType;
  validateInputAndBuild();
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

function getPeriode() {
  switch (basePeriodicite) {
    case "mensuel":
      return "Mois";
    case "trimestriel":
      return "Trimestre";
    case "semestriel":
      return "Semestre";
    case "annuel":
      return "Année";
  }
}

function buildTable() {
  let periodDisplay = document.getElementById("periodDisplay");
  if (!periodDisplay) throw new Error("periodDisplay not found");
  periodDisplay.innerText = `${getPeriode()}`;

  switch (baseType) {
    case "annuité":
      buildTableAnnuité();
      break;
    case "amortissement":
      buildTableAmortissement();
      break;
  }
}

function buildTableAnnuité() {
  console.log("Building table");
  let montant = baseMontant;
  let taux = (1 + baseTaux / 100) ** (1 / periodiciteMultiplier()) - 1;
  console.log(taux);
  let duree = baseDuree * periodiciteMultiplier();
  let tableBody = document.getElementById("tableau-body");
  if (tableBody === null) throw new Error("tableau-body not found");
  //remove all children of tableBody
  tableBody.innerHTML = "";
  let annuitéConstante = (montant * taux) / (1 - (1 + taux) ** -duree);

  const periodicityDisplay = document.getElementById("periodicityDisplay");
  if (periodicityDisplay === null)
    throw new Error("periodicityDisplay not found");
  periodicityDisplay.innerText = `${beautifyPeriodicity()} constante`;

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

function buildTableAmortissement() {
  console.log("Building table");
  let montant = baseMontant;
  let taux = (1 + baseTaux / 100) ** (1 / periodiciteMultiplier()) - 1;
  let duree = baseDuree * periodiciteMultiplier();
  let tableBody = document.getElementById("tableau-body");
  if (tableBody === null) throw new Error("tableau-body not found");
  //remove all children of tableBody
  tableBody.innerHTML = "";

  const periodDisplay = document.getElementById("periodDisplay");
  if (periodDisplay === null) throw new Error("periodDisplay not found");
  periodDisplay.innerText = `${beautifyPeriodicity()}`;

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
    amortissement.innerText = (baseMontant / duree).toFixed(2);
    totalAmortissement += baseMontant / duree;
    annuité.innerText = (baseMontant / duree + montant * taux).toFixed(2);
    totalAnnuité += baseMontant / duree + montant * taux;
    capitalRestant.innerText = (
      montant -
      (baseMontant / duree + montant * taux - montant * taux)
    ).toFixed(2);

    row.appendChild(periode);
    row.appendChild(capital);
    row.appendChild(interet);
    row.appendChild(amortissement);
    row.appendChild(annuité);
    row.appendChild(capitalRestant);

    tableBody?.appendChild(row);

    montant = montant - baseMontant / duree;
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
