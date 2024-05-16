const tbl=document.getElementById('tblKnjiga')
const pocetno_stanje=3543698

const knjiga=async()=>{
    if (tbl.rows.length===2){
    let ps=pocetno_stanje
    const data=await trgKnjiga()  
    for(let key=0;key<data.length;key++) {
      ps+=parseInt(data[key].pozitive_total)
      const tr = tbl.insertRow();
      const td1 = tr.insertCell();
      const td2 = tr.insertCell();
      const td3 = tr.insertCell();
      const td4 = tr.insertCell();
      const td5 = tr.insertCell();
      const td6 = tr.insertCell();
      td1.appendChild(document.createTextNode(key+1));
      td2.appendChild(document.createTextNode(data[key].datum));
      td3.appendChild(document.createTextNode(data[key].opis));
      td4.appendChild(document.createTextNode(parseInt(data[key].pozitive_total)>0?data[key].pozitive_total:''));
      td5.appendChild(document.createTextNode(parseInt(data[key].pozitive_total)<0?Math.abs(data[key].pozitive_total):''));
      td6.appendChild(document.createTextNode(ps));
    }
  }
  }
  knjiga()
  