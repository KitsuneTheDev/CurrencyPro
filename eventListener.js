import { elements } from "./domElements.js";
import { deActivateDD, swapElements, clickHandler, filterData, redirect, activateGrid, displayElement, calculateRate, fetchCurrencies } from "./functions.js";

// LISTENER INSTALLER
export const setupEventListeners = () => {
    const pageID = document.body.id;

    const loadHandlers = {
        "indexPage": () => indexPageEventListeners(),
        "exchangePage": () => exchangePageEventListeners()
    };

    if(loadHandlers[pageID]) {
        loadHandlers[pageID]();
    }
}

// EXCHANGE PAGE LISTENERS
export const exchangePageEventListeners = () => {

    const inputs = document.querySelectorAll(".currency-frame input");
    console.log(inputs.value);
    inputs.forEach(input => {
        input.addEventListener("keyup", (event) => {
        filterData(event.currentTarget, event.currentTarget.value);
        });
    });

    const dds = document.querySelectorAll(".countries-dropdown");
    dds.forEach(dd => {
        dd.addEventListener("click", async (event) => {
            event.stopPropagation();
            displayElement(event.target);
            console.log("event.target", event.target);
            if(event.currentTarget.parentElement.matches(".target-frame")) {
                calculateRate();
            } else if(event.currentTarget.parentElement.matches(".base-frame")) {
                const newResult = await fetchCurrencies({
                    base: elements.basePlaceholder.dataset.currency,
                    target: elements.targetPlaceholder.dataset.currency
                });
                elements.results = newResult;
                calculateRate();
            }
        }); 
    });

    elements.logo.addEventListener("click", () => {
        window.location.href = `./index.html`;
    });

    elements.swapButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const basePlaceholder = elements.baseFrame.querySelector(".placeholder");
        const targetPlaceholder = elements.targetFrame.querySelector(".placeholder");
        const tempPlaceholder = targetPlaceholder.cloneNode("true");

        targetPlaceholder.innerText = basePlaceholder.innerText;
        basePlaceholder.innerText = tempPlaceholder.innerText;

        swapElements(basePlaceholder, targetPlaceholder, ["data-currency"]);

        elements.baseCurrency.forEach(currency => {
            currency.innerText = basePlaceholder.getAttribute("data-currency");
            if(currency.innerText === "null") currency.innerText = "";
        });

        elements.targetCurrency.forEach(currency => {
            currency.innerText = targetPlaceholder.getAttribute("data-currency");
            if(currency.innerText === "null") currency.innerText = "";
        });
        calculateRate(elements.results, elements.basePlaceholder.dataset.currency, elements.targetPlaceholder.dataset.currency);
    });

    elements.baseFrame.addEventListener("click", (event) => {
        clickHandler(event);
    });
    
    elements.targetFrame.addEventListener("click", (event) => {
        clickHandler(event);
    });

    window.addEventListener("click", () => {
        deActivateDD();
        if(elements.amountInput.value === "") {
            elements.amountInput.value = "1.00";
            calculateRate(elements.results, elements.basePlaceholder.dataset.currency, elements.targetPlaceholder.dataset.currency);
        }
    })

    elements.amountInput.addEventListener("keyup", (event) => {
        calculateRate(elements.results, elements.basePlaceholder.dataset.currency, elements.targetPlaceholder.dataset.currency, event.currentTarget.value);
    })

    elements.resfreshButton.addEventListener("click", async(event) => {
        const result = await fetchCurrencies(
            {
                base: elements.basePlaceholder.dataset.currency,
                target: elements.targetPlaceholder.dataset.currency
            }
        )
        elements.results = await result;
        console.log("Refreshed. New resuts -->", elements.results);
        calculateRate();
    });
}

// INDEX PAGE LISTENERS
export const indexPageEventListeners = () => {
    
    elements.trackButton.addEventListener("click", () => {
        console.log("redirceting...");
        elements.trackButton.classList.contains("data-active") ? redirect("./exchange.html") : null;
    });

    elements.gridCurrencies.forEach((gridCurrency) => {
        gridCurrency.addEventListener("click", (event) => {
            event.stopPropagation();
            activateGrid(event.currentTarget);
        });
    });

    elements.logo.addEventListener("click", () => {
        window.location.href = `./index.html`;
    });
}