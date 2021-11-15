global.fetch = require("node-fetch");

const {OpenFoodFactsApi} = require("openfoodfac-ts");

const nutritionClient = new OpenFoodFactsApi();

module.exports = {nutritionClient};