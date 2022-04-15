import {
    HireEmployees,
    AssignEmployees,
    AevumSpread,
    NormalSpread
} from "/corps/utils.js"

const cities = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"];
const aevum_differential = 60;
let aevum_first_upgrade = false;

/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    const division = ns.args[0];
    
    while (true) {
        await ns.sleep(10000);

        const money_available = ns.corporation.getCorporation().funds;

        while ( ns.corporation.getOffice(division, "Aevum").size < aevum_differential + 10 ) {
            const office_size = ns.corporation.getOffice(division, "Aevum").employees.length;
            const upgrade_cost = ns.corporation.getOfficeSizeUpgradeCost(division, "Aevum", aevum_differential + 10 - office_size);

            if (money_available > upgrade_cost * 2) {
                await HireEmployees(ns, division, "Aevum", aevum_differential + 10 - office_size);
                await AssignEmployees(ns, division, "Aevum", AevumSpread(aevum_differential + 10 - office_size));
                aevum_first_upgrade = true;
            }
        }
        if (aevum_first_upgrade) {
            aevum_first_upgrade = false;
            continue;
        }

        let upgrade_cost = 0;
        for (const city of cities) {
            upgrade_cost += ns.corporation.getOfficeSizeUpgradeCost(division, city, 30);
        }

        const advert_cost = ns.corporation.getHireAdVertCost(division);
        if ( advert_cost < upgrade_cost && money_available > advert_cost * 2 ) {
            ns.corporation.hireAdVert(division);
            continue;
        }

        if (money_available > upgrade_cost * 2) {
            for (const city of cities) {
                HireEmployees(ns, division, city, 30);
                if (city == "Aevum") {
                    AssignEmployees(ns, division, city, AevumSpread(30));
                    continue;
                }
                AssignEmployees(ns, division, city, NormalSpread(30));
            }
        }

        if ( ns.corporation.getOffice(division, "Aevum").employees.length > 300 ) {
            ns.tprint("Employment finished.");
            return;
        }
    }
}