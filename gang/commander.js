import { GetLowestStat } from "/gang/trainer.js";

/** @param {import("../.vscode").NS} ns */
export async function Commander(ns, members) {
    const skillCap = 1000;

    for (const member of members) {
        const lowest_stat = await GetLowestStat(ns, member);
        if (lowest_stat > skillCap) { ns.gang.setMemberTask(member, "Territory Warfare"); }
    }

    return;
}