const allProducts = async () => {
  try {
    const responseb = await fetch("brojano.json");
    brojano = await responseb.json();
    const response = await fetch(
      "./includes/get_start_data.php?tableName=proizvodi"
    );
    const responseData = await response.json();
    if (responseData.error) {
      console.error("Server error:", responseData.error);
    } else {
      return responseData;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Server error, ne mogu se ucitati proizvodi...");
  }
};

const allSuppliers=async()=>{
  try {
    const response = await fetch(
      "./includes/get_suppliers.php?operation=spisak"
    )
    const responseData = await response.json();
    if (responseData.error) {
      console.error("Server error:", responseData.error);
    } else {
      return responseData;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Server error, ne mogu se ucitati dobavljaci...");
  }
}

const blagajnaData = async()=>{
  try {
    const response = await fetch(
      "./includes/get_suppliers.php?operation=blagajna"
    )
    const responseData = await response.json();
    if (responseData.error) {
      console.error("Server error:", responseData.error);
    } else {
      return responseData;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Server error, ne mogu se ucitati podaci...");
  }
}

const displayData = (data) => {
  const joinedData = data
    .map(
      (item) =>
        `${item.id.toString().padStart(4, " ")} ${item.naziv.padEnd(
          38,
          " "
        )} ${item.prodajna_cena.toString().padStart(8, " ")} ${item.lager
          .toString()
          .padStart(6, " ")}      ${brojano[item.id] ? brojano[item.id].lager : "-"}`
    )
    .join("\n");
  return joinedData;
};
const displayOperationData = (data) => {
  const joinedData = data.map(
      (item,key) =>
        `${(key+1).toString().padStart(2,' ')}.${item.id.toString().padStart(5, " ")} ${item.naziv.substring(0,30).padEnd(
          30,
          " "
        )} ${item.prodajna_cena.toString().padStart(8, " ")} ${item.lager
          .toString()
          .padStart(6, " ")}  ${item.total.toString().padStart(8, " ")}`
    )
    .join("\n");
  return joinedData;
};
const displayNivData = (data) => {
  const joinedData = data
    .map(
      (item, key) =>
        `${(key+1).toString().padStart(2,' ')}.${item.id.toString().padStart(5, " ")} ${item.naziv.padEnd(
          30,
          " "
        )} ${item.prodajna_cena.toString().padStart(8, " ")} ${item.nova_cena
          .toString()
          .padStart(6, " ")}  ${item.total.toString().padStart(6, " ")}(${
          item.lager
        })`
    )
    .join("\n");
  return joinedData;
};

const findArt = (id) => {
  const art = filteredData.find((d) => d.id === id);
  if (art) return art;
};
const submitOrder = async (data, sum, date, opis,suppl,valuta,dug) => {
  const password = prompt("Lozinka za upis podataka?");
  const formData = {
    total: sum,
    dateOfOrder: date,
    ordData: data,
    opis: opis,
    dobavljac:suppl,
    valDate:valuta,
    password: password,
    dug:dug
  };
  try {
    const response = await fetch("./includes/order.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (response.status === 200) {
      alert("Primljeno!");
      window.location.reload();
    } else if (response.status === 501)
      alert("Greska pri upisivanju podataka...");
      else if (response.status===401) alert ('Pogresna lozinka!')
  } catch (error) {
    alert(error.message);
  }
};
const submitSell = async (data, sum, date) => {
  const password = prompt("Lozinka za upis podataka?");
  const formData = {
    total: sum,
    dateOfSell: date,
    sellData: data,
    password: password
  };
  try {
    const response = await fetch("./includes/sell.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (response.status === 200) {
      alert("Primljeno!");
      window.location.reload();
    } else if (response.status === 501)
      alert("Greska pri upisivanju podataka...");
      else if (response.status===401)
      alert ('Pogresna lozinka!')
  } catch (error) {
    alert(error.message);
  }
};
const uploadData = async () => {
  const password = prompt("Lozinka za upis podataka?");
  document.getElementById('modal').style.display='block'

  try {
    let bulkData={...sellData,password:password}
    const response =
      transakcija === "Prodaja"
        ? await fetch("./includes/bulk_sell.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bulkData),
          })
        : await fetch("./includes/bulk_refund.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bulkData),
          });
    if (response.status === 200) {
      const responseResult = await response.json();
      responseResult.row
      alert(`Upisano je ${responseResult} podataka...!`);
      window.location.reload();
    } else if (response.status === 501)
      alert("Greska pri upisivanju podataka...");
      else if(response.status===401) alert ('Pogresna lozinka!')
  } catch (error) {
    alert(error.message);
  }
};
const submitNiv = async (data, sum, date) => {
  const password = prompt("Lozinka za upis podataka?");
  const formData = {
    total: sum,
    dateOfOrder: date,
    ordData: data,
    password: password
  };
  try {
    const response = await fetch("./includes/niv.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (response.status === 200) {
      alert("Primljeno!");
      window.location.reload();
    } else if (response.status === 501)
      alert("Greska pri upisivanju podataka...");
      else if(response.status===401)
      alert('Pogresna lozinka!')
  } catch (error) {
    alert(error.message);
  }
};
const displayDetails = (i) => {
  const promet_details = JSON.parse(displayList[i - 1].promet);
  if (!promet_details[0].nova_cena) {
    const joinedData = promet_details
      .map(
        (item) =>
          `${item.id.toString().padStart(5, " ")} ${item.naziv.padEnd(
            40,
            " "
          )} ${item.prodajna_cena.toString().padStart(8, " ")} ${item.lager
            .toString()
            .padStart(8, " ")}`
      )
      .join("\n");
    return joinedData;
  } else {
    const joinedData = promet_details
      .map(
        (item) =>
          `${item.id.toString().padStart(5, " ")} ${item.naziv.padEnd(
            40,
            " "
          )} ${item.prodajna_cena.toString().padStart(8, " ")} ${item.nova_cena
            .toString()
            .padStart(8, " ")} (${item.lager})`
      )
      .join("\n");
    return joinedData;
  }
};
const sortName = (data) => {
  return data.sort((a, b) => {
    if (a.naziv.toUpperCase() < b.naziv.toUpperCase()) {
      return -1;
    } else return 1;
  });
};
const sortPrice = (data) => {
  return data.sort((a, b) => {
    if (parseInt(a.prodajna_cena) < parseInt(b.prodajna_cena)) {
      return -1;
    } else return 1;
  });
};
const trgKnjiga=async()=>{
  try {
    const response = await fetch(
      "./includes/trgovacka.php"
    );
    const responseData = await response.json();
    if (responseData.error) {
      console.error("Server error:", responseData.error);
    } else {
      return responseData;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Server error, ne mogu se ucitati podaci...");
  }
}
const deleteItem = () => {
  const deleted = Number(prompt('Brisanje iz liste stavke br:...?'))
  if (deleted>0){
    total -= orderData[deleted-1].total;
    totalSum.innerText = parseInt(totalSum.innerText)-orderData[deleted-1].total;
    orderData.splice(deleted-1,1)
    lista.innerText = displayOperationData(orderData);
  }
};
