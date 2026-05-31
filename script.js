const WORKER_URL =
"https://withered-shape-2779.jacky12345cheung.workers.dev/";

const defaultCoins = [
  "BTC",
  "HOME",
  "TON",
  "SUI",
  "SOL",
  "IOTA"
];

function loadSavedCoins() {

  const arr = [];

  for (let i = 1; i <= 6; i++) {

    const coin =
      localStorage.getItem(
        "coin" + i
      );

    arr.push(
      coin || defaultCoins[i - 1]
    );
  }

  return arr;
}

function saveCoin(index, coin) {

  localStorage.setItem(
    "coin" + index,
    coin.toUpperCase()
  );
}

function buildCard(index) {

  const container =
    document.getElementById(
      "coin" + index
    );

  container.innerHTML = `
    <div class="card-title">
      COIN ${index}
    </div>

    <div class="input-row">

      <input
      id="input${index}"
      type="text">

      <button
      onclick="reloadCoin(${index})">

      LOAD

      </button>

    </div>

    <div
    id="price${index}"
    class="price">

    Loading...

    </div>

    <div
    id="prediction${index}"
    class="prediction">

    ...

    </div>

    <div
    id="target${index}"
    class="target">

    ...

    </div>

    <div
    id="update${index}"
    class="update">

    ...

    </div>
  `;
}

function initCards() {

  for (
    let i = 1;
    i <= 6;
    i++
  ) {

    buildCard(i);
  }

  const coins =
    loadSavedCoins();

  for (
    let i = 1;
    i <= 6;
    i++
  ) {

    document
      .getElementById(
        "input" + i
      )
      .value =
      coins[i - 1];
  }
}

async function fetchCoin(symbol) {

  const url =
    WORKER_URL +
    "?symbol=" +
    encodeURIComponent(symbol) +
    "&t=" +
    Date.now();

  const res =
    await fetch(url);

  const data =
    await res.json();

  return data;
}

function setText(id, text) {

  const el =
    document.getElementById(id);

  if (el) {

    el.textContent = text;
  }
}

function setHTML(id, html) {

  const el =
    document.getElementById(id);

  if (el) {

    el.innerHTML = html;
  }
}

async function updateCoin(index) {

  try {

    const symbol =
      document
        .getElementById(
          "input" + index
        )
        .value
        .trim()
        .toUpperCase();

    if (!symbol) {
      return;
    }

    const d =
      await fetchCoin(symbol);

    if (!d.success) {

      setText(
        "price" + index,
        "Invalid Coin"
      );

      setText(
        "prediction" + index,
        d.error || ""
      );

      return;
    }

    setText(
      "price" + index,
      d.symbol +
      " : " +
      d.price
    );

    let color = "up";

    if (!d.bullish) {
      color = "down";
    }

    setHTML(
      "prediction" + index,

      `<span class="${color}">
      1-3H Prediction :
      ${d.predictionText}
      </span>`
    );

    if (d.ratio <= 1) {

      setText(
        "target" + index,
        ""
      );

    } else {

      setText(
        "target" + index,
        "Target : " +
        d.targetPrice
      );
    }

    setText(
      "update" + index,
      "Update : " +
      d.updateTime
    );

  }
  catch (e) {

    setText(
      "price" + index,
      "Error"
    );

    setText(
      "prediction" + index,
      e.message
    );

    setText(
      "target" + index,
      ""
    );
  }
}

async function updateAll() {

  for (
    let i = 1;
    i <= 6;
    i++
  ) {

    await updateCoin(i);
  }
}

function reloadCoin(index) {

  const coin =
    document
      .getElementById(
        "input" + index
      )
      .value
      .trim()
      .toUpperCase();

  if (!coin) {
    return;
  }

  saveCoin(
    index,
    coin
  );

  updateCoin(
    index
  );
}

initCards();

updateAll();

setInterval(
  updateAll,
  60000
);
