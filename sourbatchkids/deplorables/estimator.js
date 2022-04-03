const line = "─";

/** @param {import("../../.vscode").NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    const batchTarget = ns.args[0];
    const ram = ns.getServerMaxRam(ns.getHostname()) - ns.getScriptRam("/sourbatchkids/deplorables/monitor.js");

    await PrintBanner(ns, batchTarget);
    for (var i = 1; i < 101; i++) {
        var returns = await Calculations(ns, batchTarget, i, ram);
        if (returns[2] < 1 || returns[2] > 101) { continue }
        await PrintResults(ns, returns);
        await ns.sleep(50);
    }
    ns.tprintf("|" + line.padEnd(29, line) + "|");
    await ns.sleep(50);
}

/** @param {import("../../.vscode").NS} ns */
function Calculations(ns, batchTarget, percentToSteal, ram) {
    const targetServer = batchTarget;
    const targetServerMaxMoney = ns.getServerMaxMoney(targetServer);
    const executionWindow = 150;
    const operationDelay = executionWindow / 3;
    const growRam = ns.getScriptRam("/sourbatchkids/deplorables/grow.js");
    const hackRam = ns.getScriptRam("/sourbatchkids/deplorables/hack.js");
    const weakenRam = ns.getScriptRam("/sourbatchkids/deplorables/weaken1.js");
    const decimalToSteal = percentToSteal / 100;

    //Hack thread calculation
    const hackThreads = Math.floor(ns.hackAnalyzeThreads(targetServer, targetServerMaxMoney * decimalToSteal));
    //Amount of weaken threads to offset hack security raise
    const weakenThreads1 = Math.ceil( (hackThreads * 0.002) / 0.05 );

    //Grow threads calculation
    const growThreads = Math.ceil((ns.growthAnalyze(targetServer, 1 / (1 - hackThreads * ns.hackAnalyze(targetServer)))) * 1.02);
    //Amount of weaken threads to offset grow security raise
    const weakenThreads2 = Math.ceil( (growThreads * 0.004) / 0.05 );

    const batchTime = ns.getWeakenTime(targetServer) + operationDelay * 2;

    //Number of batches
    const batchRam = (hackRam * hackThreads) + (growRam * growThreads) + (weakenRam * (weakenThreads1 + weakenThreads2));
    const batches = Math.floor(ram / batchRam);

    const estimatedAmount = (batches * targetServerMaxMoney * decimalToSteal) / ((batchTime + operationDelay) / 1000);
    return [percentToSteal, ns.nFormat(estimatedAmount, "$0.0a"), batches];
    //ns.tprintf("Estimated cashflow: $" + estimatedAmount + "m/s at " + percentToSteal + "%% theft with " + batches + " batches");
}

/** @param {import("../../.vscode").NS} ns */
async function PrintBanner(ns, server){
    var localServer = server.toUpperCase().split('').join(' ');
    var lineLength = 29;
    var prefill = Math.floor( (lineLength - localServer.length) / 2 );
    localServer = localServer.padStart(prefill + localServer.length);
    localServer = localServer.padEnd(lineLength);
    ns.tprintf("=".padEnd(lineLength+2,"="));
    await ns.sleep(50);
    ns.tprintf("|" + line.padEnd(lineLength, line) + "|");
    await ns.sleep(50);
    ns.tprintf("|" + localServer + "|");
    await ns.sleep(50);
    ns.tprintf("|" + line.padEnd(lineLength, line) + "|");
    await ns.sleep(50);
    ns.tprintf("| Theft %% | $ / sec | Batches |");
    await ns.sleep(50);
}

/** @param {import("../../.vscode").NS} ns */
async function PrintResults(ns, inputs) {
    const percentToSteal = inputs[0].toString();
    const estimatedAmountString = inputs[1];
    const batches = inputs[2].toString();
    
    ns.tprintf("| " + percentToSteal.padStart(6) + "%% | " +  estimatedAmountString.padStart(7) + " | " + batches.padStart(7) + " |");
}