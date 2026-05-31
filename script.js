const WORKER_URL =
"https://wispy-dawn-5bf8.jacky12345cheung.workers.dev/";

const defaultCoins = [
  "BTC",
  "HOME",
  "TON",
  "SUI",
  "SOL",
  "IOTA"
];

function buildCard(index){

  const el =
    document.getElementById(
      "coin" + index
    );

  el.innerHTML = `

  <div class="card-title">
  COIN ${index}
  </div>

  <div class="price"
       id="price${index}">
  Loading...
  </div>

  <div class="prediction"
       id="prediction${index}">
  ...
  </div>

  <div class="target"
       id="target${index}">
  ...
  </div>

  <div class="update"
       id="update${index}">
  ...
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

async function updateAll(){

  try{

    const res =
      await fetch(
        WORKER_URL +
        "?t=" +
        Date.now()
      );

    const data =
      await res.json();

    if(
      !data.success ||
      !data.coins
    ){
      return;
    }

    data.coins.forEach(
      (d,idx)=>{

      const i =
        idx + 1;

      setText(
        "price"+i,
        d.pair +
        " : " +
        d.price
      );

      const color =
        d.bullish
        ? "up"
        : "down";

      setHTML(

        "prediction"+i,

        `<span class="${color}">
        1-3H Prediction :
        ${d.predictionText}
        </span>`
      );

      if(
        d.ratio <= 1
      ){

        setText(
          "target"+i,
          ""
        );

      }else{

        setText(
          "target"+i,
          "Target : " +
          d.targetPrice
        );
      }

      setText(
        "update"+i,
        "Update : " +
        data.updateTime
      );

    });

  }catch(e){

    console.log(e);

  }
}

for(
  let i=1;
  i<=6;
  i++
){

  buildCard(i);
}

updateAll();

setInterval(
  updateAll,
  60000
);
