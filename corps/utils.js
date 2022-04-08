const jobs = ["Operations", "Engineer", "Business", "Management", "Research & Development", "Training", "Unassigned"];

/** @param {import("../.vscode").NS} ns */
async function HireEmployees(ns, division, city, amount) {
    for (let i = 0; i < amount; i++) {
        ns.corporation.hireEmployee(division, city);
    }
}

/** @param {import("../.vscode").NS} ns */
async function AssignEmployees(ns, division, city, spread) {
    //spread array must be 7 indexes with the last index being 0
    for ( const job of jobs ) {
        for ( const employee of ns.corporation.getOffice(division, city).employees ) {
            if ( ns.corporation.getOffice(division, city).employeeProd[job] < spread[jobs.indexOf(job)] ) { await ns.corporation.assignJob(division, city, employee, job); }
        }
    }
}

/** @param {import("../.vscode").NS} ns */
async function UpgradeWarehouse(ns, division, city, capacity) {
    if (!ns.corporation.hasWarehouse(division, city)) { ns.corporation.purchaseWarehouse(division, city) }
    while (ns.corporation.getWarehouse(division, city).size < capacity) {
        ns.corporation.upgradeWarehouse(division, city);
        await ns.sleep(100);
    }
    return;
}

/** @param {import("../.vscode").NS} ns */
async function UpgradeUnlocks(ns, upgrades) {
    //upgrades must be an object
    const names = Object.keys(upgrades);
    const amount = Object.values(upgrades);

    for (let i = 0; i < names.length; i++) {
        while (amount[i] < ns.corporation.getUpgradeLevel(names[i])) {
            ns.corporation.levelUpgrade(names[i]);
            amount[i]++;
        }
    }
    return;
}

/** @param {import("../.vscode").NS} ns */
async function BuyMaterials(ns, division, city, materials) {
    //materials parameter must be an object
    const materialArray = Object.keys(materials);

    const targetAmount = Object.values(materials);
    const currentAmount=[];

    for (let i = 0; i < materialArray.length; i++) {
        while (true) {
            currentAmount[i] = ns.corporation.getMaterial(division, city, materialArray[i]).qty;
            if ( currentAmount[i] >= targetAmount[i] ) { break }
            const amountToBuy = (targetAmount[i] - currentAmount[i]) / 10;
            ns.corporation.buyMaterial(division, city, materialArray[i], amountToBuy);
            await ns.sleep(1000);
        }
        ns.corporation.buyMaterial(division, city, materialArray[i], 0);
    }
}