let last_product;
let iteration;
let money_available;
let budget;

/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    const division = ns.args[0];
    const city = ns.args[1];

    StartDevelopment(ns, division, city);
    
    while (true) {
        if (ns.corporation.getProduct(division, iteration).developmentProgress >= 100) {
            let price = iteration * 2;
            price = "MP*" + price;
            ns.tprint("Price: " + price);

            ns.corporation.sellProduct(division, city, iteration, "MAX", price, true);
            await ns.sleep(1000);
            try { ns.corporation.setProductMarketTA2(division, iteration, true) }
            catch {  }
            finally { StartDevelopment(ns, division, city) }
        }
        await ns.sleep(3000);
    }
}

/** @param {import("../.vscode").NS} ns */
function StartDevelopment(ns, division, city) {
    last_product = ns.corporation.getDivision(division).products.pop() || 0;
    iteration = parseInt(last_product) + 1;
    money_available = ns.corporation.getCorporation().funds;
    budget = money_available / 20;

    if (iteration > 3) { ns.corporation.discontinueProduct(division, (iteration - 3)) }

    ns.print("Starting development of " + iteration);
    ns.corporation.makeProduct(division, city, iteration, budget, budget);
}