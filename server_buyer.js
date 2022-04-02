/** @param {import("../.vscode").NS} ns */
export async function main(ns) {

    //setting the first part of the name here will let us use "string concatenation" to specify exactly which server later
    const name = "pserv-";

    //creates an array of the servers' names we already own
    const servers = ns.getPurchasedServers();

    //this variable will be set by the first for loop and used in the second for loop
    let maxAffordableRam;

    //this for loop starts at the highest amount of RAM and works backwards until it finds an ammount of RAM you can afford
    for (var i = 21; i > 0; i--){
        //each set of RAM is 2x greater than the previous amount
        //meaning we can use 2 ^ i to calculate each valid amount of RAM
        const ramAmount = Math.pow(2, i);
        //the cost of a server with the current amount of RAM
        const cost = ns.getPurchasedServerCost(ramAmount);

        //if we cannot afford the current amount of RAM we "continue" to the next iteration
        //using cost * 25 will make sure we are able to buy 25 of the servers
        if ( ns.getServerMoneyAvailable("home") < cost * 25 ) { continue; }
        //set the maxAffordableRam once we find a value we can afford
        maxAffordableRam = ramAmount;
        //break out of the loop (we already found the amount we want!)
        break;
    }

    //this for loop will upgrade the servers that do not have as much RAM as we want - NOTE: "upgrade" means to delete and replace
    for (var i = 0; i < ns.getPurchasedServerLimit(); i++) {
        //if the current server does not exist we buy a new server and continue
        if (!servers[i]) {
            ns.purchaseServer(name + i, maxAffordableRam);
            continue;
        }

        //if the current server has less RAM than we want we stop all running processes on it and delete it
        if (ns.getServerMaxRam(servers[i]) < maxAffordableRam) { 
            ns.killall(servers[i]);
            ns.deleteServer(servers[i]); 
            continue;
        }
        //else if it has more RAM than we want we skip it
        else if (ns.getServerMaxRam(servers[i]) >= maxAffordableRam) {
            continue;
        }
        //finally, if neither of the above if statements are true we buy a new server
        ns.purchaseServer(name + i, maxAffordableRam);
    }
}