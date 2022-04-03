global.fetch = require("node-fetch");

import {OpenFoodFactsApi} from "openfoodfac-ts";

export const nutritionClient = new OpenFoodFactsApi();