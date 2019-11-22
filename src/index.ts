import { createHmac, randomBytes } from 'crypto'
import { utils } from 'ethers'

// Create a new challengeKey on restart
const challengeKey = randomBytes(32).toString('base64')

export const getChallenge = (address: string) => {
  try {
    // Just for validation
    utils.getAddress(address)
  } catch (err) {
    throw new Error(`Invalid address: ${address}`)
  }
  const time = Date.now().toString(16)
  const hexAddress = address.toLowerCase().substr(2)
  const content = `${hexAddress}-${time}`
  const sig = createHmac('sha256', challengeKey)
    .update(content)
    .digest('hex')
  return `${content}-${sig}`
}

export const verifyEthSignature = (challenge: string, signature: string) => {
  let recoveredAddress
  try {
    recoveredAddress = utils.verifyMessage(challenge, signature)
  } catch (err) {
    throw new Error(`Could not verify wallet signature: ${err.message}`)
  }
  const [challengeAddress, challengeTime, challengeSig] = challenge.split('-')
  const verifiedChallengeSig = createHmac('sha256', challengeKey)
    .update(`${challengeAddress}-${challengeTime}`)
    .digest('hex')
  if (verifiedChallengeSig !== challengeSig) {
    throw new Error(
      'Could not verify challenge signature. Please request a new challenge',
    )
  }
  if (utils.getAddress(challengeAddress) !== recoveredAddress) {
    throw new Error('Wallet address does not match challenge address')
  }
  if (parseInt(challengeTime, 16) < Date.now() - 10 * 60 * 1000) {
    throw new Error('Challenge expired. Please request a new challenge')
  }
  return recoveredAddress
}
