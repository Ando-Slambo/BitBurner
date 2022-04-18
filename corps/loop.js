import {
    ProductHandler,
    StartDevelopment,
    EmployeeHandler
} from "/corps/handlers.js"

const cities = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"];

/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    const division = ns.args[0];
    const development_city = "Aevum";

    let iteration;
    const last_product = await parseInt(ns.corporation.getDivision(division).products.pop());

    if (!last_product) {
        iteration = 1;
        await StartDevelopment(ns, division, development_city, iteration);
    }
    else {
        iteration = last_product;
    }


    while (true) {
        iteration += await ProductHandler(ns, division, development_city, iteration);
        await EmployeeHandler(ns, division, cities);
        await ns.sleep(10000);
    }
}