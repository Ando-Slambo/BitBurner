import { Root } from "/deploy/utils.js"
import { Files } from "/sourbatchkids/deplorables/utils.js"

const setup = "/sourbatchkids/deplorables/setup.js";

/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    const batchTarget = ns.args[0];
    const ram = ns.args[1] || 16384;
    const hostname = "bserv-" + batchTarget;

    const serverCost = ns.getPurchasedServerCost(ram);
    const purchaseApproved = await ns.prompt("Server costs " + ns.nFormat(serverCost, "$0.00a") + ". Continue?\n(Click no if server already purchased)")
    if (purchaseApproved) {
        var buyNewServer = true;
        if (ns.getPurchasedServers().includes(hostname)) {
            if (ns.getServerMaxRam(hostname) < ram) {
                ns.deleteServer(hostname);
            }
            else {
                buyNewServer = false;
            }
        }
        if (buyNewServer) {
            var newServ = ns.purchaseServer(hostname, ram);
            ns.tprintf("Purchased " + newServ + " with " + ns.nFormat(ram * 1000000000, "0b"));
        }
    }

    if (ns.getPurchasedServers().includes(hostname)) {
        if (!await Root(ns, batchTarget)) {
            ns.alert("Unable to root " + batchTarget);
            return;
        }
    
        ns.tprintf("Deploying files to " + hostname);
        for (var file of Files()) {
            await ns.scp(file, hostname);
        }
    
        ns.tprintf("Running setup on " + batchTarget);
        ns.exec(setup, hostname, 1, batchTarget);
    }
}