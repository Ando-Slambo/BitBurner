/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
	while (true) {
		await ns.share();
	}
}