import Arweave from "arweave";
import Warp from "warp-contracts";

const client = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

async function readArweaveBalance(wallet) {
  // Balance returns in Arweave's smallest divisible unit, winstons
  const balanceWinstons = await client.wallets.getBalance(wallet);
  
  // Translating winstons to AR
  return client.ar.winstonToAr(balanceWinstons);
}

async function readSmartWeaveTokenBalance(wallet, contractID) {
  // Configuring Warp
  const warp = Warp.WarpNodeFactory.memCachedBased(client).useWarpGateway().build();
  const contract = warp.contract(contractID);
  
  // Reading the contract's state & parsing result
  const evalResult = await contract.readState();
  const balances = evalResult.state.balances;

  // Getting the balance of the specific wallet
  return balances[wallet];
}

async function runExamples() {
  // Configure these
  const arweaveWallet = "A8hWTbGRM7IqqXCSAeFgHWunWsTjcOzr1-PZ6xsn17s";
  const smartWeaveTokenContractID = "E2VzD2VKUE11MToqeaFx2J3dvFAcA44_rQssFPgsJIo";

  // If you want to read the AR balance of a wallet, use this
  const balanceAR = await readArweaveBalance(arweaveWallet);
  console.log(`\n\nUser's AR balance is: ${balanceAR}\n\n`);

  // If you want to read a user's balance of a SmartWeave token, use this
  const balanceBAR = await readSmartWeaveTokenBalance(arweaveWallet, smartWeaveTokenContractID);
  console.log(`\n\nUser's VRT balance is: ${balanceBAR}\n\n`);
}

runExamples();