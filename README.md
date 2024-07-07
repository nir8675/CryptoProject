# CryptoProject

You can use this:
$(document).ready(getCoinsArr);

Will the user see this? :)
.catch(() => console.log("Failed!"));

put the url in a const 
$.get("https://api.coingecko.com/api/v3/coins/list?per_page=100")

why? 
  if (typeof mapCache.get(id) == "undefined") {

you epmoty it and then append? what the logic?
You can just use html


 $("#coin_" + id).html("");
  $("#coin_" + id).append(`
                            <img src="${coin.image.small}" class="pp">
                            <br>
                            ILS: ${coin.market_data.current_price.ils}₪
                            <br><br>
                            USD : ${coin.market_data.current_price.usd}$
                            <br><br>
                            EUR : ${coin.market_data.current_price.eur}€`);

like so:

 $("#coin_" + id).html(`
                            <img src="${coin.image.small}" class="pp">
                            <br>
                            ILS: ${coin.market_data.current_price.ils}₪
                            <br><br>
                            USD : ${coin.market_data.current_price.usd}$
                            <br><br>
                            EUR : ${coin.market_data.current_price.eur}€`);

why not use template?

$.getJSON(
      "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" +
        strLiveReports +
        "&tsyms=USD",
      addData
    );

You have to write shorter functions (limit you function to 20 lines) onLoadAddEventToButtons (this is no a good fucntion)



