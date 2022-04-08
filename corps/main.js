import {
    HireEmployees,
    AssignEmployees,
    UpgradeWarehouse,
    UpgradeUnlocks,
    BuyMaterials
} from "/corps/utils.js"

const agrDiv = "seed-0"
const cities = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"];
const employmentSpread = [1, 1, 1, 0, 0, 0, 0];
const upgrades = {
    "Focus Wires": 2,
    "Neural Accelerators": 2,
    "Speech Processor Implants": 2,
    "Nuoptimal Nootropic Injector Implants": 2,
    "Smart Factories": 2
}
const materials = {
    "Hardware": 125,
    "Robots": 0,
    "AI Cores": 75,
    "Real Estate": 27000
}

/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    //Create corporation, create agriculture industry, unlock smart supply
    ns.corporation.createCorporation("Sneed\'s Seed and Feed", false); //false will only work on bitnode 3
    ns.corporation.expandIndustry("Agriculture", agrDiv);
    ns.corporation.unlockUpgrade("Smart Supply");

    //Expand division to all cities
    for (const city of cities) {
        if (ns.corporation.getDivision().cities.includes(city)) { continue }
        ns.corporation.expandCity(agrDiv, city);
    }

    //Enable smart supply, hire and assign employees, upgrade warehouses, and start selling in all cities
    for (const city of cities) {
        ns.corporation.setSmartSupply(agrDiv, city, true);

        await HireEmployees(ns, agrDiv, city, 3);
        await AssignEmployees(ns, agrDiv, city, employmentSpread);

        ns.corporation.hireAdVert(agrDiv);

        await UpgradeWarehouse(ns, agrDiv, city, 300);

        ns.corporation.sellMaterial(agrDiv, city, "Plants", "MAX", "MP");
        ns.corporation.sellMaterial(agrDiv, city, "Food", "MAX", "MP");
    }

    //Buy upgrades
    await UpgradeUnlocks(ns, upgrades);

    //Buy materials in all cities
    for (const city of cities) {
        await BuyMaterials(ns, agrDiv, city, materials);
    }

    //Wait for investment offer to reach $210b then accept
    while (ns.corporation.getInvestmentOffer().funds < 210000000000) { await ns.sleep(3000) }
    ns.corporation.acceptInvestmentOffer();

    //Increase employee capacity, hire employees, fill jobs as specified in array
    for (const city of cities) {
        ns.corporation.upgradeOfficeSize(agrDiv, city, 6);
        HireEmployees(ns, agrDiv, city, 6);
        employmentSpread = [2, 2, 1, 2, 2, 0, 0]
        await AssignEmployees(ns, agrDiv, city, employmentSpread);
    }

    //Update upgrade object and buy upgrades
    upgrades = {
        "Smart Factories": 10,
        "Smart Storage": 10
    }
    await UpgradeUnlocks(ns, upgrades);

    //Upgrade all warehouses to 2k capacity
    for (const city of cities) {
        await UpgradeWarehouse(ns, agrDiv, city, 2000);
    }

    //Update materials object and buy materials
    for (const city of cities) {
        materials = {
            "Hardware": 2800,
            "Robots": 96,
            "AI Cores": 2520,
            "Real Estate": 146400
        }
        await BuyMaterials(ns, agrDiv, city, materials);
    }

    //Wait for investment offer to reach $5t then accept
    while (ns.corporation.getInvestmentOffer().funds < 5000000000000) { await ns.sleep(3000) }
    ns.corporation.acceptInvestmentOffer();

    //Upgrade all warehouses to 3.8k capacity
    for (const city of cities) {
        await UpgradeWarehouse(ns, agrDiv, city, 3800);
    }

    //Update materials object and buy materials
    for (const city of cities) {
        materials = {
            "Hardware": 9300,
            "Robots": 726,
            "AI Cores": 6270,
            "Real Estate": 230400
        }
        await BuyMaterials(ns, agrDiv, city, materials);
    }
}
