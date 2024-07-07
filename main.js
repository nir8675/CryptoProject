let mapCache = new Map();
let mapAllCards = new Map();
let mapGetID = new Map();
let arrOfSelectedCards = [];
let counterOfSelectedCards = 0;

let allCoins = [];

$(document).ready(function () {
  getCoinsArr();
});

function getCoinsArr() {
  $.get("https://api.coingecko.com/api/v3/coins/list?per_page=100")
    .then(function (data, status) {
      if (data == "") {
        alert("invalid value");
        return;
      }
      printCards(data.slice(0, 100));
    })
    .catch(() => console.log("Failed!"));
}

function printCards(coinsArr) {
  for (let i = 0; i < coinsArr.length; i++) {
    let card = `
        <div id ="${coinsArr[i].id}" class="card" style="display: block;">
            <div class="card__inner">
                <div class="card__face card__face--front"><br>
                    <h2>${coinsArr[i].name}</h2><br>
                    <label class="switch">
                        <input type="checkbox" id="switch_${i}">   
                        <span class="slider round"></span>
                    </label><br><br>
                    <h5>More info</h5>
                </div>
                <div class="card__face card__face--back">
                    <div class="card__content">
                        <div class="card__header">
                        <h2>${coinsArr[i].symbol}</h2>
                        </div>
                        <div class="card__body">
                            <h2>${coinsArr[i].name}</h2>
                            <div class="loader"></div>
                            <div id="coin_${i}" style="font-weight: bold;line-height: 1;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    $(".card__container").append(card);
    mapGetID.set(coinsArr[i].id, i);
    mapAllCards.set("switch_" + i, coinsArr[i]);
  }
  onLoadAddEventToButtons();
}

function onLoadAddEventToButtons() {
  $(".card").on("click", onMoreInfoClicked);
  const card = document.querySelectorAll(".card__inner");
  card.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("is-flipped");
    });
  });

  $("#homeBtn").on("click", function () {
    $("#live_reports").css("display", "none");
    $("#about").css("display", "none");
    $("#home").css("display", "block");
    $(".card").css("display", "block");
  });
  $("#liveBtn").on("click", () => {
    if (arrOfSelectedCards.length > 0) {
      $("#home").css("display", "none");
      $("#about").css("display", "none");
      $("#live_reports").css("display", "block");
      $("#canvasDataContainer").empty();
      showLiveReports();
    } else {
      $("#toggleError").modal("toggle");
      $("#live_reports").css("display", "none");
      $("#about").css("display", "none");
      $("#home").css("display", "block");
      $(".card").css("display", "block");
    }
  });
  $("#aboutBtn").on("click", function () {
    $("#home").css("display", "none");
    $("#live_reports").css("display", "none");
    $("#about").css("display", "block");
  });
  $(".fa-search").click(function () {
    $("#live_reports").css("display", "none");
    $("#about").css("display", "none");
    $("#home").css("display", "block");
    $(".icon").toggleClass("active");
    $("input[type='text']").toggleClass("active");
  });

  $("#save").on("click", onModalSaveChanges);
  $("#close").on("click", function () {
    $("#" + arrOfSelectedCards[5].id)
      .find("input[type=checkbox]")
      .prop("checked", false);
    counterOfSelectedCards--;
    arrOfSelectedCards.splice(-1, 1);
    localStorage.setItem("toggleArr", JSON.stringify(arrOfSelectedCards));
    $("#dialog").modal("toggle");
  });

  if (localStorage.getItem("toggleArr")) {
    toggleArrJSON = localStorage.getItem("toggleArr");
    toggleArr = JSON.parse(toggleArrJSON);
    arrOfSelectedCards = toggleArr;
    counterOfSelectedCards = arrOfSelectedCards.length;
    if (arrOfSelectedCards.length == 6) {
      $("#" + arrOfSelectedCards[5].id)
        .find("input[type=checkbox]")
        .prop("checked", false);
      arrOfSelectedCards.splice(-1, 1);
      counterOfSelectedCards--;
    }
    for (let i = 0; i < toggleArr.length; i++) {
      $("#" + toggleArr[i].id)
        .find("input[type=checkbox]")
        .prop("checked", true);
    }
  } else {
    localStorage.setItem("toggleArr", JSON.stringify(arrOfSelectedCards));
  }
  togglesCounter();
}

function togglesCounter() {
  $(".card")
    .find("input[type=checkbox]")
    .click(function () {
      if ($(this).prop("checked")) {
        let mapLabel = mapAllCards.get(this.id);
        if (counterOfSelectedCards <= 5) {
          counterOfSelectedCards++;
          arrOfSelectedCards.push(mapLabel);
          localStorage.setItem("toggleArr", JSON.stringify(arrOfSelectedCards));
        }
        if (counterOfSelectedCards == 6) {
          $(this).prop("checked", true);
          startModal();
        }
      } else {
        arrOfSelectedCards.splice(-1, 1);
        counterOfSelectedCards--;
        localStorage.setItem("toggleArr", JSON.stringify(arrOfSelectedCards));
      }
    });
}

function onMoreInfoClicked() {
  let id = this.id;

  setTimeout(() => {
    if (
      $("#" + id)
        .find(".card__inner")
        .hasClass("is-flipped")
    ) {
      $("#" + id)
        .find(".card__inner")
        .toggleClass("is-flipped");
    }
    return;
  }, 120000);

  if (typeof mapCache.get(id) == "undefined") {
    $.get("https://api.coingecko.com/api/v3/coins/" + id)
      .then(function (data, status) {
        $("#" + id)
          .find(".loader")
          .css("display", "none");
        setTimeout(function () {
          $("#" + id)
            .find(".loader")
            .css("display", "block");
        }, 120000);
        saveCoinInCache(data);
        showCoinMoreInfo(data);
      })
      .catch(() => console.log("Failed!"));
  } else {
    showCoinMoreInfo(mapCache.get(id));
  }
}

function saveCoinInCache(coin) {
  mapCache.set(coin.id, coin);
  setTimeout(function () {
    mapCache.delete(coin.id);
  }, 120000);
}

function showCoinMoreInfo(coin) {
  let id = mapGetID.get(coin.id);
  $("#coin_" + id).html("");
  $("#coin_" + id).append(`
                            <img src="${coin.image.small}" class="pp">
                            <br>
                            ILS: ${coin.market_data.current_price.ils}₪
                            <br><br>
                            USD : ${coin.market_data.current_price.usd}$
                            <br><br>
                            EUR : ${coin.market_data.current_price.eur}€`);

  $("#coin_" + id).css("display", "block");

  setTimeout(function () {
    $("#coin_" + id).css("display", "none");
  }, 120000);
}

function startModal() {
  $(".toggleModal-body").html("");
  for (let i = 0; i < arrOfSelectedCards.length; i++) {
    let getID = mapGetID.get(arrOfSelectedCards[i].id);
    $(".toggleModal-body").append(`
        <div class="toggleDiv" id="${arrOfSelectedCards[i].id}">
        <p>${arrOfSelectedCards[i].name}</p>
        <label class="switch">
        <input type="checkbox" id="switch_${getID}">   
        <span class="slider round"></span>
        </label>
        </div>`);
    $(".toggleDiv")
      .find("#switch_" + getID)
      .prop("checked", true);
  }
  $("#dialog").modal("toggle");
}

function onModalSaveChanges() {
  $(".toggleDiv").each(function () {
    if ($(this).find("input[type=checkbox]").prop("checked") == false) {
      let getID = mapGetID.get(this.id);
      $(".card")
        .find("#switch_" + getID)
        .prop("checked", false);
      for (let i = 0; i < arrOfSelectedCards.length; i++) {
        if (arrOfSelectedCards[i].id == this.id) {
          arrOfSelectedCards.splice(i, 1);
          counterOfSelectedCards--;
        }
      }
    }
  });
  if (arrOfSelectedCards.length == 6) {
    const letters = "0123456789ABCDEF".split("");
    const color = "#";
    for (const i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    $(".modal-title").css("color", color);
    return;
  }
  localStorage.setItem("toggleArr", JSON.stringify(arrOfSelectedCards));
  $("#dialog").modal("toggle");
}

function showLiveReports() {
  let date = new Date();
  const option = {
    title: {
      text: "Live Reports",
    },
    data: [],
    toolTip: {
      shared: true,
    },
    legend: {
      cursor: "pointer",
      itemclick: toggleDataSeries,
    },
    options: {
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              displayFormats: {
                second: "hh:mm:ss",
              },
            },
          },
        ],
      },
    },
  };
  $("#canvasDataContainer").CanvasJSChart(option);

  let strLiveReports = strToLiveReportsMaker();
  for (let i = 0; i < arrOfSelectedCards.length; i++) {
    option.data.push(newData(arrOfSelectedCards[i].symbol));
  }
  updateData();
  let xValue = date;

  function addData(data) {
    for (let i = 0; i < arrOfSelectedCards.length; i++) {
      if (data[arrOfSelectedCards[i].symbol.toUpperCase()]) {
        option.data[i].dataPoints.push({
          x: xValue,
          y: data[arrOfSelectedCards[i].symbol.toUpperCase()].USD,
        });
      }
      if (option.data[i].dataPoints.length > 10) {
        option.data[i].dataPoints.splice(0, 1);
      }
    }
    date = new Date();
    xValue = date;
    $("#canvasDataContainer").CanvasJSChart().render();
    setTimeout(updateData, 2000);
  }

  function updateData() {
    $.getJSON(
      "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" +
        strLiveReports +
        "&tsyms=USD",
      addData
    );
  }
}

function newData(coinSymbol) {
  let newData = {
    type: "spline",
    name: coinSymbol,
    showInLegend: true,
    xValueFormatString: "hh:mm:ss",
    yValueFormatString: "#,##0.## $",
    dataPoints: [],
  };
  return newData;
}

function strToLiveReportsMaker() {
  let newStr = arrOfSelectedCards[0].symbol;
  for (let i = 1; i < arrOfSelectedCards.length; i++) {
    newStr = newStr + "," + arrOfSelectedCards[i].symbol;
  }
  newStr.toUpperCase();
  return newStr;
}

function toggleDataSeries(e) {
  if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
    e.dataSeries.visible = false;
  } else {
    e.dataSeries.visible = true;
  }
  e.chart.render();
}

function searchCoinBtn() {
  const searchText = $("#textToSearch").val().trim().toUpperCase();
  let flag = false;

  if (searchText !== "") {
    for (let [key, value] of mapAllCards) {
      const name = value.name.trim().toUpperCase();
      const cardElement = $("#" + value.id);

      if (name.includes(searchText)) {
        cardElement.css("display", "block");
        flag = true;
      } else {
        cardElement.css("display", "none");
      }
    }
  } else {
    $(".card").css("display", "block");
  }

  if (!flag && $(".icon").hasClass("active") && searchText !== "") {
    $("#searchError").modal("toggle");
  }
}
