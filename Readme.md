# etherpass

Authenticate against a node.js server. Use just your ethereum wallet to create cookies or tokens. For an example using [JWT](https://jwt.io/), see the [examples](https://github.com/JoinColony/etherpass/tree/master/examples) directory.

## Installation

Pretty sure you know what to do at this point. (hint: `npm install etherpass`)

## Usage

We're exporting two functions: 

**`getChallenge(address: string): string`**

Generates a challenge string that the client needs to sign using an ethereum wallet (`personalSign`). Then send this back to the server using another endpoint. This challenge is valid for 10 minutes.

**`verifyEthSignature(challenge: string, signature: string): string`**

Returns the address of the account which signed the message. Throws if something goes wrong. Use this address to generate a token or a cookie or whatever floats your boat.

See also [Implementation.md](https://github.com/JoinColony/etherpass/blob/master/Implementation.md) for a quick sketch of what's happening.

## Contributing

We welcome any contribution to this project. Feel free to open issues, PRs or ask questions! But please, adhere to our [Code of Conduct](https://github.com/JoinColony/etherpass/blob/master/CODE_OF_CONDUCT.md)!

## License

MIT
