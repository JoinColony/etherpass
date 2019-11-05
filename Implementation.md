1) Generate a random key for encrypting challenges when server starts (that means all challenges are reset when server restarts. I guess that's ok.)
2) `/auth/challenge` Generate challenge from user address: 
    - Concat address + timestamp + sig(address + timestamp, key)
    - Send challenge
3) User signs challenge with wallet private key
4) `/auth/token` User sends challenge + signed challenge (`web3.eth.accounts.sign`)
    - Verify challenge
      - check whether challenge signature is correct (concat again, use equality check)
      - Check whether challenge expiry date is met
      - Check whether wallet signature is correct (`web3.eth.accounts.recover`)
      - Check whether challenge address matches the recovered address
    - Issue JWT token
      - Use RS256
      - Payload
      - TTL, etc
