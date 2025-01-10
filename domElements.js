export const elements = {
    logo: document.querySelector(".logo"),
    baseFrame: document.querySelector(".base-frame"),
    targetFrame: document.querySelector(".target-frame"),
    countriesDDs: document.querySelectorAll(".countries-dropdown"),
    baseCurrency: document.querySelectorAll(".base-currency"),
    targetCurrency: document.querySelectorAll(".target-currency"),
    lastUpdateFrame: document.querySelector(".last-update-frame"),
    swapButton: document.querySelector(".swap-button"),
    trackButton: document.querySelector(".track-button"),
    gridCurrencies: document.querySelectorAll(".currency-display label"),
    baseDD: document.querySelectorAll(".currency-frame .base-frame a"),
    targetDD: document.querySelectorAll(".currency-frame .target-frame a"),
    basePlaceholder: document.querySelector(".base-frame .placeholder"),
    targetPlaceholder: document.querySelector(".target-frame .placeholder"),
    baseAmount: document.querySelector(".base-amount"),
    targetAmount: document.querySelector(".target-amount"),
    targetAmountHighlighted: document.querySelector(".conversion-frame .highlighted"),
    targetAmountRest: document.querySelector(".conversion-frame .rest"),
    lastUpdateSpan: document.querySelector(".update-time"),
    resfreshButton: document.querySelector(".refresh-button"),
    amountInput: document.querySelector("#amountInput"),
    results: {}
}

const observer = new MutationObserver(() => {
        elements.gridCurrencies = document.querySelectorAll(".currency-display label");
        elements.baseDD = document.querySelectorAll(".currency-frame .base-frame a");
        elements.targetDD = document.querySelectorAll(".currency-frame .target-frame a");
});

const targets = [...document.querySelectorAll(".currency-display"), ...document.querySelectorAll(".currency-frame")];
console.log("targets ->", targets);
targets.forEach((target) => {
    console.log(target);
    observer.observe(target, {
        childList: true,
        subtree: true
    });
});