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

function setText(id,text){

```
const el =
    document.getElementById(id);

if(el){
    el.textContent=text;
}
```

}

function setHTML(id,html){

```
const el =
    document.getElementById(id);

if(el){
    el.innerHTML=html;
}
```

}

function buildCard(index){

```
const coin =
    DEFAULT_COINS[index - 1];

const el =
    document.getElementById(
        "coin" + index
    );

if(!el){
    return;
}

el.innerHTML = `

    <div class="coin-title">
        COIN ${index}
    </div>

    <div class="input-row">

        <input
        id="symbol${index}"
        value="${coin}"
        type="text">

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
    class="move"
    id="move${index}">
    </div>

    <div
    class="pic"
    id="prediction${index}">
    </div>

`;
```

}

function reloadCoin(index){

```
const input =
    document.getElementById(
        "symbol" + index
    );

if(!input){
    return;
}

DEFAULT_COINS[index - 1] =
    input.value
    .trim()
    .toUpperCase();

updateAll();
```

}

function formatPrice(value){

```
const n =
    Number(value);

if(Number.isNaN(n)){
    return String(value || "");
}

return n.toFixed(4);
```

}

function formatPercent(value){

```
const n =
    Number(value);

if(Number.isNaN(n)){
    return "0.00%";
}

return Math.abs(n).toFixed(2) + "%";
```

}

async function fetchAll(){

```
const response =
    await fetch(
        WORKER_URL +
        "?t=" +
        Date.now()
    );

return await response.json();
```

}

function findCoin(symbol,data){

```
if(
    !data ||
    !data.coins
){
    return null;
}

return data.coins.find(
    coin =>
        coin &&
        coin.pair &&
        coin.pair
            .toUpperCase()
            .startsWith(
                symbol.toUpperCase()
            )
);
```

}
function getPredictionClass(txt){

```
if(
    txt.includes("極高勝算率") ||
    txt.includes("高勝算率") ||
    txt.includes("中高勝算率")
){
    return "up";
}

if(
    txt.includes("普通勝算率")
){
    return "normal";
}

return "down";
```

}

function updateCard(
index,
coin
){

```
if(!coin){
    return;
}

const pair =
    String(
        coin.pair || ""
    );

setText(
    "price" + index,
    pair +
    " : " +
    formatPrice(
        coin.price
    )
);

const raw =
    Number(
        coin.finalPercent || 0
    );

const percent =
    formatPercent(raw);

if(
    coin.bullish
){

    setHTML(
        "move" + index,
        `<span class="up">
        ↑ 上升 +${percent}
        </span>`
    );

}else{

    setHTML(
        "move" + index,
        `<span class="down">
        ↓ 下跌 -${percent}
        </span>`
    );

}

const txt =
    String(
        coin.pic || ""
    );

const cls =
    getPredictionClass(
        txt
    );

let picText =
    "Pic : " +
    txt;

if(
    Number(
        coin.ratio
    ) > 1
){

    picText +=
        " (Target:" +
        formatPrice(
            coin.targetPrice
        ) +
        ")";
}

setHTML(
    "prediction" + index,
    `<span class="${cls}">
    ${picText}
    </span>`
);
```

}
async function updateAll(){

```
try{

    const data =
        await fetchAll();

    if(
        !data ||
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

        const symbol =
            DEFAULT_COINS[
                i - 1
            ];

        const coin =
            findCoin(
                symbol,
                data
            );

        updateCard(
            i,
            coin
        );
    }

}catch(error){

    console.log(
        error
    );

}
```

}

function updateClock(){

```
const now =
    new Date();

const hk =
    new Date(
        now.toLocaleString(
            "en-US",
            {
                timeZone:
                "Asia/Hong_Kong"
            }
        )
    );

const hh =
    String(
        hk.getHours()
    ).padStart(
        2,
        "0"
    );

const mm =
    String(
        hk.getMinutes()
    ).padStart(
        2,
        "0"
    );

const ss =
    String(
        hk.getSeconds()
    ).padStart(
        2,
        "0"
    );

setText(
    "hkClock",
    `${hh}:${mm}:${ss}`
);
```

}

for(
let i = 1;
i <= 6;
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
5000
);
