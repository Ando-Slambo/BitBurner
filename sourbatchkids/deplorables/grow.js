/** @param {import("../../.vscode").NS} ns */
export async function main(ns) {
    const target = ns.args[0];
    const preWait = ns.args[1];
    const batchID = ns.args[2];


    await ns.sleep(preWait);
    await ns.grow(target);
}