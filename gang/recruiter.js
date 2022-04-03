const names = ["cyclops", "minotaur", "medusa", "gojira", "dragon", "gryphon", "raiju", "kraken", "phoenix", "charybdis", "basilisk", "sphinx"];

/** @param {import("../.vscode").NS} ns */
export function Recruiter(ns) {
    if (ns.gang.canRecruitMember()) { ns.gang.recruitMember(names[ns.gang.getMemberNames().length]); }
}