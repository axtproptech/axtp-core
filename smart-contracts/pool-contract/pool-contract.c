#define VERSION 1.0
#define SIMULATOR
// #define TESTNET
// #define MAINNET

#program name RestPoolContract
#program activationAmount .25
#pragma optimizationLevel 3

#ifdef SIMULATOR
    #define APPROVER_1 1
    #define APPROVER_2 2
    #define APPROVER_3 3
    #define APPROVER_4 4
    #define RESTC_TOKEN_ID 100
#endif
#ifdef TESTNET
// TO DO
    #define APPROVER_1 3549690777743760998
    #define APPROVER_2 7473730462792140210
    #define APPROVER_3 5757380649245251466
    #define APPROVER_4 10746331379201355428
    #define RESTC_TOKEN_ID 9224329060507884640
#endif
#ifdef MAINNET
// TO DO
    #define APPROVER_1 1
    #define APPROVER_2 2
    #define APPROVER_3 3
    #define APPROVER_4 4
    #define RESTC_TOKEN_ID 100
#endif

// Set public functions magic numbers
#define SEND_RPST_TO_HOLDER 0xe16029b76b056b6b
#define APPROVE_DISTRIBUTION 0x3b15c00ea0519a0a

// global variables, will be available in all functions
// external/loadable variables
long poolName;
long poolRate; // two digits
long poolTokenQuantity;


#ifdef SIMULATOR
    const poolName = "RPST0001";
    const poolRate = 5000_00; // two digits
    const poolTokenQuantity = 100;
#endif


// internal values, i.e. set during execution
long nominalValueSTC;
long poolTokenId;
long pendingPayoutSTC;
long paidSTC;

struct APPROVAL {
  long account, approved;
} approvals[4];


const long MinimumApproval = 3;

struct TXINFO {
    long txId,
        timestamp,
        sender,
        quantitySTC,
        quantityPST,
        message[4];
} currentTX;

long messageBuffer[4];

constructor();

void main(void) {
    while ((currentTX.txId = getNextTx()) != 0) {
        currentTX.sender = getSender(currentTX.txId);
        currentTX.quantitySTC = getQuantity(currentTX.txId, RESTC_TOKEN_ID);
        currentTX.quantityPST = getQuantity(currentTX.txId, poolTokenId);
        readMessage(currentTX.txId, 0, currentTX.message);

        switch (currentTX.message[0]) {
            case SEND_RPST_TO_HOLDER:
                SendRPSTToHolder(currentTX.message[1], currentTX.message[2]);
                break;
            case APPROVE_DISTRIBUTION:
                 ApproveDistribution();
                break;
            default:
                txReceived();
        }
    }
}


// ---------------- PRIVATE ---------------------------

void constructor() {
    poolTokenId = issueAsset(poolName, "", 0);
    nominalValueSTC = poolTokenQuantity * poolRate;
    approvals[0].account = APPROVER_1;
    approvals[1].account = APPROVER_2;
    approvals[2].account = APPROVER_3;
    approvals[3].account = APPROVER_4;
}

void resetApproved() {
    approvals[0].approved = 0;
    approvals[1].approved = 0;
    approvals[2].approved = 0;
    approvals[3].approved = 0;
}

void setApproved() {
    if( approvals[0].account == currentTX.sender ) {
        approvals[0].approved = 1;
        return;
    }

    if( approvals[1].account == currentTX.sender ) {
        approvals[1].approved = 1;
        return;
    }

    if( approvals[2].account == currentTX.sender ) {
        approvals[2].approved = 1;
        return;
    }

    if( approvals[3].account == currentTX.sender ) {
        approvals[3].approved = 1;
        return;
    }
}


long isApproved() {
   if ((approvals[0].approved + approvals[1].approved + approvals[2].approved + approvals[3].approved) >= MinimumApproval){
       return 1;
   }
   return 0;
}

long isAuthorized() {
    if(  (approvals[0].account == currentTX.sender) ||
         (approvals[1].account == currentTX.sender) ||
         (approvals[2].account == currentTX.sender) ||
         (approvals[3].account == currentTX.sender) ) {
        return 1;
    }
    return 0;
}

// ---------------- PUBLIC ---------------------------

void ApproveDistribution() {
    setApproved();
    if(isApproved()){
        distributeToHolders(1, poolTokenId,0, pendingPayoutSTC, RESTC_TOKEN_ID);
        paidSTC += pendingPayoutSTC;
        resetApproved();
        pendingPayoutSTC=0;
    }
}

void SendRPSTToHolder(long holderId, long quantityRPST) {
    if(!isAuthorized()){
        return;
    }

    if(getAssetBalance(poolTokenId) + quantityRPST > poolTokenQuantity){
        messageBuffer[]="Not enough Pool Tokens left";
        sendMessage(messageBuffer, currentTX.sender);
        return;
    }
    mintAsset(quantityRPST, poolTokenId);
    sendQuantity(quantityRPST, poolTokenId, holderId);
}


void txReceived(void) {
    if(currentTX.quantitySTC > 0){
        pendingPayoutSTC += currentTX.quantitySTC;
    }
}


