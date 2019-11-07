const post = async (endpoint, data) => {
  const res = await fetch(`http://localhost:3000${endpoint}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

const requestChallenge = async address => {
  const { challenge } = await post('/auth/challenge', { address })
  return challenge
  // const hash = window.web3.sha3(data.challenge)
  // console.log(hash)
}

const signMessage = async (message, address) => {
  return new Promise((resolve, reject) => {
    window.web3.personal.sign(message, address, (err, sig) => {
      if (err) return reject(err)
      resolve(sig)
    })
  })
}

const getToken = async (challenge, signature) => {
  const { token } = await post('/auth/token', { challenge, signature })
  return token
}

const getProtectedResource = async token => {
  const res = await fetch('http://localhost:3000/protected', {
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
  return res.text()
}

async function start() {
  if (typeof window.ethereum == 'undefined') {
    return alert('No MetaMask detected')
  }
  const [address] = await window.ethereum.enable()
  console.log(address)
  const challenge = await requestChallenge(address)
  console.log(challenge)
  const signature = await signMessage(challenge, address)
  console.log(signature)
  const token = await getToken(challenge, signature)
  console.log(token)
  const resourceText = await getProtectedResource(token)
  document.querySelector('body').appendChild(document.createTextNode(`Logged in as ${resourceText}`))
}

console.log('Starting')

start()
