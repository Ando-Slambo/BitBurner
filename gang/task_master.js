import {
    Trainer,
    Recruiter,
    GetLowestStat,
    CheckAscension
} from "/gang/generals.js"

/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    //defining members array outside of loop so that the value is persistent across iterations
    let members = ns.gang.getMemberNames();

    while (true) {
        await ns.sleep(10000);

        //recruit if able and re-evaluate the members array
        if (ns.gang.canRecruitMember()) { Recruiter(ns) }
        if (members.length < ns.gang.getMemberNames().length) { members = ns.gang.getMemberNames() }


        for (const member of members) {
            //ascend member if they are ready
            await CheckAscension(ns, member);

            const lowest_stat = await GetLowestStat(ns, member);

            //if member's ascension multiplier is at least 30 they are done training, set to territory warfare
            if (lowest_stat >= 6000) { 
                if (ns.gang.getMemberInformation(member).task != "Territory Warfare") { ns.gang.setMemberTask(member, "Territory Warfare") }
                continue;
            }
            //if member's lowest stat is at least 1000 they are temporarily done training, set to human trafficking to gain rep to recruit
            //continue to next member if recruition quota is already met
            if (lowest_stat >= 1000) { 
                if (members.length >= 12) {
                    await Trainer(ns, member);
                    continue;
                }
                if (ns.gang.getMemberInformation(member).task != "Human Trafficking") { ns.gang.setMemberTask(member, "Human Trafficking") }
                continue;
            }
            //if member's lowest stat is at least 100 they are temporarily done training, set to mug people to gain rep to recruit
            //continue to next member if recruition quota is already met
            if (lowest_stat >= 100) { 
                if (members.length >= 7) {
                    await Trainer(ns, member);
                    continue;
                }
                if (ns.gang.getMemberInformation(member).task != "Mug People") { ns.gang.setMemberTask(member, "Mug People") }
                continue;
            }
            //default behavior if all if statements false
            await Trainer(ns, member);
        }
    }
}