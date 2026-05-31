const WORKER_URL =
"https://wispy-dawn-5bf8.jacky12345cheung.workers.dev/";

const DEFAULT_COINS = [
  "BTC",
  "HOME",
  "TON",
  "SUI",
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

  <div class="card-title">
    COIN ${index}
  </div>

  <div class="input-row">

    <input
      id="symbol${index}"
      type="text"
      value="${coin}"
    >

    <button
      onclick="reloadCoin(${index})">
      LOAD
    </button>

  </div>

  <div
    class="price"
    id="price${index}">
    Loading...
  </div>

  <div
    class="prediction"
    id="prediction${index}">
    ...
  </div>

  <div
    class="target"
    id="target${index}">
  </div>

  <div
    class="update"
    id="update${index}">
  </div>

  `;
}

function setText(id,text){

  const el =
    document.getElementById(id);

  if(el){
    el.textContent = text;
  }
}

function setHTML(id,html){

  const el =
    document.getElementById(id);

  if(el){
    el.innerHTML = html;
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
  coin,
  updateTime
){

  if(!coin){
    return;
  }

  setText(
    "price" + index,
    coin.pair +
    " : " +
    coin.price
  );

  const color =
    coin.bullish
      ? "up"
      : "down";

  setHTML(

    "prediction" + index,

    `<span class="${color}">
      1-3H Prediction :
      ${coin.predictionText}
    </span>`
  );

  if(
    coin.ratio > 1
  ){

    setText(
      "target" + index,
      "Target : " +
      coin.targetPrice
    );

  }else{

    setText(
      "target" + index,
      ""
    );
  }

  setText(
    "update" + index,
    "Update : " +
    updateTime
  );
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
      let i = 1;
      i <= 6;
      i++
    ){

      const coin =
        getCoinByIndex(
          data,
          i - 1
        );

      updateCard(
        i,
        coin,
        data.updateTime
      );
    }

  }catch(e){

    console.log(
      "updateAll error",
      e
    );
  }
}

function reloadCoin(index){

  const input =
    document.getElementById(
      "symbol" + index
    );

  if(!input){
    return;
  }

  const coin =
    input.value
      .trim()
      .toUpperCase();

  if(!coin){
    return;
  }

  saveCoin(
    index,
    coin
  );

  alert(
    "已儲存：" +
    coin +
    "\n\n注意：目前 Worker v2 固定輸出 BTC / HOME / TON / SUI / SOL / IOTA"
  );
}

for(
  let i = 1;
  i <= 6;
  i++
){

  buildCard(i);
}

updateAll();

setInterval(
  updateAll,
  60000
);
