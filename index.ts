import "./index.css";
import jspdf, { jsPDF } from "jspdf";

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
  baseTaux = parseFloat((<HTMLInputElement>this).value) || 0;
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
  if (taux === 0) annuitéConstante = montant / duree;

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

  const periodicityDisplay = document.getElementById("periodicityDisplay");
  if (periodicityDisplay === null)
    throw new Error("periodicityDisplay not found");
  periodicityDisplay.innerText = `${beautifyPeriodicity()}`;

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

validateInputAndBuild();

function buildInfoTable() {
  // Create a new table element
  const infoTable = document.createElement("table");
  infoTable.id = "info-table";
  infoTable.classList.add("tableau");

  // Create table headers
  const headers = ["Paramètre", "Valeur"];
  const headerRow = document.createElement("tr");
  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.innerText = headerText;
    headerRow.appendChild(th);
  });
  infoTable.appendChild(headerRow);

  // Create table rows for each input value
  const inputValues = [
    { name: "Montant", value: baseMontant },
    { name: "Taux", value: baseTaux },
    { name: "Durée", value: baseDuree },
    { name: "Périodicité", value: basePeriodicite },
    { name: "Type", value: baseType + " constante" },
  ];

  inputValues.forEach((input) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.innerText = input.name;
    row.appendChild(nameCell);

    const valueCell = document.createElement("td");
    valueCell.innerText = input.value.toString();
    row.appendChild(valueCell);

    infoTable.appendChild(row);
  });

  // Return the constructed table element
  return infoTable;
}

document.getElementById("export")?.addEventListener("click", () => {
  const exportFormatSelect = document.getElementById(
    "export-format"
  ) as HTMLSelectElement | null;
  if (exportFormatSelect === null)
    throw new Error("export format selector not found");

  switch (exportFormatSelect.value) {
    case "md":
      exportMarkdown();
      break;
    case "pdf":
      exportPDF();
      break;
  }
});

function exportPDF() {
  let tableBody = document.getElementById("tableau");
  if (tableBody === null) throw new Error("tableau not found");

  let exportElement = document.createElement("div");
  exportElement.appendChild(buildInfoTable());
  exportElement.appendChild(tableBody);

  // @ts-ignore
  const doc = new jsPDF();
  doc.html(exportElement, {
    callback: function (doc) {
      doc.save();
      document.body.appendChild(tableBody);
    },
    x: 1,
    y: 1,
    width: 65,
    windowWidth: 200,
    autoPaging: "text",
  });
}

function exportMarkdown() {
  // Generate Markdown content for user inputs
  let infoMarkdown = "## Paramètres \n\n";
  infoMarkdown += "| Paramètre | Valeur |\n";
  infoMarkdown += "|-----------|--------|\n";

  const inputValues = [
    { name: "Montant", value: baseMontant },
    { name: "Taux", value: baseTaux },
    { name: "Durée", value: baseDuree },
    { name: "Périodicité", value: basePeriodicite },
    { name: "Type", value: baseType + " constante" },
  ];

  inputValues.forEach((input) => {
    infoMarkdown += `| ${input.name} | ${input.value} |\n`;
  });

  // Generate Markdown content for calculated data
  let dataMarkdown = "## Valeurs calculés\n\n";
  dataMarkdown +=
    "| Période | Capital | Intérêt | Amortissement | Annuité | Capital Restant |\n";
  dataMarkdown +=
    "|---------|---------|---------|---------------|---------|-----------------|\n";

  const tableBody = document.getElementById("tableau-body");
  if (tableBody) {
    const rows = tableBody.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName("td");
      let rowMarkdown = "|";
      for (let j = 0; j < cells.length; j++) {
        rowMarkdown += ` ${cells[j].innerText} |`;
      }
      dataMarkdown += rowMarkdown + "\n";
    }
  }

  // Combine both tables into a single Markdown content
  const markdownContent = infoMarkdown + "\n\n" + dataMarkdown;

  // Create a Blob and trigger download
  const blob = new Blob([markdownContent], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "loan_calculation.md";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
