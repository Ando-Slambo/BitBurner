const grow = "/sourbatchkids/deplorables/grow.js";
const weaken = "/sourbatchkids/deplorables/weaken1.js";
const monitor = "/sourbatchkids/deplorables/monitor.js";

/** @param {import("../../.vscode").NS} ns */
export async function main(ns) {
    const batchTarget = ns.args[0];
    const modifier = ns.args[1] || undefined;
    const percentToSteal = ns.args[2] || 20;
    const host = ns.getHostname();
    const growRam = ns.getScriptRam(grow);
    const weakenRam = ns.getScriptRam(weaken);
    const weakenTime = ns.getWeakenTime(batchTarget);

    const maxMoney = ns.getServerMaxMoney(batchTarget);
    const currentMoney = ns.getServerMoneyAvailable(batchTarget);
    const minSecurity = ns.getServerMinSecurityLevel(batchTarget);
    const currentSecurity = ns.getServerSecurityLevel(batchTarget);

    //Initial weaken threads
    const securityDifferential = currentSecurity - minSecurity;
    var weakenThreads = securityDifferential / 0.05;

    //Grow threads
    const growthMultiplier = maxMoney / currentMoney;
    var growThreads = ns.growthAnalyze(batchTarget, growthMultiplier);
    if (growThreads < 1) {
        growThreads = 1;
    }
    const growthSecurityRaise = growThreads * 0.004;
    weakenThreads += growthSecurityRaise / 0.05;

    weakenThreads = Math.ceil(weakenThreads / batchesRequired);
    growThreads = Math.ceil(growThreads / batchesRequired);

    //RAM requirements
    const availRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
    var requiredRam = (growRam * growThreads) + (weakenRam * weakenThreads);

    //Splits the scripts into multiple batches if they cannot all be run at once;
    var batchesRequired = 1;
    while (requiredRam > availRam) {
        requiredRam -= availRam;
        batchesRequired++;
    }

    ns.print("Batches required: " + batchesRequired);

    //Runs setup operations
    for (var i = 0; i < batchesRequired; i++) {
        ns.run(weaken, weakenThreads, batchTarget, 0, i);
        await ns.sleep(10);
        ns.run(grow, growThreads, batchTarget, 0, i);
        await ns.sleep(weakenTime + 1000);
    }
    ns.tprintf("\nSetup on " + batchTarget + " finished.");
    ns.tprintf("Max money: " + ns.nFormat(maxMoney, "$0.00a"));
    ns.tprintf("Current money: " + ns.nFormat(ns.getServerMoneyAvailable(batchTarget), "$0.00a"));
    ns.tprintf("\nMin Security: " + minSecurity);
    ns.tprintf("Current security: " + ns.getServerSecurityLevel(batchTarget));

    if (modifier == "restart") {
        ns.run(monitor, 1, batchTarget, percentToSteal);
    }
}