import { GetNetworkNodes } from "/deploy/utils.js"

/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    const targets = GetNetworkNodes(ns);
    const filter = ns.args[0] || 1;

	for (var target of Object.values(targets)) {
        if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(target) * 1.5 || ns.getServerMaxMoney(target) < filter) { continue }
        var growth = ns.getServerGrowth(target);
        var minSec = ns.getServerMinSecurityLevel(target);
        var ratio = growth / minSec;
        var hackingLvl = ns.getServerRequiredHackingLevel(target);
        var maxMoney = ns.nFormat(ns.getServerMaxMoney(target), "$0.00a");
        ns.tprintf("\n" + target.toUpperCase() + ":");
        ns.tprintf("Hacking level: " + hackingLvl);
        ns.tprintf("Growth/security ratio: " + ratio.toFixed(2));
        ns.tprintf("Max money: " + maxMoney);
	}
}