# R.Est Pool Contract

This contract represents a Pool for the R.Est project.


## Case

Participants can be registered in this pool and will get dividends according to their share in form of a stable coin (STC).
Each Pool is related to its own pool token, i.e. _Pool A_ references to Pool Token _PTA_, while _Pool B_ references to Pool Token _PTB_
The registry of a participant is done by a pool administrator. Dividend payout is only possible if all authorized account have approved the payout.
Each payout is being stored inside the contract, 
such that it is possible to measure the pools performance.


## Functionalities

### Required Data 

- TokenId of Stable Coin
- TokenId of Pool Token
- Nominal Value of Pool in STC
- Total Payouts Sum
- Authorized Accounts (as map)


# Functions

- Initialize the contract with necessary data


- Register Participant in a 2-key-value map  - (1, account, quantity)
	- Add/Remove quantity


- Approval of Dividend Payout by Authorized Persons (2, account, approved)