const title = document.getElementById("pregledTitle");
title.innerText += " NABAVKE";
const lista = document.getElementById("list");
const details = document.getElementById("listDetails");
document.getElementById('correctOrder').style.display='block'
let displayList = [],correctedData

const getOrdList = async () => {
  const ordList = await fetch(
    "./includes/get_start_data.php?tableName=nabavka"
  );
  displayList = await ordList.json();
  console.log (displayList)
  displayList = displayList.map((row) => ({
    ...row,
    datum: row.datum.split("-").reverse().join("."),
  }));
  if (displayList.length) {
    displayList.map((ord, index) => {
      const newItem = document.createElement("li");
      newItem.textContent = `${index + 1}. ${ord.datum} ${ord.opis} ukupno: ${
        ord.total
      } din`;
      lista.appendChild(newItem);
    });
  }
};

getOrdList();

const corect=()=>{
  if(correctedData?.opis&&window.confirm(`Sigurni ste da se menja ${correctedData?.opis}?`)){
      sessionStorage.setItem('corection',JSON.stringify(correctedData))
      window.location.href='./nabavka.html'
    }
}

document.getElementById('correctOrder').addEventListener('click',corect)

lista.addEventListener("click", (e) => {
  let id=parseInt(e.target.outerText)
  correctedData=displayList[id-1]
  console.log(correctedData)
  details.innerText = displayDetails(id);
});
