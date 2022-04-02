/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    for (var i = 1; i < 21; i++){
        var ramAmount = Math.pow(2, i);
        const cost = ns.getPurchasedServerCost(ramAmount);
        ns.tprint(ramAmount + "GB :" + ns.nFormat(cost, "$0.00a"));
    }
}