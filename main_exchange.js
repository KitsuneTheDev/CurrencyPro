import { setupEventListeners } from "./eventListener.js";
import { elements } from "./domElements.js";
import { initialize, getParams, loadCSS } from "./functions.js";

initialize().then(async () => {
    elements.results = await getParams();
    console.log("RESULTS -->", elements.results);
    setupEventListeners();
    loadCSS("./exchange.css");
    console.log(elements.results.conversion_rates);
    console.log(elements.results.time_last_update_utc);
});