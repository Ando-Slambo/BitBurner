/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    const server = ns.args[0];
    if (ns.deleteServer(server)) {
        ns.tprint("Deleted " + server);
    }
}