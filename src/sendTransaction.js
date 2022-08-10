import Arweave from "arweave";

const client = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

async function sendAR(jwk, amountToSend, target) {
  // Create the transaction
  const tx = await client.createTransaction({
    target,
    quantity: client.ar.arToWinston(amountToSend.toString())
  }, jwk);

  // Sign and post
  await client.transactions.sign(tx, jwk);
  await client.transactions.post(tx);

  // Return its ID
  return tx.id;
}

async function sendSmartWeaveToken(jwk, amountToSend, target, contractID) {
  // Create the SmartWeave input object
  const input = {
    function: "transfer",
    target,
    qty: amountToSend
  };

  // Create the transaction
  const tx = await client.createTransaction({
    data: 1234
  }, jwk);

  // Add necessary tags to conform to the SmartWeave protocol
  tx.addTag("App-Name", "SmartWeaveAction");
  tx.addTag("App-Version", "0.3.0");
  tx.addTag("Input", JSON.stringify(input));
  tx.addTag("Contract", contractID);

  // Sign and post
  await client.transactions.sign(tx, jwk);
  await client.transactions.post(tx);

  // Return its ID
  return tx.id;
}

async function runExamples() {
  // Configure these
  const jwk = {};
  const amountToSend = 1;
  const target = "A8hWTbGRM7IqqXCSAeFgHWunWsTjcOzr1-PZ6xsn17s";
  const smartWeaveTokenContractID = "E2VzD2VKUE11MToqeaFx2J3dvFAcA44_rQssFPgsJIo";

  // If you want to send AR, use this
  try {
    const arTx = await sendAR(jwk, amountToSend, target);
    console.log(`Just sent ${amountToSend} AR: ${arTx}`);
  } catch (err) {
    throw new Error(err);
  }

  // If you want to send a SmartWeave token, use this
  try {
    const swTx = await sendSmartWeaveToken(jwk, amountToSend, target, smartWeaveTokenContractID);
    console.log(`Just sent ${amountToSend} token(s): ${swTx}`);
  } catch (err) {
    throw new Error(err);
  }
}

runExamples();