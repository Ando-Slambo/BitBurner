import { Recruiter } from "/gang/recruiter.js";

import {
    Trainer,
    GetLowestStat,
    BonusTime
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

        BonusTime(ns, members);

        phase = await CheckPhase(ns, members);
        if (phase != "complete") {

            if (phase == 1) {
                await Trainer(ns, members);
                continue;
            }
    
            if (phase == 2) {
                if (members.length < 7) {
                    for (const member of members) {
                        ns.gang.setMemberTask(member, "Mug People");
                    }
                    continue;
                }
                await Trainer(ns, members);
            }
    
            if (phase == 3) {
                if (members.length < 12) {
                    for (const member of members) {
                        ns.gang.setMemberTask(member, "Human Trafficking");
                    }
                    continue;
                }
                for (const member of members) {
                    ns.gang.setMemberTask(member, "Territory Warfare");
                }
                phase = "complete";
            }
        }
    }
}

/** @param {import("../.vscode").NS} ns */
async function CheckPhase(ns, members) {
    let eval_members = [];

    for (const member of members) {
        eval_members.push(await GetLowestStat(ns, member));
    }

    var lowest_stat;

    for (var i = 0; i < eval_members.length - 1; i++) {
        lowest_stat = Math.min(eval_members[i], eval_members[i + 1]);
    }

    if (lowest_stat < 100) {
        return 1;
    }
    if (lowest_stat < 1000) {
        return 2
    }
    return 3;
}