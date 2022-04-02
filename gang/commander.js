import { GetLowestStat } from "/gang/trainer.js";

/** @param {import("../.vscode").NS} ns */
export async function Commander(ns, members) {
    const skillCap = 1000;

    if (ns.gang.getBonusTime() > 0) { return; }

    for (const member of members) {
        if (await GetLowestStat(ns, member) > skillCap) {
            ns.gang.setMemberTask(member, "Territory Warfare");
        }
    }

    return;
}