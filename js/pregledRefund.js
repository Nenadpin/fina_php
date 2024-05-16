const title = document.getElementById("pregledTitle");
title.innerText += " REFUNDACIJA";
const lista = document.getElementById("list");
const details = document.getElementById("listDetails");
document.getElementById('correctOrder').style.display='none'
let displayList = [];

const getOrdList = async () => {
  const ordList = await fetch(
    "./includes/get_start_data.php?tableName=refund"
  );
  displayList = await ordList.json();
  displayList = displayList.map((row) => ({
    ...row,
    datum: row.datum.split("-").reverse().join("."),
  }));
  if (displayList.length) {
    displayList.map((ord, index) => {
      const newItem = document.createElement("li");
      newItem.textContent = `${index + 1}. ${ord.datum} Povracaj robe - ukupno: ${
        ord.total
      } din`;
      lista.appendChild(newItem);
    });
  }
};

getOrdList();

lista.addEventListener("click", (e) => {
  details.innerText = displayDetails(parseInt(e.target.outerText));
});
