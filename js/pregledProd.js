const title = document.getElementById("pregledTitle");
title.innerText += " PRODAJE";
const lista = document.getElementById("list");
const details = document.getElementById("listDetails");
document.getElementById('correctOrder').style.display='none'
let displayList = [];

const getSellList = async () => {
  const sellList = await fetch(
    "./includes/get_start_data.php?tableName=prodaja"
  );
  displayList = await sellList.json();
  if (displayList.length) {
    displayList.map((sell, index) => {
      const newItem = document.createElement("li");
      newItem.textContent = `${
        index + 1
      }. Promet na dan: ${sell.datum.substring(0, 10)} ukupno: ${
        sell.total
      } din`;
      lista.appendChild(newItem);
    });
  }
};

getSellList();

lista.addEventListener("click", (e) => {
  details.innerText = displayDetails(e.target.textContent.split(".")[0]);
});
