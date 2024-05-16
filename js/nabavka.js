const lista = document.getElementById("list");
const prodId = document.getElementById("prodId");
const prodName = document.getElementById("prodName");
const prodPrice = document.getElementById("prodPrice");
const prodQty = document.getElementById("prodQty");
const operation = document.getElementById("operation");
const totalSum = document.getElementById("total");
const ord = document.getElementById("orderSubmit");
const ordDate = document.getElementById("orderDate");
const valutaDate=document.getElementById('valuta')
const newSupplier=document.getElementById('noviD')
const selectSupp=document.getElementById('dobavljaci')
const zaduzi=document.getElementById('zaduzenje')


let filteredData = [];
let orderData = [];
let total = 0;

operation.style.visibility = "visible";

const start = async () => {
  const allData = await allProducts();
  filteredData = allData;
  const suppliers = await allSuppliers();
  if (suppliers?.length){
    suppliers.forEach(supp => {
      let option = document.createElement('option');
      option.value = supp.dobavljac;
      option.textContent = supp.dobavljac;
      selectSupp.appendChild(option);
  });
  }
  let option = document.createElement('option');
  option.value = 'novi';
  option.textContent = 'Novi dobavljac';
  selectSupp.appendChild(option);
}

selectSupp.addEventListener('change',(e)=>{
  console.log(e.target.value)
  if(e.target.value==='novi') newSupplier.style.display='block'
  else newSupplier.style.display=''
})

const populateList=async()=>{
  if(sessionStorage.getItem('corection')){
    const password = prompt("Lozinka za upis podataka?");
    const temp=JSON.parse(sessionStorage.getItem('corection'))
    let request={id: temp.id,
                total:temp.total,
                dateOfOrder:temp.datum.split('.').reverse().join('-'),
                orderData:JSON.parse(temp.promet),
                password:password}
    try {
      const response = await fetch(`./includes/update_order.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })
      if (response.status===200){
        sessionStorage.removeItem('corection')
        document.getElementById('orderDate').value=request.dateOfOrder
        totalSum.innerText=request.total
        document.getElementById('opis').value=temp.opis.split(':')[1].trim()
        orderData=request.orderData.map((t)=>{
          return {...t,total: t.lager*t.prodajna_cena}
        })
        lista.innerText = displayOperationData(orderData);
        document.getElementById('orderTitle').innerText='ISPRAVKA '+document.getElementById('orderTitle').innerText
    }
    } catch (error) {
      alert(error.message)
    }
}
}

start();
populateList()

const submit = () => {
  orderData.push({
    id: Number(prodId.value),
    naziv: prodName.value,
    prodajna_cena: Number(prodPrice.value),
    lager: Number(prodQty.value),
    total: Number(prodPrice.value) * Number(prodQty.value),
  });
  total += Number(prodPrice.value) * Number(prodQty.value);
  lista.innerText = displayOperationData(orderData);
  totalSum.innerText = total;
  prodId.value = "";
  prodName.value = "";
  prodPrice.value = "";
  prodQty.value = "";
  prodId.focus();
};

prodId.addEventListener("blur", () => {
  const singleArt = findArt(parseInt(prodId.value));
  if (singleArt) {
    prodName.value = singleArt.naziv;
    prodPrice.value = singleArt.prodajna_cena;
    prodName.disabled = true;
    //prodPrice.disabled = parseInt(singleArt.lager) > 0 ? true : false;
    prodQty.focus();
  } else if (parseInt(prodId.value)) {
    prodName.disabled = false;
    prodPrice.disabled = false;
    prodName.focus();
  }
});


prodQty.addEventListener("keyup", (key) => {
  if (key.code === "Enter" || key.code === "NumpadEnter" || key.key === "Enter")
    submit();
});

lista.addEventListener("click", () => deleteItem());

ord.addEventListener("click", () => {
  if(!newSupplier.value&&selectSupp.value==='novi'){
    alert('Morate uneti naziv dobavljaca...')
    newSupplier.focus()
    return
  }
  if (window.confirm("Upisujemo podatke u bazu?") && ordDate.value&&selectSupp.value&&zaduzi.value) {
    const opis = `Kalkulacija br: ${document.getElementById("opis").value}`;
    const dobavljac=selectSupp.value!=='novi'?selectSupp.value:newSupplier.value
    const dug=Number(zaduzi.value.replace(',','.'))
    submitOrder(orderData, total, ordDate.value, opis,dobavljac,valutaDate.value, dug);
  } else alert("Niste izabrali datum ili jer prazna lista stavki!");
});
