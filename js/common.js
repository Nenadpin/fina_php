const urlParams = new URLSearchParams(window.location.search);
const route = urlParams.get("route");

if (route === "prodaje") {
  const script = document.createElement("script");
  script.src = "./js/pregledProd.js";
  document.body.appendChild(script);
} else if (route === "nabavke") {
  const script = document.createElement("script");
  script.src = "./js/pregledNab.js";
  document.body.appendChild(script);
} else if (route === "nivelacija") {
  const script = document.createElement("script");
  script.src = "./js/pregledNiv.js";
  document.body.appendChild(script);
} else if (route === "artikla") {
  const script = document.createElement("script");
  script.src = "./js/pregledArt.js";
  document.body.appendChild(script);
} else if (route === "refund") {
  const script = document.createElement("script");
  script.src = "./js/pregledRefund.js";
  document.body.appendChild(script);
} else if (route === "trgovacka") {
  const script = document.createElement("script");
  script.src = "./js/trgovacka.js";
  document.body.appendChild(script);
} else if (route === "blagajna") {
  const script = document.createElement("script");
  script.src = "./js/blagajna.js";
  document.body.appendChild(script);
}
