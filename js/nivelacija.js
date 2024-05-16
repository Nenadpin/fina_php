const lista = document.getElementById("list");
const prodId = document.getElementById("prodId");
const prodName = document.getElementById("prodName");
const prodPrice = document.getElementById("prodPrice");
const prodNewPrice = document.getElementById("prodNewPrice");
const prodKol=document.getElementById('prodKol');
const operation = document.getElementById("operation");
const totalSum = document.getElementById("total");
const ord = document.getElementById("orderSubmit");
const ordDate = document.getElementById("orderDate");

let filteredData = [];
let orderData = [];
let total = 0;
let singleArt;

operation.style.visibility = "visible";
const start = async () => {
  const allData = await allProducts();
  filteredData = allData;
};
start();

const submit = () => {
  orderData.push({
    id: Number(prodId.value),
    naziv: prodName.value,
    prodajna_cena: Number(prodPrice.value),
    lager: Number(prodKol.value),
    nova_cena: Number(prodNewPrice.value),
    total:
      (Number(prodNewPrice.value) - Number(prodPrice.value)) * Number(prodKol.value),
  });
  total +=
    (Number(prodNewPrice.value) - Number(prodPrice.value)) *
    Number(prodKol.value);
  lista.innerText = displayNivData(orderData);
  totalSum.innerText = total;
  prodId.value = "";
  prodName.value = "";
  prodPrice.value = "";
  prodNewPrice.value = "";
  prodId.focus();
  singleArt = null;
};

prodId.addEventListener("blur", () => {
  singleArt = findArt(parseInt(prodId.value));
  if (singleArt) {
    prodName.value = singleArt.naziv;
    prodPrice.value = singleArt.prodajna_cena;
    prodKol.value=singleArt.lager
    prodName.disabled = true;
    //prodPrice.disabled = parseInt(singleArt.lager) > 0 ? true : false;
    prodNewPrice.focus();
  }
});

prodNewPrice.addEventListener("keyup", (key) => {
  if (key.code === "Enter" || key.code === "NumpadEnter" || key.key === "Enter")
    submit();
});

lista.addEventListener("click", () => deleteItem());

ord.addEventListener("click", () => {
  if (window.confirm("Upisujemo podatke u bazu?") && ordDate.value)
    submitNiv(orderData, total, ordDate.value);
  else alert("Niste izabrali datum ili jer prazna lista stavki!");
});
