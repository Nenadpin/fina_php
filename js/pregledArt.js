const title = document.getElementById("pregledTitle");
let objArt = {};
title.innerHTML += ` Artikla<input id='art'/> <span id='objNaziv'></span>`;
const artNaziv = document.getElementById("objNaziv");
const lista = document.getElementById("list");
const details = document.getElementById("details");
let displayList = [];
details.style.display = "none";
const art = document.getElementById("art");
const artDate=document.getElementById('artDate')

art.focus();
document.getElementById('navArt').style.display='block'
lista.style.width = "90vw";
lista.style.fontSize = "1rem";

const getArt = async (id) => {
  const data = await allProducts();
  const artList = await fetch(`./includes/get_start_data.php?id=${id}`);
  displayList = await artList.json();
  objArt = data.find((art) => art.id === id);
  if (objArt.naziv) artNaziv.innerText = `${objArt.naziv} cena: ${objArt.prodajna_cena} din  lager: ${objArt.lager} kom`;
};

art.addEventListener("keyup", async (key) => {
  let sell = 0,
    order = 0;
  lista.innerText = "";
  if (
    key.code === "Enter" ||
    key.code === "NumpadEnter" ||
    key.key === "Enter"
  ) {
    await getArt(parseInt(art.value));
    let stanje=objArt.lager
    if (displayList.length) {
      displayList.map((ord, index) => {
        const newItem = document.createElement("p");
        if (ord.prodaja&&ord.datum<artDate.value) {
          newItem.textContent = `${
            index + 1
          }. Prodaja na dan: ${ord.datum.substring(0, 10)}       ${
            ord.prodaja
          } kom`;
          lista.appendChild(newItem);
          sell += ord.prodaja;
        }else if (ord.prodaja&&ord.datum>=artDate.value){
          stanje+=ord.prodaja
        } else if (ord.nabavka&&ord.datum<artDate.value){
          newItem.textContent = `${
            index + 1
          }. Nabavka na dan: ${ord.datum.substring(
            0,
            10
          )}                     ${ord.nabavka} kom`;
          lista.appendChild(newItem);
          order += ord.nabavka;
        }else if (ord.nabavka&&ord.datum>=artDate.value){
          stanje-=ord.nabavka
        }else if (ord.refund&&ord.datum<artDate.value){
          newItem.textContent = `${
            index + 1
          }. Povracaj na dan: ${ord.datum.substring(
            0,
            10
          )}                     ${ord.refund} kom`;
          lista.appendChild(newItem);
          order += ord.refund;
        }else if (ord.refund&&ord.datum>=artDate.value){
          stanje-=ord.refund
        }
      });
    }
    const ruler = document.createElement("hr");
    ruler.style.width = "600px";
    lista.appendChild(ruler);
    const result = document.createElement("p");
    result.innerText = `Ukupno nabavljeno ${order} kom, ukupno prodato ${sell} kom. Stanje: ${stanje}`;
    lista.appendChild(result);
  }
});
artDate.addEventListener('change',()=>{
  art.focus()
})