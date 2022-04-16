import {
    HireEmployees,
    AssignEmployees,
    AevumSpread,
    NormalSpread,
    UpgradeWarehouse
} from "/corps/utils.js"

import {
    ProductHandler,
    StartDevelopment,
    EmployeeHandler
} from "/corps/handlers.js"

const cities = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"];
const development_city = "Aevum";

/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    const division = ns.args[0];

    ns.corporation.expandIndustry("Tobacco", division);

    for (const city of cities) {
        if ( ns.corporation.getDivision(division).cities.includes(city) ) { continue }
        ns.corporation.expandCity(division, city);
    }

    for (const city of cities) {
        await UpgradeWarehouse(ns, division, city, 100);
        ns.corporation.setSmartSupply(division, city, true);
        if (city == development_city) {
            await HireEmployees(ns, division, city, 30);
            await ns.sleep(100);
            await AssignEmployees(ns, division, city, AevumSpread(30));
            continue;
        }
        await HireEmployees(ns, division, city, 10);
        await ns.sleep(100);
        await AssignEmployees(ns, division, city, NormalSpread(10));
    }

    if (ns.corporation.getDivision(division).products.length == 0) { StartDevelopment(ns, division, development_city) }
    while (true) {
        await ProductHandler(ns, division, development_city);
        await EmployeeHandler(ns, division, cities);
        await ns.sleep(10000);
    }
}