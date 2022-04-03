const home = "home";
const virus = "/deploy/hacknserv.js";
const weaken = "/deploy/weaken.js";

/** @param {import("../.vscode").NS} ns */
export function GetNetworkNodes(ns) {
    var targets = {};
    var stack = [];
    stack.push(home);

    while (stack.length > 0) {
        var node = stack.pop();
        if (!targets[node]) {
            targets[node] = node;
            var neighbors = ns.scan(node);

            for (var i = 0; i < neighbors.length; i++) {
                var child = neighbors[i];
                if (targets[child]){
                    continue;
                }
                stack.push(child);
            }
        }
    }
    return Object.keys(targets);
}

/** @param {import("../.vscode").NS} ns */
export async function Root(ns, target) {
    if (ns.hasRootAccess(target)) {
        return true;
    }

    const cracks = {
        "BruteSSH.exe": ns.brutessh,
        "FTPCrack.exe": ns.ftpcrack,
        "relaySMTP.exe": ns.relaysmtp,
        "HTTPWorm.exe": ns.httpworm,
        "SQLInject.exe": ns.sqlinject,
        "NUKE.exe": ns.nuke
    }

    ns.tprintf("Running cracks on " + target);
    for (var crack of Object.keys(cracks)){
        if (ns.fileExists(crack, home)){
            var runScript = cracks[crack];
            try {
                await runScript(target);
            }
            finally {
                continue;
            }
        }
    }

    return ns.hasRootAccess(target);
}

/** @param {import("../.vscode").NS} ns */
export async function DeployVirus(ns, target, hackTarget) {
    await ns.scp(virus, target);
    if (await ns.scriptKill(virus, target)) {
        ns.tprintf("Killing processes on " + target);
    }
    var ramAvail = ns.getServerMaxRam(target) - ns.getServerUsedRam(target);
    var maxThreads = Math.floor(ramAvail / ns.getScriptRam(virus));
    if (maxThreads > 0){
        await ns.exec(virus, target, maxThreads, hackTarget);
        ns.tprintf("Running hacknserv from " + target + " on " + hackTarget);
    }
}

/** @param {import("../.vscode").NS} ns */
export async function DeployWeaken(ns, target, hackTarget) {
    await ns.scp(weaken, target);
    if (await ns.killall(target)) {
        ns.tprintf("Killing processes on " + target);
    }
    var ramAvail = ns.getServerMaxRam(target) - ns.getServerUsedRam(target);
    var maxThreads = Math.floor(ramAvail / ns.getScriptRam(weaken));
    if (maxThreads > 0){
        await ns.exec(weaken, target, maxThreads, hackTarget);
        ns.tprintf("Running weaken from " + target + " on " + hackTarget);
    }
}