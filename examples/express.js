/* Creating a JSON Web Token using the user's wallet signature
 *
 * To test:
 * 1) Start the server
 * ```
 * ts-node express.ts
 * ```
 *
 * 2) Get the wallet:
 * ```
 * import { Wallet } from 'ethers';
 * const wallet = Wallet.createRandom();
 * console.log(wallet.address); // Note the address
 * ```
 *
 * 3) Request a challenge:
 * ```
 * curl -H "Content-Type: application/json" -d '{ "address": "0xf5f53b672a472c1ef9214a1f3275207a9faa573e" }' http://127.0.0.1:3000/auth/challenge
 * ```
 *
 * 4) Sign the challenge:
 * ```
 * const signature = await wallet.signMessage(challenge);
 * console.log(signature);
 * ```
 *
 * 5) Request a token (example singature and challenge, will not work for you):
 * curl -H "Content-Type: application/json" -d '{ "signature": "0x264c5acb2a1603f17dede4547c8ae84b54bd08b73cf2124e1be9ecfb404a08e56dfcd1ce4b83d030b1dde9255d181f85dfabdbb30c213da3b1665260dccebf3a1c", "challenge": "f5f53b672a472c1ef9214a1f3275207a9faa573e-16e3cf2ae51-396a2360bd3eaff2f4a8f0e978e71a33ba7bfcf0634ec9cfa0bf4a3789266727" }' http://127.0.0.1:3000/auth/token
 */

const express = require('express')
const { JWT, JWK } = require('jose')
const { json } = require('body-parser')
const { readFileSync } = require('fs')
const cors = require('cors')

const { getChallenge, verifyEthSignature } = require('../lib/index');

const jwtKey = JWK.asKey('seeeecret')

const app = express()
const port = 3000

app.use(cors())
app.use(json())

app.post('/auth/challenge', (req, res) => {
  const challenge = getChallenge(req.body.address)
  return res.json({ challenge })
})

app.post('/auth/token', (req, res) => {
  const address = verifyEthSignature(req.body.challenge, req.body.signature)
  const token = JWT.sign({ address }, jwtKey, {
    algorithm: 'HS256',
    audience: 'https://api.your.domain',
    expiresIn: '2 hours',
    header: {
      typ: 'JWT',
    },
    issuer: 'https://your.domain',
  })
  return res.json({ token, address })
})

app.get('/protected', (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'] // Express headers are auto converted to lowercase
  if (typeof token != 'string') return next(new Error('No token given'))
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length)
  }
  const { address } = JWT.decode(token) as { address: string };
  return res.send(address)
})

app.listen(port, () => console.log(`Started on port ${port}`))
