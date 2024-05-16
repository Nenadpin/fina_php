const lista = document.getElementById("list");
const prodId = document.getElementById("prodId");
const prodName = document.getElementById("prodName");
const prodPrice = document.getElementById("prodPrice");
const prodQty = document.getElementById("prodQty");
const operation = document.getElementById("operation");
const totalSum = document.getElementById("total");
const ord = document.getElementById("orderSubmit");
const ordDate = document.getElementById("orderDate");
const popis = document.getElementById("popis");
let product = false,
  qty = false;

let filteredData = [];
let orderData = [];
let total = 0;

const submit = () => {
  if (product && qty) {
    orderData.push({
      id: parseInt(prodId.value),
      naziv: prodName.value,
      prodajna_cena: parseInt(prodPrice.value),
      lager: parseInt(prodQty.value),
      total: parseInt(prodPrice.value) * parseInt(prodQty.value),
    });
    total += parseInt(prodPrice.value) * parseInt(prodQty.value);
    lista.innerText = displayOperationData(orderData);
    totalSum.innerText = total;
    prodId.value = "";
    prodName.value = "";
    prodPrice.value = "";
    prodQty.value = "";
    prodId.focus();
    product = false;
    qty = false;
  }
};
operation.style.visibility = "visible";
popis.style.visibility='hidden'
document.getElementById("ucitaj").style.visibility='hidden'


const start = async () => {
  const allData = await allProducts();
  filteredData = allData;
  if (localStorage.getItem("popis")) {
    orderData = JSON.parse(localStorage.getItem("popis"));
    lista.innerText = displayOperationData(orderData);
  }
};
start();
// document
//   .getElementById("ucitaj")
//   .addEventListener(
//     "click",
//     () => (lista.innerText = displayOperationData(orderData))
//   );

prodId.addEventListener("blur", () => {
  const singleArt = findArt(parseInt(prodId.value));
  if (singleArt) {
    prodName.value = singleArt.naziv;
    prodPrice.value = singleArt.prodajna_cena;
    prodName.disabled = true;
    prodPrice.disabled = parseInt(singleArt.lager) > 0 ? true : false;
    prodQty.focus();
    product = true;
  }
});
const upisi = () => {
  let temp;
  if (localStorage.getItem(popis)) {
    temp = JSON.parse(localStorage.getItem("popis"));
    temp += [...temp, ...orderData];
  } else temp = [...orderData];
  localStorage.setItem("popis", JSON.stringify(temp));
  alert("Upisano u memoriju");
  window.location.reload();
};

prodQty.addEventListener("keyup", (key) => {
  if (
    (key.code === "Enter" ||
      key.code === "NumpadEnter" ||
      key.key === "Enter") &&
    parseFloat(prodQty.value)
  ) {
    qty = true;
    submit();
  }
});
popis.addEventListener("click", () => upisi());

lista.addEventListener("click", () => deleteItem());

ord.addEventListener("click", () => {
  if (window.confirm("Upisujemo podatke u bazu?") && ordDate.value)
    submitSell(orderData, total, ordDate.value);
  else alert("Niste izabrali datum ili jer prazna lista stavki!");
});
