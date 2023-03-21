//buttons
const ConnectButton = document.getElementById('connectButton')
ConnectButton.addEventListener('click', connect);

const SendButton = document.getElementById('sendButton');
SendButton.addEventListener('click', send);

const GetBalanceButton = document.getElementById('getBalanceButton');
GetBalanceButton.addEventListener('click', getBalance);

const SignTxnButton = document.getElementById('signTxnButton');
SignTxnButton.addEventListener('click', signRaw)

const snapId = "npm:snapxrpl"
const testnetButton = document.getElementById('testnet')





async function connect() {
  startLoading();
  try {
    const result = await ethereum.request({
      method: 'wallet_requestSnaps',
      params: {
        'npm:snapxrpl': {version: '0.1.1',},
      },
    });
    await subscribe();
  }
  finally {
    //const snapalgo = new SnapAlgo.Wallet();
    stopLoading();
  }

}

async function getBalance() {
  startLoading()
  try {
    const response = await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId:snapId, 
        request:{
        method: "getBalance",
        params: {
          network: testnetButton.checked ? "testnet" : "mainnet"
        }
      }}
    })
    alert(response);
  } catch (err) {
    console.error(err)
    alert('Problem happened: ' + err.message || err)
    stopLoading()
  }
  stopLoading()
}

async function send() {
  const sendAddress = document.getElementById('sendAddress')
  const sendAmount = document.getElementById('sendAmount')
  console.log(testnetButton.checked ? "testnet" : "mainnet")
  startLoading();
  let response;
  try {
    response = await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId:snapId, 
        request:{
          method: 'transfer',
          params: {
            network: testnetButton.checked ? "testnet" : "mainnet",
            to: sendAddress.value,
            amount: sendAmount.value,
          }
        }
      }
    })
  }
  finally {
    stopLoading()
  }
  console.log(response)
  alert(response)
}

async function signRaw() {
  startLoading();
  const rawTxn = JSON.parse(document.getElementById("rawTxnInput").value)
  console.log(rawTxn);
  let response;
  try {
    response = await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId:snapId, 
        request:{
          method: 'signTxn',
          params: {
            txn: rawTxn,
            network: testnetButton.checked ? "testnet" : "mainnet"
          }
      }
      }
    })
  }
  catch (e) {
    stopLoading();
    alert("Failed malformed Transaction")
    return null;
  }
  stopLoading();
  console.log(response)
  const signOutputHash = document.getElementById('signatureOutputHash');
  signOutputHash.innerHTML = "hash : " + response.hash.slice(0, 20) + "...";
  const signOutputBlob = document.getElementById('signatureOutputBlob');
  signOutputBlob.innerHTML = "blob : " + response.tx_blob.slice(0, 20) + "...";

}

function startLoading() {
  console.log("loading start")
  let loader = document.getElementById('loader');
  let content = document.getElementById('appScreen');
  content.style.display = "none";
  loader.style.display = "block";
}

function stopLoading() {
  let loader = document.getElementById('loader');
  let content = document.getElementById('appScreen');
  content.style.display = "block";
  loader.style.display = "none";
}