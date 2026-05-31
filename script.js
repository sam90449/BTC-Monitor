const WORKER_URL =
"https://wispy-dawn-5bf8.jacky12345cheung.workers.dev/";

const DEFAULT_COINS = [
  "BTC",
  "TON",
  "SUI",
  "HOME",
  "SOL",
  "IOTA"
];

function saveCoin(index, coin){

  localStorage.setItem(
    "coin" + index,
    coin.toUpperCase()
  );
}

function loadCoin(index){

  return (
    localStorage.getItem(
      "coin" + index
    ) ||
    DEFAULT_COINS[index - 1]
  );
}

function buildCard(index){

  const coin =
    loadCoin(index);

  const el =
    document.getElementById(
      "coin" + index
    );

  el.innerHTML = `

  <div class="coin-title">
    COIN ${index}
  </div>

  <div class="input-row">

    <input
      id="symbol${index}"
      value="${coin}"
    >

    <button
      onclick="reloadCoin(${index})">
      LOAD
    </button>

  </div>

  <div
    class="symbol"
    id="symbolText${index}">
    ${coin}
  </div>

  <div
    class="price"
    id="price${index}">
    Loading...
  </div>

  <div
    class="move"
    id="move${index}">
  </div>

  <div
    class="pic"
    id="prediction${index}">
  </div>

  <div
    class="target"
    id="target${index}">
  </div>

  `;
}

function setText(id,text){

  const el =
    document.getElementById(id);

  if(el){
    el.textContent=text;
  }
}

function setHTML(id,html){

  const el =
    document.getElementById(id);

  if(el){
    el.innerHTML=html;
  }
}

function getCoinByIndex(data,index){

  if(
    !data ||
    !data.coins ||
    !data.coins[index]
  ){
    return null;
  }

  return data.coins[index];
}

async function fetchAll(){

  const res =
    await fetch(
      WORKER_URL +
      "?t=" +
      Date.now()
    );

  return await res.json();
}

function updateCard(
  index,
  coin
){

  if(!coin){
    return;
  }

  setText(
    "symbolText"+index,
    coin.pair
  );

  setText(
    "price"+index,
    coin.price
  );

  let arrow="↓";
  let moveText="下跌";

  if(coin.bullish){

    arrow="↑";
    moveText="上升";

  }

  setText(
    "move"+index,
    arrow +
    " " +
    moveText +
    " " +
    (
      coin.finalPercent ??
      ""
    )
  );

  const txt =
    String(
      coin.predictionText || ""
    );

  let cls="down";

  if(
    txt.includes("普通")
  ){
    cls="normal";
  }

  if(
    txt.includes("中高") ||
    txt.includes("高勝算率") ||
    txt.includes("極高")
  ){
    cls="up";
  }

  setHTML(

    "prediction"+index,

    `<span class="${cls}">
    Pic : ${txt}
    </span>`
  );

  if(
    Number(coin.ratio) > 1
  ){

    setText(
      "target"+index,
      "Target : " +
      coin.targetPrice
    );

  }else{

    setText(
      "target"+index,
      ""
    );
  }
}

async function updateAll(){

  try{

    const data =
      await fetchAll();

    if(
      !data.success ||
      !data.coins
    ){
      return;
    }

    for(
      let i=1;
      i<=6;
      i++
    ){

      const coin =
        getCoinByIndex(
          data,
          i-1
        );

      updateCard(
        i,
        coin
      );
    }

  }catch(e){

    console.log(e);

  }
}

function reloadCoin(index){

  const coin =
    document
    .getElementById(
      "symbol"+index
    )
    .value
    .trim()
    .toUpperCase();

  saveCoin(
    index,
    coin
  );

  alert(
    "已儲存：" +
    coin
  );
}

function updateClock(){

  const now =
    new Date();

  const hk =
    now.toLocaleString(
      "zh-HK",
      {
        timeZone:
        "Asia/Hong_Kong"
      }
    );

  setText(
    "hkClock",
    hk
  );
}

for(
  let i=1;
  i<=6;
  i++
){

  buildCard(i);
}

updateClock();

updateAll();

setInterval(
  updateClock,
  1000
);

setInterval(
  updateAll,
  60000
);
