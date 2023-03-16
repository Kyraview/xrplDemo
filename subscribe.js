const network_clients = {
  mainnet: new xrpl.Client("wss://xrplcluster.com/"),
  testnet: new xrpl.Client("wss://s.altnet.rippletest.net")
}
let client;
async function subscribe() {
  const addr = await ethereum.request({
    method: 'wallet_invokeSnap',
    params: {snapId:snapId, 
      request:{
        method: 'getAddress'
      }
    }
  })
  txnOutline = `
  {
        "TransactionType": "TrustSet",
        "Account": "${addr}",
        "Flags": 131072,
        "LimitAmount": {
          "currency": "534F4C4F00000000000000000000000000000000",
          "issuer": "rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz",
          "value": "399319952"
        }
      }`
  document.getElementById("rawTxnInput").innerHTML = txnOutline
  console.log("got address");
  console.log("addr");
  document.getElementById("addressDisplay").innerHTML = addr
  const testnetChecked = document.getElementById('testnet').checked;
  console.log("testnet is : ")
  console.log(testnetChecked)
  const network = testnetChecked ? "testnet" : "mainnet";
  window.client = network_clients[network];
  console.log(network)
  console.log(client);
  console.log("got client")
  console.log(xrpl)
  await window.client.connect()
  console.log("client connnected")
  console.log(addr)
  const response = await window.client.request({
    "command": "subscribe",
    "accounts": [addr]
  })
  console.log(response);
  
  window.client.on("transaction", async (ledger) => {
    console.log("caught transaction")
    console.log(ledger);
    let item = document.createElement("div");
    item.style.border = '1px soild black';
    item.innerHTML = `
    engineResult: ${ledger.engine_result}<br/>
    validated: ${ledger.validated}<br/>
    amount: ${ledger.transaction.Amount}<br/>
    fee: ${ledger.transaction.Fee}<br/>
    hash: ${ledger.transaction.hash}<br/>
    `
    let container = document.getElementById("txnContainer")
    container.appendChild(item)
  })
}
