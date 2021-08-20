const Web3 = require('web3')
const _governor = require('../assets/governor.json')
// FILL THESE IN FOR THE NETWORK
const web3URI = 'https://mainnet.infura.io/v3/668b3268d5b241b5bab5c6cb886e4c61'
const governorAddress = '0xe5bcEa6F87aAEe4a81f64dfDB4d30d400e0e5cf4'
// Can add this for speed
const fromBlock = 11068577

const getMetaEvidence = async () => {
  const web3 = new Web3(web3URI)

  const governorInstance = new web3.eth.Contract(
    _governor.abi,
    governorAddress
  )

  const _disputeID = scriptParameters.disputeID
  let sessionNumber = await governorInstance.methods.getCurrentSessionNumber().call()
  let session
  while (sessionNumber >= 0) {
    session = await governorInstance.methods.sessions(sessionNumber).call()
    if (Number(session.disputeID) === Number(_disputeID)) break
    sessionNumber--
  }

  if (sessionNumber < 0) throw new Error("Unable to find disputed session")
  const listIDs = await governorInstance.methods.getSubmittedLists(sessionNumber).call()
  let titles = await Promise.all(listIDs.map(listID => 'List ' + listID))
  resolveScript({
    rulingOptions: {
      type: 'single-select',
      titles
    }
  })
}

module.exports = getMetaEvidence
