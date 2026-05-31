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
    )
    ||
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
      value="${coin}"
      type="text"
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

    el.textContent =
      text;
  }
}

function setHTML(id,html){

  const el =
    document.getElementById(id);

  if(el){

    el.innerHTML =
      html;
  }
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

async function updateCard(
  index,
  data
){

  setText(
    "price" + index,
    data.pair +
    " : " +
    data.price
  );

  const color =
    data.bullish
    ? "up"
    : "down";

  setHTML(

    "prediction" + index,

    `<span class="${color}">
    1-3H Prediction :
    ${data.predictionText}
    </span>`
  );

  if(
    data.ratio <= 1
  ){

    setText(
      "target" + index,
      ""
    );

  }else{

    setText(
      "target" + index,
      "Target : " +
      data.targetPrice
    );
  }

  setText(
    "update" + index,
    "Update : " +
    data.updateTime
  );
}

async function updateAll(){

  try{

    const data =
      await fetchAll();

    if(
      !data.success
      ||
      !data.coins
    ){
      return;
    }

    data.coins.forEach(

      (coin,idx)=>{

        updateCard(
          idx + 1,
          {
            ...coin,
            updateTime:
            data.updateTime
          }
        );
      }
    );

  }catch(e){

    console.log(e);
  }
}

async function reloadCoin(index){

  const symbol =
    document
      .getElementById(
        "symbol" + index
      )
      .value
      .trim()
      .toUpperCase();

  if(!symbol){
    return;
  }

  saveCoin(
    index,
    symbol
  );

  alert(
    "Worker v2目前固定6 Coin。\n\n" +
    "已儲存：" +
    symbol
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
