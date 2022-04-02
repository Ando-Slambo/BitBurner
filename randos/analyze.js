/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
	const endServer = ns.args[0];
	const stats = await GetStats(ns, endServer);
	const path = await GetPath(ns, endServer);
	var pathString = "home > ";

	ns.tprintf("\n" + endServer.toUpperCase() + " stats:");
	for (var stat of Object.keys(stats)) {
		ns.tprintf(stat + ": " + stats[stat].toString());
	}

	for (var i = 1; i < path.length; i++) {
		if (i < path.length - 1) {
			path[i] += " > ";
		}
		pathString += path[i];
	}
	ns.tprintf("\nPath to " + endServer + ":");
	ns.tprintf(pathString);
}

/** @param {import("../.vscode").NS} ns */
function GetPath(ns, endServer) {
	var path = [endServer];
	var scan = ns.scan(endServer);
	var scanning = true;

	while (scanning) {
		var parent = scan[0];
		scan = ns.scan(parent);
		if (parent == "home") {
			scanning = false;
		}
		path.unshift(parent);
	}
    return path;
}

/** @param {import("../.vscode").NS} ns */
function GetStats(ns, endServer) {
    var stats = {
        "Hacking level": 0,
        "Ports required": 0,
        "Growth": 0,
        "Min security": 0,
        "Max money": 0
    }

    stats["Hacking level"] = ns.getServerRequiredHackingLevel(endServer);
    stats["Ports required"] = ns.getServerNumPortsRequired(endServer);
    stats["Growth"] = ns.getServerGrowth(endServer);
    stats["Min security"] = ns.getServerMinSecurityLevel(endServer);
    const money = ns.getServerMaxMoney(endServer);
    stats["Max money"] = ns.nFormat(money, "$0.00a");

    return stats;
}