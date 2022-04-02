/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    const batchTarget = ns.args[0];
    const hostname = "bserv-" + batchTarget;
    const estimator = "/sourbatchkids/deplorables/estimator.js";

    ns.exec(estimator, hostname, 1, batchTarget);
}