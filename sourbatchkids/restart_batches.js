const setup = "/sourbatchkids/deplorables/setup.js"
const targets = {
    "megacorp": 50,
    "ecorp": 50,
    "4sigma": 60,
    "clarkinc": 60
}

const keys = Object.keys(targets);
const values = Object.values(targets);

/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    for (var i = 0; i < keys.length; i++) {
        const host = "bserv-" + keys[i];
        ns.killall(host);
        ns.exec(setup, host, 1, keys[i], "restart", values[i]);
        ns.tprintf("Running setup on " + keys[i] + ". Monitor will automatically start when finished.");
    }
}