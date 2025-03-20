// index.ts
var baseMontant = 0;
var baseTaux = 0;
var baseDuree = 0;
var basePeriodicite = "mensuel";
var baseType = "annuité";
function validateInputAndBuild() {
  const errorElement = document.getElementById("error");
  if (!errorElement)
    throw new Error("error element not found");
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
document.getElementById("montant")?.addEventListener("input", function() {
  baseMontant = parseFloat(this.value);
  validateInputAndBuild();
});
document.getElementById("taux")?.addEventListener("input", function() {
  baseTaux = parseFloat(this.value) || 0;
  validateInputAndBuild();
});
document.getElementById("durée")?.addEventListener("input", function() {
  baseDuree = parseFloat(this.value);
  validateInputAndBuild();
});
document.getElementById("periodicite")?.addEventListener("change", function() {
  basePeriodicite = this.value;
  validateInputAndBuild();
});
document.getElementById("type")?.addEventListener("change", function() {
  baseType = this.value;
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
  if (!periodDisplay)
    throw new Error("periodDisplay not found");
  periodDisplay.innerText = `${getPeriode()}`;
  switch (baseType) {
    case "annuité":
      buildTableAnnuit_();
      break;
    case "amortissement":
      buildTableAmortissement();
      break;
  }
}
function buildTableAnnuit_() {
  console.log("Building table");
  let montant = baseMontant;
  let taux = (1 + baseTaux / 100) ** (1 / periodiciteMultiplier()) - 1;
  console.log(taux);
  let duree = baseDuree * periodiciteMultiplier();
  let tableBody = document.getElementById("tableau-body");
  if (tableBody === null)
    throw new Error("tableau-body not found");
  tableBody.innerHTML = "";
  let annuit_Constante = montant * taux / (1 - (1 + taux) ** -duree);
  if (taux === 0)
    annuit_Constante = montant / duree;
  const periodicityDisplay = document.getElementById("periodicityDisplay");
  if (periodicityDisplay === null)
    throw new Error("periodicityDisplay not found");
  periodicityDisplay.innerText = `${beautifyPeriodicity()} constante`;
  let totalInteret = 0;
  let totalAmortissement = 0;
  let totalAnnuit_ = 0;
  for (let currentPeriode = 0;currentPeriode < duree; currentPeriode++) {
    let row2 = document.createElement("tr");
    let periode2 = document.createElement("td");
    let capital2 = document.createElement("td");
    let interet2 = document.createElement("td");
    let amortissement2 = document.createElement("td");
    let annuit_2 = document.createElement("td");
    let capitalRestant2 = document.createElement("td");
    periode2.innerText = `${currentPeriode + 1}`;
    capital2.innerText = montant.toFixed(2);
    interet2.innerText = (montant * taux).toFixed(2);
    totalInteret += montant * taux;
    amortissement2.innerText = (annuit_Constante - montant * taux).toFixed(2);
    totalAmortissement += annuit_Constante - montant * taux;
    annuit_2.innerText = annuit_Constante.toFixed(2);
    totalAnnuit_ += annuit_Constante;
    capitalRestant2.innerText = (montant - (annuit_Constante - montant * taux)).toFixed(2);
    row2.appendChild(periode2);
    row2.appendChild(capital2);
    row2.appendChild(interet2);
    row2.appendChild(amortissement2);
    row2.appendChild(annuit_2);
    row2.appendChild(capitalRestant2);
    tableBody?.appendChild(row2);
    montant = montant - (annuit_Constante - montant * taux);
  }
  let row = document.createElement("tr");
  row.id = "total";
  let periode = document.createElement("td");
  let capital = document.createElement("td");
  let interet = document.createElement("td");
  let amortissement = document.createElement("td");
  let annuit_ = document.createElement("td");
  let capitalRestant = document.createElement("td");
  periode.innerText = "Total";
  capital.innerText = "";
  interet.innerText = totalInteret.toFixed(2);
  amortissement.innerText = totalAmortissement.toFixed(2);
  annuit_.innerText = totalAnnuit_.toFixed(2);
  capitalRestant.innerText = "";
  row.appendChild(periode);
  row.appendChild(capital);
  row.appendChild(interet);
  row.appendChild(amortissement);
  row.appendChild(annuit_);
  row.appendChild(capitalRestant);
  tableBody?.appendChild(row);
}
function buildTableAmortissement() {
  console.log("Building table");
  let montant = baseMontant;
  let taux = (1 + baseTaux / 100) ** (1 / periodiciteMultiplier()) - 1;
  let duree = baseDuree * periodiciteMultiplier();
  let tableBody = document.getElementById("tableau-body");
  if (tableBody === null)
    throw new Error("tableau-body not found");
  tableBody.innerHTML = "";
  const periodDisplay = document.getElementById("periodDisplay");
  if (periodDisplay === null)
    throw new Error("periodDisplay not found");
  periodDisplay.innerText = `${beautifyPeriodicity()}`;
  let totalInteret = 0;
  let totalAmortissement = 0;
  let totalAnnuit_ = 0;
  for (let currentPeriode = 0;currentPeriode < duree; currentPeriode++) {
    let row2 = document.createElement("tr");
    let periode2 = document.createElement("td");
    let capital2 = document.createElement("td");
    let interet2 = document.createElement("td");
    let amortissement2 = document.createElement("td");
    let annuit_2 = document.createElement("td");
    let capitalRestant2 = document.createElement("td");
    periode2.innerText = `${currentPeriode + 1}`;
    capital2.innerText = montant.toFixed(2);
    interet2.innerText = (montant * taux).toFixed(2);
    totalInteret += montant * taux;
    amortissement2.innerText = (baseMontant / duree).toFixed(2);
    totalAmortissement += baseMontant / duree;
    annuit_2.innerText = (baseMontant / duree + montant * taux).toFixed(2);
    totalAnnuit_ += baseMontant / duree + montant * taux;
    capitalRestant2.innerText = (montant - (baseMontant / duree + montant * taux - montant * taux)).toFixed(2);
    row2.appendChild(periode2);
    row2.appendChild(capital2);
    row2.appendChild(interet2);
    row2.appendChild(amortissement2);
    row2.appendChild(annuit_2);
    row2.appendChild(capitalRestant2);
    tableBody?.appendChild(row2);
    montant = montant - baseMontant / duree;
  }
  let row = document.createElement("tr");
  row.id = "total";
  let periode = document.createElement("td");
  let capital = document.createElement("td");
  let interet = document.createElement("td");
  let amortissement = document.createElement("td");
  let annuit_ = document.createElement("td");
  let capitalRestant = document.createElement("td");
  periode.innerText = "Total";
  capital.innerText = "";
  interet.innerText = totalInteret.toFixed(2);
  amortissement.innerText = totalAmortissement.toFixed(2);
  annuit_.innerText = totalAnnuit_.toFixed(2);
  capitalRestant.innerText = "";
  row.appendChild(periode);
  row.appendChild(capital);
  row.appendChild(interet);
  row.appendChild(amortissement);
  row.appendChild(annuit_);
  row.appendChild(capitalRestant);
  tableBody?.appendChild(row);
}
validateInputAndBuild();
