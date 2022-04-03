/* OPERATION OF SOURBATCHKIDS */

/* Prerequisites */
1:  This script will purchase a server to run all scripts that target a specified server.
    If you already have 25 purchased servers, delete one (proper use of this batcher will quickly recoup losses)
    You will need space to purchase a new server for every target specified, only one target may be
    specified per script execution.

2:  All file and folder names must not be changed or, if changed, the code must be edited
    to reflect the changes. All filenames in code are found at the top of a file.

3:  This batcher does not yet automatically choose a target server, just pick one 
    around half your hacking level with a large max money pool.



/* [1] Execution of main.js */
main.js takes the name of the target server as the first argument and the amount of RAM you want to use
for the batcher as the second. RAM will default to 16TB if no amount if specified.
ex:
run /sourbatchkids/main.js megacorp 32768

The script will crash if you pass an invalid amount for RAM. If you are unsure what the valid amounts are,
run my script https://github.com/Andoxico/BitBurner/blob/main/servers/cost.js 

You will be prompted to approve the purchase of a server named bserv-<target_name>. Clicking Yes will
purchase a server unless you have one with the same name and with as much RAM as the amount you specified.
If either of those conditions are false the pre-existing server will be deleted and replaced with a new one.
If the price is too expensive clicking No will prevent purchasing a server.

After main.js has successfully executed your purchased server will be running the setup script to prepare
your target for batching. When it finishes it will print to the terminal to let you know.
Next is to run estimate.js


/* [2] Execution of estimate.js */
All you must do is run estimate.js and pass the target name
ex:
run /sourbatchkids/estimate.js megacorp

This will print a block of text detailing three columns of information.
The first column is the percentage of money each batch will hack out of the target server.
The second column is the estimated amount of money per second the batcher will make.
The third column is how many batches will be running on the server. The script is programmed to only show
results that will run less than 100 batches but this can be changed. Note, running too many batches can
result in batch collision or lag resulting in the former. If you edit the code you must debug it yourself.


/* [3] Execution of restart_batches.js */
After selecting which percent you want to hack open restart_batches.js in the script editor. All you need
to do is add your target server and the percentage into the targets object. See the commented code in the
file for an example.
Every time you close and re-open the game the batching scripts are messed with and you need to
run /sourbatchkids/restart_batches.js


/* [4] Starting the batcher */
Simply run start_batches.js
If you did not properly complete step 3 the script will not execute.