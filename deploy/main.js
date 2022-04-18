import {
    GetNetworkNodes,
    Root,
    DeployWeaken,
    DeployVirus,
    DeployShare
} from "/deploy/utils.js";

/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    const targets = GetNetworkNodes(ns);
    const purchasedServers = ns.getPurchasedServers();
    const modifier = ns.args[0];

    if (modifier == "share") {
        await DeployShare(ns, targets);
        await DeployShare(ns, purchasedServers);
        return;
    }
    
    const hackTarget = ns.args[1];

    if (!await Root(ns, hackTarget) || purchasedServers.includes(target)) {
        ns.tprintf("Unable to root target, pick another server.");
        return;
    }
    
    for (var target of targets){
        if (target == "home") { continue }

        if (await Root(ns, target)){
            if (modifier == "weaken") { await DeployWeaken(ns, target, hackTarget) }
            else if (modifier == "virus") { await DeployVirus(ns, target, hackTarget) }
        }
    }
}