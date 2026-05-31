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

function buildCard(index){

    const coin =
        DEFAULT_COINS[index-1];

    const el =
        document.getElementById(
            "coin"+index
        );

    el.innerHTML=`

        <div class="coin-title">
            COIN${index}
        </div>

        <div
            class="symbol"
            id="symbol${index}">
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

    `;
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

function formatPrice(v){

    const n = Number(v);

    if(isNaN(n)){
        return v;
    }

    return n.toFixed(4);
}

function formatPercent(v){

    const n = Number(v);

    if(isNaN(n)){
        return "0.00%";
    }

    return n.toFixed(2) + "%";
}

function updateCard(index,coin){

    if(!coin){
        return;
    }

    setText(
        "price"+index,
        coin.pair +
        " : " +
        formatPrice(
            coin.price
        )
    );

    const percent =
        formatPercent(
            coin.finalPercent || 0
        );

    if(coin.bullish){

        setHTML(
            "move"+index,
            `<span class="up">
            ↑ 上升 ${percent}
            </span>`
        );

    }else{

        setHTML(
            "move"+index,
            `<span class="down">
            ↓ 下跌 ${percent}
            </span>`
        );

    }

    const txt =
        String(
            coin.predictionText || ""
        );

    let cls="down";

    if(
        txt.includes("極高") ||
        txt.includes("高勝算率") ||
        txt.includes("中高")
    ){
        cls="up";
    }

    let picText =
        "Pic : " +
        txt;

    if(
        Number(
            coin.ratio
        ) > 1
    ){

        picText +=
        `<br>(Target:${formatPrice(
            coin.targetPrice
        )})`;

    }

    setHTML(
        "prediction"+index,
        `<span class="${cls}">
        ${picText}
        </span>`
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
            let i=1;
            i<=6;
            i++
        ){

            updateCard(
                i,
                getCoinByIndex(
                    data,
                    i-1
                )
            );
        }

    }catch(e){

        console.log(e);

    }
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
