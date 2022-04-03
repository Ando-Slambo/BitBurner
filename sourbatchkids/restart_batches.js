const setup = "/sourbatchkids/deplorables/setup.js"
const targets = {
    //"name": percentage,
//ex: 4sigma: 10
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

export function Start(ns) {
    for (var i = 0; i < keys.length; i++) {
        const host = "bserv-" + keys[i];
        ns.exec(setup, host, 1, keys[i], "restart", values[i]);
        ns.tprintf("Starting monitor.js on " + host);
    }
}