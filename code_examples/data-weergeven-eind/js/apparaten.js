// Hier worden de ingeladen apparaten uit de JSON file opgeslagen
let apparaten = [];

// Deze functie is de start
const startCalculator = () => {
  // Inladen van JSON bestand
  laadJSON("apparaten.json");
};

const laadJSON = (url) => {
  // het XMLHttpRequest object maken
  const aanvraag = new XMLHttpRequest();

  // omschrijf wat er moet gebeuren ALS je de data succesvol binnen hebt
  aanvraag.onreadystatechange = () => {
    if (aanvraag.readyState === 4 && aanvraag.status === 200) {
      let jsonText = aanvraag.responseText;

      // Ze de JSON tekst om in een Javascript array met JSON.parse()
      // Sla het resultaat op in de variabele: apparaten
      apparaten = JSON.parse(jsonText);

      // Roep de toonApparaten() function aan om alles te tonen
      toonApparaten();
    }
  };

  // serveraanvraag specificeren
  aanvraag.open("GET", url, true);

  // aanvraag versturen
  aanvraag.send();
};

const toonApparaten = () => {
  //  Sla alle div's met de class "appraat" iop in de variabele containerDivs
  const apparaatDivs = document.querySelectorAll(".apparaat");

  // Gebruik een forEach loop om elk aparaat div te verwerken
  apparaatDivs.forEach((apparaatDiv) => {
    // Haal de code van het apparaat op uit het attribuut "data-id"
    const code = apparaatDiv.attributes["data-id"].value;

    // Zoek met deze het appraat op in de ingeladen appraten (uit het JSON bestand)
    const apparaat = apparaten.find((value) => {
      return value.code === code;
    });

    // Zet alle benodigde informatie in een zelfgemaakt object
    let data = {
      container: apparaatDiv, // De verwijzing het div element
      apparaat: apparaat, // De apparaatgegevens
      weergave: "kosten", // Welke weergave je standaard wilt
      prijs_kwh: 0.2, // De prijs voor 1 KwH electriciteit
    };

    // Geef het data object aan de maakWidget function.
    maakWidget(data);
  });
};

const maakWidget = (data) => {
  // Nu gaan we de data gebruiken om alles in te vullen

  // De div uit het data object halen en in eigen variabele zetten voor het gemak
  const apparaatDiv = data.container;

  // Eerst alle HTML elementen ophalen uit de container div
  const slider = apparaatDiv.querySelector("input");
  const minuten = apparaatDiv.querySelector("span");
  const knop = apparaatDiv.querySelector("button");

  // Achtergrond afbeelding zetten
  apparaatDiv.style.backgroundImage = `url(${data.apparaat.image})`;

  slider.addEventListener("input", (event) => {
    minuten.innerHTML = slider.value;
    updateGegevens(data);
  });

  knop.addEventListener("click", () => {
    if (knop.innerText === "Toon verbruik") {
      data.weergave = "verbruik";
      knop.innerText = "Toon kosten";
    } else {
      data.weergave = "kosten";
      knop.innerText = "Toon verbruik";
    }
    updateGegevens(data);
  });

  updateGegevens(data);
};

const updateGegevens = (data) => {
  // De div uit het data object halen en in eigen variabele zetten voor het gemak
  const apparaatDiv = data.container;

  // De afzonderlijke elementen ophalen
  const titel = apparaatDiv.querySelector("h1");
  const nummer = apparaatDiv.querySelector("h2");
  const slider = apparaatDiv.querySelector("input");

  // Nu gegevens invullen van het apparaat!
  titel.innerHTML = data.apparaat.naam;

  // Aantal minuten uitlezen
  const minutenPerDag = parseInt(slider.value);

  if (data.weergave === "kosten") {
    let jaarlijkseKosten = berekenJaarKosten(
      minutenPerDag,
      data.apparaat.vermogen
    );
    nummer.innerHTML = "€ " + jaarlijkseKosten + " per jaar";
  } else {
    let jaarlijksVerbruik = berekenJaarVerbruik(
      minutenPerDag,
      data.apparaat.vermogen
    );
    nummer.innerHTML = jaarlijksVerbruik + " KwH";
  }
};

const berekenJaarVerbruik = (minuten_per_dag, vermogen) => {
  const minutenPerJaar = minuten_per_dag * 365;
  const urenPerJaar = minutenPerJaar / 60;
  const wattPerJaar = urenPerJaar * vermogen;
  const kwhPerJaar = wattPerJaar / 1000;

  return kwhPerJaar.toFixed(2);
};

const berekenJaarKosten = (minuten_per_dag, vermogen) => {
  const prijsPerKwH = 0.2;
  const kwhPerJaar = berekenJaarVerbruik(minuten_per_dag, vermogen);
  const price = kwhPerJaar * prijsPerKwH;

  return price.toFixed(2);
};

//Hier begint alles.
window.addEventListener("DOMContentLoaded", startCalculator);