import { GetNetworkNodes } from "/deploy/utils.js"

/** @param {import("../.vscode").NS} ns */
export async function main(ns) {    
    for (var server of GetNetworkNodes(ns)) {
        if (server == "home") {
            continue;
        }
        if (ns.hasRootAccess(server)) {
            ns.killall(server);
        }
    }
}