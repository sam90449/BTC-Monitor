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

function formatPrice(value){

    const n = Number(value);

    if(Number.isNaN(n)){
        return "--";
    }

    if(n >= 1000){
        return n.toFixed(4);
    }

    if(n >= 1){
        return n.toFixed(4);
    }

    return n.toFixed(4);
}

function formatPercent(value){

    const n = Number(value);

    if(Number.isNaN(n)){
        return "0.00";
    }

    return Math.abs(n).toFixed(2);
}

function buildCard(index){

    const symbol =
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
                class="coin-input"
                type="text"
                value="${symbol}"
            >

            <button
                class="load-btn"
                onclick="reloadCoin(${index})"
            >
                LOAD
            </button>

        </div>

        <div
            id="price${index}"
            class="price"
        >
            Loading...
        </div>

        <div
            id="move${index}"
            class="move"
        >
        </div>

        <div
            id="prediction${index}"
            class="prediction"
        >
        </div>

    `;
}

function reloadCoin(index){

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
}

function getPredictionClass(txt){

    const t =
        String(txt || "");

    if(
        t.includes("極高勝算率") ||
        t.includes("高勝算率") ||
        t.includes("中高勝算率")
    ){
        return "up";
    }

    if(
        t.includes("普通勝算率")
    ){
        return "normal";
    }

    return "down";
}

async function fetchAll(){

    const response =
        await fetch(
            WORKER_URL +
            "?t=" +
            Date.now()
        );

    return await response.json();
}

function findCoin(symbol,data){

    if(
        !data ||
        !Array.isArray(data.coins)
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
}
function updateCard(
    index,
    coin
){

    if(!coin){
        return;
    }

    const pair =
        String(
            coin.pair || ""
        );

    const price =
        formatPrice(
            coin.price
        );

    setText(
        "price" + index,
        pair +
        " : " +
        price
    );

    const rawPercent =
        Number(
            coin.finalPercent || 0
        );

    const bullish =
        rawPercent >= 0;

    const percentText =
        formatPercent(
            rawPercent
        );

    if(bullish){

        setHTML(
            "move" + index,
            `<span class="up">
                ↑ 上升 +${percentText}%
            </span>`
        );

    }else{

        setHTML(
            "move" + index,
            `<span class="down">
                ↓ 下跌 -${percentText}%
            </span>`
        );

    }

    const picValue =
        String(
            coin.pic ||
            coin.predictionText ||
            ""
        );

    const cls =
        getPredictionClass(
            picValue
        );

    let html =
        "Pic : " +
        picValue;

    if(
        coin.targetPrice !==
        undefined &&
        coin.targetPrice !==
        null &&
        Number(
            coin.ratio || 0
        ) > 1
    ){

        html +=
            "<br>" +
            "Target : " +
            formatPrice(
                coin.targetPrice
            );
    }

    if(
        coin.ratio !==
        undefined
    ){

        html +=
            "<br>" +
            "Ratio : " +
            Number(
                coin.ratio
            ).toFixed(2);
    }

    setHTML(
        "prediction" + index,
        `<span class="${cls}">
            ${html}
        </span>`
    );
}

function updateClock(){

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
}
async function updateAll(){

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
            "updateAll error",
            error
        );

    }
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
