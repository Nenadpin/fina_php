const title = document.getElementById("pregledTitle");
title.innerText += " BLAGAJNE";
const lista = document.getElementById("list");
const details = document.getElementById("listDetails");
const listaObaveza=document.getElementById('obaveze')
document.getElementById('correctOrder').style.display='none'
document.getElementById('blagajna').style.display='block'
document.getElementById('correctOrder').innerText='Zaduzi!'

let dataSupp=''
let obaveze = [];
let suppliers={}


const start = async ()=>{
    const sad=new Date()
    const allData = await blagajnaData();
    allData.forEach(el => {
        if(suppliers[el.dobavljac]){
            suppliers[el.dobavljac].promet.push({datum: el.datum, duguje:el.duguje, placeno:el.placeno})
            suppliers[el.dobavljac].stanje+=(el.placeno-el.duguje)
        }else{
            suppliers[el.dobavljac]={
              promet:[{datum: el.datum, duguje:el.duguje, placeno:el.placeno}],
              stanje: el.placeno-el.duguje
            }
        }
        if(el.duguje!==el.placeno){
            obaveze.push({id: el.id, datum: new Date(el.datum),dobavljac:el.dobavljac,iznos:el.duguje-el.placeno})
        }
    });
   for (let supp in suppliers) {
        const newItem = document.createElement("li");
        newItem.textContent = supp
        lista.appendChild(newItem);
      };
    obaveze.sort((x,y)=>y.datum-x.datum)
    for(let i=0; i<obaveze.length;i++){
      const newObaveza=document.createElement('li')
      newObaveza.textContent=obaveze[i].id.toString().padEnd(5,' ')+obaveze[i].datum.toLocaleDateString().padEnd(10,' ')+' - '+ obaveze[i].dobavljac.padEnd(15,' ')+' : '+ obaveze[i].iznos+' din'
      if(obaveze[i].datum<sad) newObaveza.style.color='red'
      listaObaveza.appendChild(newObaveza)
  }
}
start()

lista.addEventListener("click", (e) => {
    dataSupp=e.target.textContent.trim()
    if(suppliers[dataSupp].promet.length){
      document.getElementById('correctOrder').style.display='block'
      document.getElementById('extra').style.display='block'
      document.getElementById('preord').style.display='block'
        let t=''
        for (let i=suppliers[dataSupp].promet.length-1;i>=0;i--){
            t+=`datum: ${suppliers[dataSupp].promet[i].datum},    duguje: ${suppliers[dataSupp].promet[i].duguje},    placeno: ${suppliers[dataSupp].promet[i].placeno}\n`
        }
        details.innerText = t;
    }
  });

  listaObaveza.addEventListener("click", async(e) => {
    const data=parseInt(e.target.textContent.split(" ")[0])
    const valuta=e.target.textContent.substring(5,16).trim()
    const suppName=e.target.textContent.substring(18,34).trim()
    const iznos = prompt(`Iznos koji se placa dobavljacu ${suppName} za fakturu od: ${valuta}?`);
    if(Boolean(iznos)) await paySupp(data,iznos)
  });

  const paySupp=async(data,iznos)=>{
    const formData = {
      id:data,
      iznos: parseFloat(iznos),
    };

    try {
      const response = await fetch("./includes/pay.php", {
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
    } catch (error) {
      alert(error.message);
    }
  }

  const buySupp=async()=>{
    const iznos = prompt(`Iznos fakture dobavljaca ${dataSupp}?`);
    const today=new Date()
    const formData = {
      iznos: iznos,
      paymentDate: document.getElementById('preord').value,
      dobavljac: dataSupp,
    };
    if (Boolean(formData.iznos)&&Boolean(formData.paymentDate)){
        console.log(formData)
    try {
      const response = await fetch("./includes/pre_order.php", {
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
    } catch (error) {
      alert(error.message);
    }
  }
  }

  document.getElementById('correctOrder').addEventListener('click',buySupp)

