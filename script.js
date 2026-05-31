const WORKER_URL =
"https://wispy-dawn-5bf8.jacky12345cheung.workers.dev/";

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

async function fetchAllCoins() {

  const res =
    await fetch(
      WORKER_URL +
      "?t=" +
      Date.now()
    );

  return await res.json();
}

async function updateAll() {

  try {

    const data =
      await fetchAllCoins();

    if (
      !data.success ||
      !data.coins
    ) {

      return;
    }

    data.coins.forEach(
      (d, idx) => {

        const index =
          idx + 1;

        setText(
          "price" + index,
          d.pair +
          " : " +
          d.price
        );

        let color =
          d.bullish
          ? "up"
          : "down";

        setHTML(

          "prediction" + index,

          `<span class="${color}">
          1-3H Prediction :
          ${d.predictionText}
          </span>`
        );

        if (
          d.ratio <= 1
        ) {

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
          data.updateTime
        );
      }
    );

  } catch (e) {

    console.log(e);
  }
}

updateAll();

setInterval(
  updateAll,
  60000
);
