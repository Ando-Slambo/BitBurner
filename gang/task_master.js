import { Recruiter } from "/gang/recruiter.js";

import { Commander } from "/gang/commander.js";

import {
    Trainer,
    GetLowestStat,
    CheckAscension
} from "/gang/trainer.js"

/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    var phase = 0;

    //Calls the function 3 times to start gang with 3 members
    Recruiter(ns);
    Recruiter(ns);
    Recruiter(ns);
    var members = ns.gang.getMemberNames();

    while (true) {
        await ns.sleep(10000);

        if (members.length < 12) {
            Recruiter(ns);
            members = ns.gang.getMemberNames();
        }


        phase = await CheckPhase(ns, members);
        switch (phase) {
            case "bonus time begin":
                await CheckAscension(ns, members);
                await Trainer(ns, members);

            case "bonus time end":
                await Trainer(ns, members);

            case 1:
                await Trainer(ns, members);
                await Commander(ns, members);
                continue;

            case 2:
                if (members.length < 7) {
                    for (const member of members) {
                        ns.gang.setMemberTask(member, "Mug People");
                    }
                    continue;
                }
                await Trainer(ns, members);
                await Commander(ns, members);
                continue;

            case 3:
                if (members.length < 12) {
                    for (const member of members) {
                        ns.gang.setMemberTask(member, "Human Trafficking");
                    }
                    continue;
                }
                for (const member of members) {
                    ns.gang.setMemberTask(member, "Territory Warfare");
                }
        }
    }
}

/** @param {import("../.vscode").NS} ns */
async function CheckPhase(ns, members) {
    if (ns.gang.getBonusTime() > 1800) { return "bonus time begin" }

    if (ns.gang.getBonusTime() <= 1800) { return "bonus time end" }

    let eval_members = [];

    for (const member of members) {
        eval_members.push(await GetLowestStat(ns, member));
    }

    const lowest_stat = Math.min(...eval_members);

    if (lowest_stat < 100) { return 1 }
    if (lowest_stat < 1000) { return 2 }
    return 3;
}