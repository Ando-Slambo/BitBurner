import {
    GetNetworkNodes,
    Root,
    DeployWeaken,
    DeployVirus
} from "/deploy/utils.js";

/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    const purchasedServers = ns.getPurchasedServers();
    const modifier = ns.args[0];
    const hackTarget = ns.args[1];

    if (!Root(ns, hackTarget)) {
        ns.tprintf("Unable to root target, pick another server.");
        return;
    }

    const targets = GetNetworkNodes(ns);
    
    for (var target of targets){
        if (target == "home" || purchasedServers.includes(target)) {
            continue;
        }

        if (await Root(ns, target)){
            if (modifier == "weaken") {
                await DeployWeaken(ns, target, hackTarget);
            }
            else if (modifier == "virus") {
                await DeployVirus(ns, target, hackTarget);
            }
        }
    }
}