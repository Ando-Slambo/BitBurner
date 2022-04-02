const names = ["cyclops", "minotaur", "medusa", "gojira", "dragon", "gryphon", "raiju", "kraken", "phoenix", "charybdis", "basilisk", "sphinx"];

/** @param {import("../.vscode").NS} ns */
export function Recruiter(ns) {
    const memberCount = ns.gang.getMemberNames().length;
    if (ns.gang.canRecruitMember()) {
        ns.gang.recruitMember(names[memberCount]);
    }
}