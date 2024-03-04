# Burn Contract

This smart contract keeps tokens as they were burned. Additionally, it keeps a list of burned registries which may serve
as a "withdrawal" request.

## Contract API

|                    |                      |
|--------------------|----------------------|
| Code Hash          | 4258024526314495767  |
| Testnet Account Id | 18251839167673491571 |
| Mainnet Account Id |                      |

### Data Stack

| Name | Stack Index (0-based) | Initializable | Values | Description |
|------|-----------------------|---------------|--------|-------------|

### Methods:

| Method                     | Arg0 | Arg1       | Arg2     | Arg2       | Role/Permission | Description                                                                                                                                                 |
|----------------------------|------|------------|----------|------------|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Add Trackable Token        | 1    | Token Id   |          |            | Creator         | Allows to set which Tokens are trackable (SIGNA is not trackable). Trackable Tokens are kept in a map                                                       |
| Remove Trackable Token     | 2    | Token Id   |          |            | Creator         | Removes a trackable token from map.                                                                                                                         |
| Credit Tracked Token       | 3    | Token Id   | Quantity | Account Id | Creditor        | If given `Token Id` is trackable, then this command credits token (in form of offchain payouts), giving AXT control of how much on payout is still pending. |
| Return Tracked Token       | 4    | Token Id   | Quantity | Account Id | Creditor        | If given `Token Id` is trackable, then this command returns `Quantity` credits to Account Id                                                                |
| Add Creditor Permission    | 5    | Account Id |          |            | Creator         | Grants permission to an account to "Credit Tracked Token", "Can                                                                                             |
| Remove Creditor Permission | 6    | Account Id |          |            | Creator         | Revokes permission for an account to "Credit Tracked Token"                                                                                                 |
| Burn Token                 |      |            |          |            | Anybody         | Everyone who sends a token to this contract, will automatically burn it, as this contract has no way to get received tokens and signa back                  |

### Maps

| Description                          | Key 1    | Key 2      | Value    |
|--------------------------------------|----------|------------|----------|
| Trackable Tokens                     | 1        | Token Id   | [0,1]    |
| Creditor Permissions                 | 2        | Account Id | [0,1]    |
| Individual Credits (Pending Payouts) | Token Id | Account Id | Quantity |

## Tests

Just run `yarn test` to run the tests.