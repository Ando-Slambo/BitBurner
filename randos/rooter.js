import { Root } from "/deploy/utils.js"

/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
	const target = ns.args[0];
    
    if (await Root(ns, target)) {
        ns.tprintf("Rooted " + target);
    }
    else {
        ns.tprintf("Unable to root " + target);
    }
}