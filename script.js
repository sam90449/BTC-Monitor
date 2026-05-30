const WORKER_URL =
"https://withered-shape-2779.jacky12345cheung.workers.dev/";

async function updateReport() {

    try {

        const response =
        await fetch(
            WORKER_URL +
            "?t=" +
            Date.now()
        );

        const d =
        await response.json();

        let report = "";

        report += "==================================================\n";
        report += "BTC 即時分析 REPORT\n";
        report += "==================================================\n\n";

        report +=
        "UPDATE_TIME_HK=\n";

        report +=
        d.updateTime +
        "\n\n";

        report +=
        "SYMBOL=BTCUSDT\n\n";

        report +=
        "--------------------------------------------------\n";

        report +=
        "【市場價格】\n";

        report +=
        "--------------------------------------------------\n\n";

        report +=
        "PRICE:\n";

        report +=
        d.btcPrice +
        "\n\n";

        report +=
        "LATEST CLOSE:\n";

        report +=
        d.latestClose +
        "\n\n";

        report +=
        "--------------------------------------------------\n";

        report +=
        "【移動平均線】\n";

        report +=
        "--------------------------------------------------\n\n";

        report +=
        "MA5:\n";

        report +=
        d.ma5 +
        "\n\n";

        report +=
        "MA15:\n";

        report +=
        d.ma15 +
        "\n\n";

        report +=
        "MA20:\n";

        report +=
        d.ma20 +
        "\n\n";

        report +=
        "MA30:\n";

        report +=
        d.ma30 +
        "\n\n";

        report +=
        "--------------------------------------------------\n";

        report +=
        "【Slope 分析】\n";

        report +=
        "--------------------------------------------------\n\n";

        report +=
        "A:\n";

        report +=
        d.A +
        "\n\n";

        report +=
        "B:\n";

        report +=
        d.B +
        "\n\n";

        report +=
        "Ratio:\n";

        report +=
        d.ratio +
        "\n\n";

        report +=
        "--------------------------------------------------\n";

        report +=
        "【1-3H Prediction】\n";

        report +=
        "--------------------------------------------------\n\n";

        report +=
        "Direction:\n";

        report +=
        d.sign +
        "\n\n";

        report +=
        "PIC:\n";

        report +=
        d.pic +
        "\n\n";

        report +=
        "Prediction:\n";

        report +=
        d.finalPercent +
        "%\n\n";

        report +=
        "Target:\n";

        report +=
        d.targetPrice +
        "\n\n";

        report +=
        "--------------------------------------------------\n";

        report +=
        "Raw Predict:\n";

        report +=
        d.rawPredict +
        "%\n\n";

        report +=
        "==================================================\n";

        report +=
        "END OF REPORT\n";

        report +=
        "==================================================";

        document
        .getElementById(
            "report"
        )
        .textContent =
        report;

    }
    catch(err){

        document
        .getElementById(
            "report"
        )
        .textContent =
        "Error:\n\n" +
        err.message;
    }
}

updateReport();

setInterval(
    updateReport,
    60000
);
