import { elements } from "./domElements.js";
import FetchWrapper from "./fetch-wrapper.js";
import { apiKey } from "./apiKey";

export const getParams = async () => {
    console.log("getting parameters...");
    const params = new URLSearchParams(window.location.search);
    const activeCurrencies = {
        base: params.get("base"),
        target: params.get("target")
    };
    console.log("baseDD ->", elements.baseDD);
    const baseElement = [...elements.baseDD].find(element => element.getAttribute("data-currency") === activeCurrencies.base); 
    const targetElement = [...elements.targetDD].find(element => element.getAttribute("data-currency") === activeCurrencies.target);
    displayElement(baseElement);
    displayElement(targetElement);
    document.body.style.visibility = 'hidden';
    console.log("paremeters: ", activeCurrencies);
    const results = await fetchCurrencies(activeCurrencies);
    calculateRate(results, baseElement.getAttribute("data-currency"), targetElement.getAttribute("data-currency"));
    return results;
}

export const calculateRate = (results = elements.results, baseCurrency = elements.basePlaceholder.getAttribute("data-currency"), targetCurrency = elements.targetPlaceholder.getAttribute("data-currency"), amount = elements.amountInput.value) => {
    console.log(`
        baseCurrency ---> ${baseCurrency}
        targetCurrency -> ${targetCurrency}
        results --------> ${results.conversion_rates[targetCurrency]}
        lastUpdate -----> ${results.time_last_update_utc}
        `);
    const base = results.conversion_rates[baseCurrency];
    const target = results.conversion_rates[targetCurrency];
    console.log(`
        base ----> ${base}
        target --> ${target}
        amount --> ${amount}
        total ---> ${base * target * amount}
        `);

    const calculatedAmount = (target * amount) / base;
    displayResult(results, baseCurrency, targetCurrency, calculatedAmount, amount);
}

const displayResult = (results, baseCurrency, targetCurrency, calculatedAmount, amount) => {
    elements.baseAmount.innerText = amount;
    console.log("type of amount", typeof(calculatedAmount));
    const calculatedAmountString = calculatedAmount.toString().substring(0, 8);
    const dotIndexAmount = calculatedAmountString.indexOf(".");
    const highlighted = calculatedAmountString.slice(0 ,dotIndexAmount + 3);
    const theRest = calculatedAmountString.slice(dotIndexAmount + 3);
    const dotIndexDate = results.time_last_update_utc.indexOf(",");
    const properDate = new Date(results.time_last_update_utc.slice(dotIndexDate + 1));
    const dateNow = new Date();
    const calculatedTime = (dateNow.getTime() - properDate.getTime()) / 60000;
    console.log("properdate ->", properDate);
    console.log("highligted ->", highlighted);
    console.log("theRest    ->", theRest);
    console.log(`
        properdate --> ${properDate}
        highlighted -> ${highlighted}
        theRest -----> ${theRest}
        `);
    elements.targetAmountHighlighted.innerText = highlighted;
    elements.targetAmountRest.innerText = theRest;
    elements.baseCurrency.innerText = baseCurrency;
    elements.targetCurrency.innerText = targetCurrency;
    elements.baseAmount.innerText = amount;
    elements.lastUpdateSpan.innerText = Math.round(calculatedTime);
}

export const swapElements = (baseElement, targetElement, attributeArray) => {
    const tempElement = baseElement.cloneNode("true");

    attributeArray.forEach(attr => {
        baseElement.setAttribute(attr, targetElement.getAttribute(attr));
        targetElement.setAttribute(attr, tempElement.getAttribute(attr));
    });

    console.log("Swapped:", baseElement, targetElement);
}

export const displayElement = (element) => {
    console.log("displaying", element);
    const parent = element.parentElement.parentElement.parentElement;
    console.log("parent ->", parent);
    const placeHolder = parent.querySelector(".placeholder");
    const currentDD = parent.querySelector(".countries-dropdown");

    if(!element.matches(".countries-dropdown input")) {
        placeHolder.innerText = element.innerText;
        placeHolder.setAttribute("data-currency", element.getAttribute("data-currency"));
        deActivateDD([currentDD]);
    }

    if(parent.classList.contains("base-frame") && element.id != "myInput") {
        elements.baseCurrency.forEach(currency => {currency.innerText = element.getAttribute("data-currency")});
    } else if(parent.classList.contains("target-frame") && element.id != "myInput") {
        elements.targetCurrency.forEach(currency => {currency.innerHTML = element.getAttribute("data-currency")});
    }

    if([...parent.parentElement.querySelectorAll(".placeholder")].filter((element) => {
        return element.hasAttribute("data-currency");
    }).length === 2 && !element.matches(".countries-dropdown input")) {
        elements.lastUpdateFrame.classList.add("data-active");
    }
}

export const clickHandler = (event) => {
    console.log("clickHandler currentTarget:", event.currentTarget);
    event.stopPropagation();
    activateDD(event.currentTarget.querySelector("div"));
}

export const activateDD = target => {
    console.log(target);
    target.classList.add("data-active");
    target.querySelectorAll("a").forEach(subTarget => {
        subTarget.classList.add("data-active");
    })
    target.parentElement.style.overflow = "visible";
    target.parentElement.querySelector(".placeholder").style.display = "none";
}

export const deActivateDD = (target = document.querySelectorAll(".currency-frame>div>div")) => {
    console.log("closing dropdown ->", target);
    target.forEach(subTarget => {
        subTarget.classList.remove("data-active");
    });
    target.forEach(subTarget => {
        subTarget.querySelectorAll("a").forEach(subSubTarget => {
            subSubTarget.classList.remove("data-active");
        })
    })
    target.forEach(subSubTarget => {
        subSubTarget.parentElement.style.overflow = "hidden";
        subSubTarget.parentElement.querySelectorAll(".placeholder").forEach(subSubTarget => {
            subSubTarget.style.display = "flex";
        })
    })
}

export const filterData = (target, value) => {
    const parent = target.parentElement;
    const links = parent.querySelectorAll("a");
    links.forEach(link => {
        link.classList.add("data-active");
        if(!(link.dataset.currency.includes(value.toUpperCase()))) {
            link.classList.remove("data-active");
        }
    })
}

export const loadCountries = (countries, type) => {
    const loadTypes = {
        "dropdown": loadDropdown,
        "grid": loadGrid
    }

    const loader = loadTypes[type];

    if(loader) {
        console.log("loader function ->", loader);
        loader(countries);
    } else {
        console.error(`invalid load type ${type}`);
    }
}

export const loadDropdown = countries => {
    const newDD = document.createElement("div");
    newDD.classList.add("countries-dropdown");
    const newButton = document.createElement("button");
    newButton.setAttribute("data-active", "");
    newButton.classList.add("dropbtn");
    const newDiv = document.createElement("div");
    newDiv.id = "myDropdown";
    newDiv.classList.add("dropdown-content");
    const newInput = document.createElement("input");
    newInput.placeholder = "Search...";
    newInput.id = "myInput";
    newDiv.appendChild(newInput);
    newDD.appendChild(newButton);
    newDD.appendChild(newDiv)
    console.log(newDD);
    countries.forEach(country => {
        const newLink = document.createElement("a");
        newLink.innerHTML = `
        ${country.emoji} | ${country.currency} - ${country.iso}
        `;
        newLink.setAttribute("data-currency", country.currency);
        newDiv.appendChild(newLink);
    });
    elements.baseFrame.appendChild(newDD);
    const copyDD = newDD.cloneNode(true);
    elements.targetFrame.appendChild(copyDD);
}

export const loadGrid = countries => {
    const currencyDisplays = document.querySelectorAll(".currency-display");
    countries.forEach(country => {
        const newLabel = document.createElement("label");
        newLabel.setAttribute("data-currency", country.currency);
        newLabel.innerHTML = `
            <span class="currency-container">
                <div class="top-display">
                    <span class="flag">${country.emoji}</span> | <span class="iso">${country.currency}</span>
                </div>
                <div class="bottom-display"></div>
            </span>
        `;
        currencyDisplays.forEach(display => {
            display.appendChild(newLabel.cloneNode("true"));
        })
    });
}

export const initialize = async () => {

    console.log("initialize starting...");
    try {
        console.log("calling fetchData...")
        const countries = await fetchData();
        console.log("finished, result ->", countries);

        const loadHandlers = {
            "indexPage" : () => loadCountries(countries, "grid"),
            "exchangePage" : () => loadCountries(countries, "dropdown"),
        }
        console.log("getting pageID...");
        const pageID = document.body.id;
        console.log("finished, pageID ->", pageID);

        if(loadHandlers[pageID]) {
            console.log("items being loaded...")
            loadHandlers[pageID]();
            console.log("items loaded!");
        } else {
            console.warn("Unexpected page id ->", pageID);
        }
    } catch {
        console.warn("Error occured");
    }
}

export const fetchData = async () => {
    try {
        const response = await fetch("./countries.json");
        if(!response.ok) {
            throw new Error(`error status:${response.status}`);
        }
        const data = await response.json();
        const countries = data;
        console.log(countries);
        return countries;
    } catch (error) {
        console.error("Fetch Error", error);
    }
}

export const redirect = (target) => {
    const baseParent = document.querySelector(".base-frame");
    const targetParent = document.querySelector(".target-frame");
    const activeCurrencies = {
        base: baseParent.querySelector(".base-frame label.data-active").getAttribute("data-currency"),
        target: targetParent.querySelector(".target-frame label.data-active").getAttribute("data-currency"),
    }
    window.location.href = `${target}?base=${activeCurrencies.base}&target=${activeCurrencies.target}`;
}

export const activateGrid = (target) => {
    console.log(target.parentElement.parentElement.parentElement);
    const parent = target.parentElement.parentElement.parentElement;
    const activeGridsArray = [...parent.querySelectorAll("label")].filter(grid => {
        return grid.classList.contains("data-active");
    });

    if(activeGridsArray.length < 1) {
        target.classList.add("data-active");
        checkGrids();
    } else {
        activeGridsArray.forEach(grid => {
            grid.classList.remove("data-active");
        });
        target.classList.add("data-active");
        checkGrids();
    }
}

const checkGrids = () => {
    console.log("Checking grids for activation")
    const activeGrids = [...elements.gridCurrencies].filter((grid) => {
        return grid.classList.contains("data-active");
    });

    console.log(activeGrids)

    if(activeGrids.length === 2) {
        console.log("conditions are satisfied. button activated");
        elements.trackButton.classList.add("data-active");
        console.log(elements.trackButton);
    } else {
        console.log("conditions are not satisfied. button deactivated")
        elements.trackButton.classList.remove("data-active");
        console.log(elements.trackButton);
    }
}

export const fetchCurrencies = async (activeCurrencies = {
    base: elements.basePlaceholder.dataset.currency,
    target: elements.targetPlaceholder.dataset.currency
}) => {
    console.log(`fetching currency rates for ${activeCurrencies.base}...`);
    const api = new FetchWrapper(`https://v6.exchangerate-api.com/v6/${apiKey}`);
    const result = await api.get(`/latest/${activeCurrencies.base}`);
    console.log("results ->", result.conversion_rates);
    return result;
}

export const loadCSS = (path) => {
    if (document.querySelector(`link[href="${path}"]`)) {
        console.log(`${path} zaten yüklü.`);
    return;
    }
    const newLink = document.createElement("link");
    newLink.rel = 'stylesheet';
    newLink.type = 'text/css';
    newLink.href = path;
    newLink.onload = () => {
        document.body.style.visibility = 'visible';
        console.log(`${path} loaded successfully`);
    }
    newLink.onload = () => {
        document.body.style.visibility = 'visible';
        console.log(`error occured while loading ${path}`);
    }
    document.head.appendChild(newLink);
}