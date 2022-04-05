const hacking = "Train Hacking";
const combat = "Train Combat";
const charisma = "Train Charisma";
const names = ["cyclops", "minotaur", "gorgon", "hydra", "dragon", "gryphon", "raiju", "kraken", "phoenix", "charybdis", "basilisk", "sphinx"];

/** @param {import("../.vscode").NS} ns */
export async function Trainer(ns, member) {
    const str_lvl = ns.gang.getMemberInformation(member).str;
    const def_lvl = ns.gang.getMemberInformation(member).def;
    const dex_lvl = ns.gang.getMemberInformation(member).dex;
    const agi_lvl = ns.gang.getMemberInformation(member).agi;

    const hck_lvl = ns.gang.getMemberInformation(member).hack;
    const avg_combat = Math.floor((str_lvl + def_lvl + dex_lvl + agi_lvl) / 4);
    //increase cha lvl by 10% to give preference to hack and combat stats
    const cha_lvl = ns.gang.getMemberInformation(member).cha * 1.1;

    const lowest_stat = Math.min(hck_lvl, avg_combat, cha_lvl);

    if (lowest_stat == hck_lvl) {
        if (ns.gang.getMemberInformation(member).task != hacking) { ns.gang.setMemberTask(member, hacking) }
        return;
    }
    if (lowest_stat == avg_combat) {
        if (ns.gang.getMemberInformation(member).task != combat) { ns.gang.setMemberTask(member, combat) }
        return;
    }
    if (lowest_stat == cha_lvl) {
        if (ns.gang.getMemberInformation(member).task != charisma) { ns.gang.setMemberTask(member, charisma) }
        return;
    }
}

/** @param {import("../.vscode").NS} ns */
export function Recruiter(ns) { while (ns.gang.canRecruitMember()) { ns.gang.recruitMember(names[ns.gang.getMemberNames().length]) } }

/** @param {import("../.vscode").NS} ns */
export async function GetLowestStat(ns, member) {
    const str_lvl = ns.gang.getMemberInformation(member).str;
    const def_lvl = ns.gang.getMemberInformation(member).def;
    const dex_lvl = ns.gang.getMemberInformation(member).dex;
    const agi_lvl = ns.gang.getMemberInformation(member).agi;

    const hck_lvl = ns.gang.getMemberInformation(member).hack;
    const avg_combat = Math.floor((str_lvl + def_lvl + dex_lvl + agi_lvl) / 4);
    const cha_lvl = ns.gang.getMemberInformation(member).cha;

    return Math.min(hck_lvl, avg_combat, cha_lvl);
}

/** @param {import("../.vscode").NS} ns */
export async function CheckAscension(ns, member) {
    if (!ns.gang.getAscensionResult(member) || await GetLowestStat(ns, member) >= 6000) { return }
    if (NeedsHack(ns, member) || NeedsCombat(ns, member) || NeedsCharisma(ns, member)) { return }
    ns.gang.ascendMember(member);
}

/** @param {import("../.vscode").NS} ns */
function NeedsHack(ns, member) {
    const hack_asc_mult = ns.gang.getMemberInformation(member).hack_asc_mult;
    const hack_asc_diff = ns.gang.getAscensionResult(member).hack;
    const hack_after_asc = hack_asc_mult * hack_asc_diff;

    return hack_after_asc < 2 + hack_asc_mult;
}

/** @param {import("../.vscode").NS} ns */
function NeedsCombat(ns, member) {
    const str_asc_mult = ns.gang.getMemberInformation(member).str_asc_mult;
    const str_asc_diff = ns.gang.getAscensionResult(member).str;
    const str_after_asc = str_asc_mult * str_asc_diff;
    const needsStr = str_after_asc < 2 + str_asc_mult
    
    const def_asc_mult = ns.gang.getMemberInformation(member).def_asc_mult;
    const def_asc_diff = ns.gang.getAscensionResult(member).def;
    const def_after_asc = def_asc_mult * def_asc_diff;
    const needsDef = def_after_asc < 2 + def_asc_mult
    
    const dex_asc_mult = ns.gang.getMemberInformation(member).dex_asc_mult;
    const dex_asc_diff = ns.gang.getAscensionResult(member).dex;
    const dex_after_asc = dex_asc_mult * dex_asc_diff;
    const needsDex = dex_after_asc < 2 + dex_asc_mult

    const agi_asc_mult = ns.gang.getMemberInformation(member).agi_asc_mult;
    const agi_asc_diff = ns.gang.getAscensionResult(member).agi;
    const agi_after_asc = agi_asc_mult * agi_asc_diff;
    const needsAgi = agi_after_asc < 2 + agi_asc_mult

    return needsStr || needsDef || needsDex || needsAgi;
}

/** @param {import("../.vscode").NS} ns */
function NeedsCharisma(ns, member) {
    const cha_asc_mult = ns.gang.getMemberInformation(member).cha_asc_mult;
    const cha_asc_diff = ns.gang.getAscensionResult(member).cha;
    const cha_after_asc = cha_asc_mult * cha_asc_diff;
    
    return cha_after_asc < 1.5 + cha_asc_mult;
}