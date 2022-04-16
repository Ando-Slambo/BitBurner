let last_product;
let iteration;
let money_available;
let budget;

/** @param {import("../.vscode").NS} ns */
export function StartDevelopment(ns, division, city) {
    if (ns.corporation.getProduct(division, iteration).developmentProgress < 100) {
        return;
    }

    last_product = ns.corporation.getDivision(division).products.pop() || 0;
    iteration = parseInt(last_product) + 1;
    money_available = ns.corporation.getCorporation().funds;
    budget = money_available / 20;

    if (iteration > 3) { ns.corporation.discontinueProduct(division, (iteration - 3)) }

    ns.print("Starting development of " + iteration);
    ns.corporation.makeProduct(division, city, iteration, budget, budget);
}

/** @param {import("../.vscode").NS} ns */
export async function ProductHandler(ns, division, city) {
    if (ns.corporation.getProduct(division, iteration).developmentProgress >= 100) {
        let price = iteration * 2;
        price = "MP*" + price;

        ns.corporation.sellProduct(division, city, iteration, "MAX", price, true);
        await ns.sleep(1000);
        try { ns.corporation.setProductMarketTA2(division, iteration, true) }
        catch {  }

        StartDevelopment(ns, division, city)
    }
}



const aevum_differential = 60;
let aevum_first_upgrade = false;

/** @param {import("../.vscode").NS} ns */
export async function EmployeeHandler(ns, division, cities) {
    if (ns.corporation.getOffice(division, "Aevum").employees.length > 300) { return }

    const money_available = ns.corporation.getCorporation().funds;

    while (ns.corporation.getOffice(division, "Aevum").size < aevum_differential) {
        const office_size = ns.corporation.getOffice(division, "Aevum").employees.length;
        const upgrade_cost = ns.corporation.getOfficeSizeUpgradeCost(division, "Aevum", aevum_differential - office_size);

        if (money_available > upgrade_cost * 2) {
            await HireEmployees(ns, division, "Aevum", aevum_differential - office_size);
            await AssignEmployees(ns, division, "Aevum", AevumSpread(aevum_differential - office_size));
            aevum_first_upgrade = true;
        }
    }
    if (aevum_first_upgrade) {
        aevum_first_upgrade = false;
        return;
    }

    let upgrade_cost = 0;
    for (const city of cities) {
        upgrade_cost += ns.corporation.getOfficeSizeUpgradeCost(division, city, 30);
    }

    if (money_available > upgrade_cost * 2) {
        for (const city of cities) {
            await HireEmployees(ns, division, city, 30);
            await ns.sleep(100);
            if (city == "Aevum") {
                await AssignEmployees(ns, division, city, AevumSpread(30));
                continue;
            }
            await AssignEmployees(ns, division, city, NormalSpread(30));
        }
    }
}