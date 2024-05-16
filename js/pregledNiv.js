const title = document.getElementById("pregledTitle");
title.innerText += " NIVELACIJA";
const lista = document.getElementById("list");
const details = document.getElementById("listDetails");
document.getElementById('correctOrder').style.display='none'
let displayList = [];

const getNivList = async () => {
  const ordList = await fetch(
    "./includes/get_start_data.php?tableName=nivelacija"
  );
  displayList = await ordList.json();
  if (displayList.length) {
    displayList.map((ord, index) => {
      const newItem = document.createElement("li");
      newItem.textContent = `${
        index + 1
      }. Nivelacija na dan: ${ord.datum.substring(0, 10)} ukupno: ${
        ord.total
      } din`;
      lista.appendChild(newItem);
    });
  }
};

getNivList();

lista.addEventListener("click", (e) => {
  details.innerText = displayDetails(e.target.textContent.split(".")[0]);
});
