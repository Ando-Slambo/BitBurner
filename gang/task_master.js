import {
    Trainer,
    Recruiter,
    GetLowestStat,
    GetAscensionMults,
    CheckAscension
} from "/gang/generals.js"

//defining bools in module scope so both functions can access them
let bonusTimeStart = false;
let bonusTimeEnd = false;

/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    //defining members array outside of loop so that the value is persistent across iterations
    let members = [];

    while (true) {
        await ns.sleep(10000);

        //recruit if able and re-evaluate the members array
        if (ns.gang.canRecruitMember()) {
            Recruiter(ns);
            members = ns.gang.getMemberNames();
        }

        //set members to train their needed stat
        await Trainer(ns, members);
        
        CheckBonusTime(ns);

        //ascend members that are ready or skip the loop if bonus time is ending
        if (bonusTimeStart) { await CheckAscension(ns, members) }
        else if (bonusTimeEnd) { continue }

        for (const member of members) {
            const lowest_stat = GetLowestStat(ns, member);

            //if member's ascension multiplier is at least 30 they are done training, set to territory warfare
            if (Math.min(...GetAscensionMults(ns, member) >= 30)) { 
                if (ns.gang.getMemberInformation().task != "Territory Warfare") { ns.gang.setMemberTask(member, "Territory Warfare") }
                continue;
            }
            //if member's lowest stat is at least 1000 they are temporarily done training, set to human trafficking to gain rep to recruit
            if (lowest_stat >= 1000) { 
                if (ns.gang.getMemberInformation().task != "Human Trafficking") { ns.gang.setMemberTask(member, "Human Trafficking") }
                continue;
            }
            //if member's lowest stat is at least 100 they are temporarily done training, set to mug people to gain rep to recruit
            if (lowest_stat >= 100) { 
                if (ns.gang.getMemberInformation().task != "Mug People") { ns.gang.setMemberTask(member, "Mug People") }                
            }
        }
    }
}

/** @param {import("../.vscode").NS} ns */
function CheckBonusTime(ns) {
    //setting bonus time bools for if statement in main
    bonusTimeStart = ns.gang.getBonusTime() > 1800;
    bonusTimeEnd = ns.gang.getBonusTime() <= 1800 && ns.gang.getBonusTime() > 10;
}