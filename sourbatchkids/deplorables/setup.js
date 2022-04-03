const grow = "/sourbatchkids/deplorables/grow.js";
const weaken = "/sourbatchkids/deplorables/weaken1.js";
const monitor = "/sourbatchkids/deplorables/monitor.js";

/** @param {import("../../.vscode").NS} ns */
export async function main(ns) {
    const batchTarget = ns.args[0];
    //const modifier = ns.args[1] || undefined;     //used to be used in last if statement
    //const percentToSteal = ns.args[2] || 20;      //(must still be passed if restarting batches)
    const host = ns.getHostname();
    const weakenTime = ns.getWeakenTime(batchTarget);
    const maxMoney = ns.getServerMaxMoney(batchTarget);
    const minSecurity = ns.getServerMinSecurityLevel(batchTarget);

    //Initial weaken threads
    var weakenThreads = (ns.getServerSecurityLevel(batchTarget) - minSecurity) / 0.05;

    //Grow threads
    var growThreads = ns.growthAnalyze(batchTarget, ( maxMoney / ns.getServerMoneyAvailable(batchTarget) ));
    if (growThreads < 1) {
        growThreads = 1;
    }
    weakenThreads += (growThreads * 0.004) / 0.05;

    weakenThreads = Math.ceil(weakenThreads / batchesRequired);
    growThreads = Math.ceil(growThreads / batchesRequired);

    //RAM requirements
    const availRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
    var requiredRam = (ns.getScriptRam(grow) * growThreads) + (ns.getScriptRam(weaken) * weakenThreads);

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

    if (ns.args[1] == "restart") {
        ns.run(monitor, 1, batchTarget, ns.args[2]);
    }
}