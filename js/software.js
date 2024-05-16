const products = document.getElementById("products");
const lista = document.getElementById("list");
const prodId = document.getElementById("prodId");
const prodName = document.getElementById("prodName");
const prodPrice = document.getElementById("prodPrice");
const prodQty = document.getElementById("prodQty");
const operation = document.getElementById("operation");
const totalSum = document.getElementById("total");
const fileSelector = document.getElementById("bulk");
const trgovacka=document.getElementById('trgovacka')

let filteredData = []
let sellData = {};
let jsonData;
let transakcija, brojano;

const loadData = async () => {
  fileSelector.click();
};

const viewProducts = async () => {
  const allData = await allProducts();
  filteredData = allData;
  const stock = allData.reduce(
    (acc, cur) => (acc += cur.lager * cur.prodajna_cena),
    0
  );
  const joinedData = displayData(allData);
  lista.innerText = joinedData;
  totalSum.innerText = stock;
  operation.style.visibility = "visible";
};

const filterId = () => {
  const id = parseInt(prodId.value);
  if (filteredData.length && id) {
    const tempData = filteredData.filter((d) => d.id >= id);
    lista.innerText = displayData(tempData);
  }
};
const filterName = () => {
  const name = prodName.value.toUpperCase();
  const price = prodPrice.value ? parseInt(prodPrice.value) : 0;
  const qty = parseInt(prodQty.value);
  if (filteredData.length && name) {
    let tempData;
    if (qty)
      tempData = filteredData.filter(
        (d) =>
          d.naziv.toUpperCase().includes(name) &&
          parseInt(d.prodajna_cena) >= price &&
          d.lager >= qty
      );
    else
      tempData = filteredData.filter(
        (d) =>
          d.naziv.toUpperCase().includes(name) &&
          parseInt(d.prodajna_cena) >= price
      );

    tempData = sortName(tempData);
    lista.innerText = displayData(tempData);
  }
};
const filterPrice = () => {
  const name = prodName.value.toUpperCase();
  const price = parseInt(prodPrice.value);
  const qty = parseInt(prodQty.value);
  if (filteredData.length && prodPrice.value) {
    let tempData;
    if (qty)
      tempData = filteredData.filter(
        (d) =>
          d.prodajna_cena >= price && d.naziv.includes(name) && d.lager >= qty
      );
    else
      tempData = filteredData.filter(
        (d) => d.prodajna_cena >= price && d.naziv.includes(name)
      );
    tempData = sortPrice(tempData);
    lista.innerText = displayData(tempData);
  }
};
const filterQty = () => {
  const name = prodName.value.toUpperCase();
  const price = prodPrice.value ? parseInt(prodPrice.value) : 0;
  const qty = parseInt(prodQty.value);
  if (qty && filteredData.length) {
    let tempData = filteredData.filter(
      (d) =>
        d.lager >= qty &&
        d.naziv.includes(name) &&
        parseInt(d.prodajna_cena) >= price
    );
    if (name) tempData = sortName(tempData);
    lista.innerText = displayData(tempData);
  } else if (filteredData.length && !qty) {
    const tempData = filteredData.filter((d) => d.lager !== 0);
    lista.innerText = displayData(tempData);
  }
};

const handleFileSelect = async (event) => {
  const fileInput = event.target;
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    const readAsText = () => {
      return new Promise((resolve, reject) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e.target.error);
        reader.readAsText(file);
      });
    };
    try {
      const fileContent = await readAsText();
      const jsonData = JSON.parse(fileContent);
      for (let i = 0; i < jsonData.length; i++) {
        const currentItem = jsonData[jsonData.length - 1 - i];
        const dateKey = currentItem.SDCTime_ServerTimeZone.substring(0, 10);
        if (currentItem.InvoiceType === "Промет") {
          sellData[dateKey] = sellData.hasOwnProperty(dateKey)
            ? {
                items: [...sellData[dateKey].items, ...currentItem.Items],
                total: sellData[dateKey].total + currentItem.TotalAmount,
              }
            : {
                items: [...currentItem.Items],
                total: currentItem.TotalAmount,
              };
        }
      }
      transakcija =
        jsonData[0].TransactionType === "Рефундација"
          ? "Refundacija"
          : "Prodaja";
      lista.innerText = `Učitan je spisak ${transakcija} za period: ${jsonData[0].SDCTime_ServerTimeZone.substring(
        0,
        10
      )} - ${jsonData[jsonData.length - 1].SDCTime_ServerTimeZone.substring(
        0,
        10
      )}`;
      document.getElementById("upload").style.visibility = "visible";
      lista.style.visibility = "visible";
    } catch (error) {
      console.error("Error parsing JSON file:", error.message);
    }
  }
};

fileSelector.addEventListener("change", async (event) => {
  await handleFileSelect(event);
});
products.addEventListener("click", viewProducts);
prodId.addEventListener("blur", filterId);
prodName.addEventListener("blur", filterName);
prodPrice.addEventListener("blur", filterPrice);
prodQty.addEventListener("blur", filterQty);

