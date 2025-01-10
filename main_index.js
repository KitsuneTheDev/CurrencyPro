import { setupEventListeners } from "./eventListener.js";
import { initialize } from "./functions.js";

initialize().then(() => {
    setupEventListeners();
});