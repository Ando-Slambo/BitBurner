import {
    Constructor,
    Calculations,
    ExecuteBatches
} from "/sourbatchkids/deplorables/utils.js"

const grow = "/sourbatchkids/deplorables/grow.js";
const weaken = "/sourbatchkids/deplorables/weaken1.js";

/** @param {import("../../.vscode").NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    const batchTarget = ns.args[0];
    const percentToSteal = ns.args[1] || 20;

    Constructor(ns, batchTarget);

    var growThreads;
    var weakenThreads;
    var batchTime;
    while (true) {
        //Checks to make sure batch target is fully grown and weakened before running next batch
        growThreads = 0;
        weakenThreads = 0;
        if (ns.getServerMaxMoney(batchTarget) != ns.getServerMoneyAvailable(batchTarget)) {
            var growthMultiplier = ns.getServerMaxMoney(batchTarget) / ns.getServerMoneyAvailable(batchTarget);
    
            growThreads += Math.ceil(ns.growthAnalyze(batchTarget, growthMultiplier));
            weakenThreads += Math.ceil( (growThreads * 0.004) / 0.05 );
            
            await ns.run(grow, growThreads, batchTarget, 1, 999);
        }

        if (ns.getServerSecurityLevel(batchTarget) != ns.getServerMinSecurityLevel(batchTarget) || weakenThreads > 0) {
            var weakenDifferential = ns.getServerSecurityLevel(batchTarget) - ns.getServerMinSecurityLevel(batchTarget);

            weakenThreads += Math.ceil(weakenDifferential / 0.05);
            
            await ns.run(weaken, weakenThreads, batchTarget, 1, 999);
            await ns.sleep(ns.getWeakenTime(batchTarget) + 3000);
        }
        
        batchTime = Calculations(ns, percentToSteal);
        await ExecuteBatches(ns);
        await ns.sleep(batchTime);
    }
}