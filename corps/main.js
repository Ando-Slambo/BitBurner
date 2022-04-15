import {
    HireEmployees,
    AssignEmployees,
    AevumSpread,
    NormalSpread,
    UpgradeWarehouse
} from "/corps/utils.js"

const cities = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"];
const development_city = "Aevum";
const production_handler = "/corps/product-handler.js";
const employee_handler = "/corps/employee-handler.js";

/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    const tobacco_division = ns.args[0];

    ns.corporation.expandIndustry("Tobacco", tobacco_division);

    for (const city of cities) {
        if ( ns.corporation.getDivision(tobacco_division).cities.includes(city) ) { continue }
        ns.corporation.expandCity(tobacco_division, city);
    }

    for (const city of cities) {
        await UpgradeWarehouse(ns, tobacco_division, city, 100);
        ns.corporation.setSmartSupply(tobacco_division, city, true);
        if (city == development_city) {
            await HireEmployees(ns, tobacco_division, city, 30);
            await ns.sleep(100);
            await AssignEmployees(ns, tobacco_division, city, AevumSpread(30));
            continue;
        }
        await HireEmployees(ns, tobacco_division, city, 10);
        await ns.sleep(100);
        await AssignEmployees(ns, tobacco_division, city, NormalSpread(10));
    }

    await ns.sleep(100);
    ns.run(production_handler, 1, tobacco_division, development_city, 0);
    await ns.sleep(100);
    ns.run(employee_handler, 1, tobacco_division);
}