import {
    Root
} from "/deploy/utils.js";

const virus = "/deploy/hacknserv.js";
const weaken = "/deploy/weaken.js";
const share = "/deploy/share.js";

/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    const modifier = ns.args[0];
    const hackTarget = ns.args[1];
    
    const virusRam = ns.getScriptRam(virus);
    const weakenRam = ns.getScriptRam(weaken);
    const shareRam = ns.getScriptRam(share);

    if (!Root(ns, hackTarget)) {
        ns.tprintf("Unable to root target, pick another server.");
        return;
    }

    const ramAvail = ns.getServerMaxRam("home") - ns.getServerUsedRam("home");
    
    if (modifier == "weaken") {
        const threads = Math.floor(ramAvail / weakenRam);
        ns.run(weaken, threads, hackTarget);
    }
    else if (modifier == "virus") {
        const threads = Math.floor(ramAvail / virusRam);
        ns.run(virus, threads, hackTarget);}
    else if (modifier == "share") {
        const threads = Math.floor(ramAvail / shareRam);
        ns.run(share, threads, hackTarget);
    }
}