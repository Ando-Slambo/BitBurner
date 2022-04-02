/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    var hostname = ns.args[0];
    var ram = ns.args[1];

    ns.tprint("Purchased " + ns.purchaseServer(hostname, ram));
}