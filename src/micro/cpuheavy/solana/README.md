# Prepare
At first, use `npm solana start` or [init_solana_env.sh](../../solana_script) to start solana client and deploy contracts. Then, open another terminal 
to run the following command:

# Run
* use `node deploy.js array_size` to create a data account with `array_size * 8` capacity, and also issue a sort request. It will report the latency into `stdout`. 
 `array_size` is the size of the array to sort.