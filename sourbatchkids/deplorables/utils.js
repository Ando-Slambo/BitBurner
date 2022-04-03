const hack = "/sourbatchkids/deplorables/hack.js";
const grow = "/sourbatchkids/deplorables/grow.js";
const weaken1 = "/sourbatchkids/deplorables/weaken1.js";
const weaken2 = "/sourbatchkids/deplorables/weaken2.js";
const monitor = "/sourbatchkids/deplorables/monitor.js";
const utils = "/sourbatchkids/deplorables/utils.js";
const setup = "/sourbatchkids/deplorables/setup.js";
const estimator = "/sourbatchkids/deplorables/estimator.js"
const files = [hack, grow, weaken1, weaken2, monitor, utils, setup, estimator];

var originServer;
var originServerRam;
var targetServer;

var hackRam;
var growRam;
var weakenRam;
var batchRam;
var batches;

var hackThreads;
var growThreads;
var weakenThreads1;
var weakenThreads2;

//times are in ms
var hackTime;
var hackPreWaitTime;
var growTime;
var growPreWaitTime;
var weakenTime;
var weaken1PreWaitTime;
var weaken2PreWaitTime;
var batchTime;
const executionWindow = 150;
const operationDelay = executionWindow / 3;


/** @param {import("../../.vscode").NS} ns */
export function Constructor(ns, batchTarget) {
    ns.disableLog("ALL");
    originServer = ns.getHostname();
    originServerRam = ns.getServerMaxRam(originServer) - ns.getServerUsedRam(originServer);
    targetServer = batchTarget;

    growRam = ns.getScriptRam(grow);
    hackRam = ns.getScriptRam(hack);
    weakenRam = ns.getScriptRam(weaken1);
}

/** @param {import("../../.vscode").NS} ns */
export function Calculations(ns, percentToSteal) {
    //Hack thread calculation
    hackThreads = ns.hackAnalyzeThreads(targetServer, ns.getServerMaxMoney(targetServer) * (percentToSteal / 100)); //Divide by 100 to convert percent to decimal
    //Amount of weaken threads to offset hack security raise
    weakenThreads1 = (hackThreads * 0.002) / 0.05;

    growThreads = ns.growthAnalyze(targetServer, 1 / (1 - hackThreads * ns.hackAnalyze(targetServer))) * 1.1;
    //Amount of weaken threads to offset grow security raise
    weakenThreads2 = (growThreads * 0.004) / 0.05;

    hackThreads = Math.floor(hackThreads);
    growThreads = Math.ceil(growThreads);
    weakenThreads1 = Math.ceil(weakenThreads1);
    weakenThreads2 = Math.ceil(weakenThreads2);
    
    //Times
    growTime = ns.getGrowTime(targetServer);
    hackTime = ns.getHackTime(targetServer);
    weakenTime = ns.getWeakenTime(targetServer);

    batchTime = weakenTime + operationDelay * 2;

    hackPreWaitTime = batchTime - (3 * operationDelay) - hackTime;
    growPreWaitTime = batchTime - operationDelay - growTime;
    weaken2PreWaitTime = batchTime - weakenTime;
    weaken1PreWaitTime = 0;

    //Number of batches
    batchRam = (hackRam * hackThreads) + (growRam * growThreads) + (weakenRam * (weakenThreads1 + weakenThreads2));
    batches = Math.floor(originServerRam / batchRam);

    return batchTime;
}

/** @param {import("../../.vscode").NS} ns */
export async function ExecuteBatches(ns) {
    for (var i = 0; i < batches; i++) {
        ns.exec(weaken1, originServer, weakenThreads1, targetServer, weaken1PreWaitTime, i);
        await ns.sleep(1);
        ns.exec(weaken2, originServer, weakenThreads2, targetServer, weaken2PreWaitTime, i);
        await ns.sleep(1);
        ns.exec(grow, originServer, growThreads, targetServer, growPreWaitTime, i);
        await ns.sleep(1);
        ns.exec(hack, originServer, hackThreads, targetServer, hackPreWaitTime, i);
        await ns.sleep(operationDelay);
    }
}

/** @param {import("../../.vscode").NS} ns */
export function Files() {
    return files;
}