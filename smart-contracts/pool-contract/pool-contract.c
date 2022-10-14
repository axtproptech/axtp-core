/**
This contract must be pre-configured, before being deployed:

1. Approver Account IDs
2. AXTC_TOKEN_ID - i.e. the token must be issued before this contract can be deployed

*/
#define VERSION 1.0
// #define SIMULATOR
#define TESTNET
// #define MAINNET

#program name AXTPoolContract
#program activationAmount .25
#pragma optimizationLevel 3
#pragma maxAuxVars 4

#ifdef SIMULATOR
    #define APPROVER_1 1
    #define APPROVER_2 2
    #define APPROVER_3 3
    #define APPROVER_4 4
    #define AXTC_TOKEN_ID 100
#endif
#ifdef TESTNET
    #define APPROVER_1 3549690777743760998
    #define APPROVER_2 7473730462792140210
    #define APPROVER_3 5757380649245251466
    #define APPROVER_4 10746331379201355428
    #define AXTC_TOKEN_ID 3561373642152666581
#endif
#ifdef MAINNET
// TO DO
    #define APPROVER_1 1
    #define APPROVER_2 2
    #define APPROVER_3 3
    #define APPROVER_4 4
    #define AXTC_TOKEN_ID 100
#endif

// Set public functions magic numbers
#define SEND_AXTP_TO_HOLDER 0xe16029b76b056b6b
#define APPROVE_DISTRIBUTION 0x3b15c00ea0519a0a
#define UPDATE_GMV 0x0d98f95a1a931bc9
#define DEACTIVATE 0x6a20a7b2b4abec85

// global variables, will be available in all functions
// external/loadable variables
long poolName;
long poolRate; // two digits
long poolTokenQuantity;


#ifdef SIMULATOR
    const poolName = "AXTP0001";
    const poolRate = 5000_00; // two digits
    const poolTokenQuantity = 100;
#endif


// internal values, i.e. set during execution
long nominalValueAXTC;
long poolTokenId;
long pendingPayoutAXTC;
long paidAXTC;
long grossMarketValueAXTC;

struct APPROVAL {
  long account, distributionApproved;
} approvals[4];

long isDeactivated = false;
const long MinimumApproval = 3;

struct TXINFO {
    long txId,
        timestamp,
        sender,
        quantityAXTC,
        quantityAXTP,
        message[4];
} currentTX;

long messageBuffer[4];

constructor();

void main(void) {
    while ((currentTX.txId = getNextTx()) != 0) {
        if(isDeactivated){
            continue;
        }

        currentTX.sender = getSender(currentTX.txId);
        currentTX.quantityAXTC = getQuantity(currentTX.txId, AXTC_TOKEN_ID);
        currentTX.quantityAXTP = getQuantity(currentTX.txId, poolTokenId);
        readMessage(currentTX.txId, 0, currentTX.message);

        if(currentTX.quantityAXTP > 0){
            // burn
            sendQuantity(currentTX.quantityAXTP, poolTokenId, 0)
        }
        switch (currentTX.message[0]) {
            case SEND_AXTP_TO_HOLDER:
                SendAXTPToHolder(currentTX.message[1], currentTX.message[2]);
                break;
            case APPROVE_DISTRIBUTION:
                 ApproveDistribution();
                break;
            case UPDATE_GMV:
                 UpdateGMV(currentTX.message[1]);
                break;
            case DEACTIVATE:
                 Deactivate();
                break;
            default:
                txReceived();
        }
    }
}

// ---------------- PRIVATE ---------------------------

void constructor() {
    poolTokenId = issueAsset(poolName, "", 0);
    nominalValueAXTC = poolTokenQuantity * poolRate;
    grossMarketValueAXTC = nominalValueAXTC;
    approvals[0].account = APPROVER_1;
    approvals[1].account = APPROVER_2;
    approvals[2].account = APPROVER_3;
    approvals[3].account = APPROVER_4;
}

void resetDistributionApproved() {
    approvals[0].distributionApproved = 0;
    approvals[1].distributionApproved = 0;
    approvals[2].distributionApproved = 0;
    approvals[3].distributionApproved = 0;
}

long approveDistribution() {
    if( approvals[0].account == currentTX.sender ) {
        approvals[0].distributionApproved = 1;
    }

    if( approvals[1].account == currentTX.sender ) {
        approvals[1].distributionApproved = 1;
    }

    if( approvals[2].account == currentTX.sender ) {
        approvals[2].distributionApproved = 1;
    }

    if( approvals[3].account == currentTX.sender ) {
        approvals[3].distributionApproved = 1;
    }

    return( approvals[0].distributionApproved +
            approvals[1].distributionApproved +
            approvals[2].distributionApproved +
            approvals[3].distributionApproved >= MinimumApproval);
}

long isAuthorized() {
    return (approvals[0].account == currentTX.sender) ||
           (approvals[1].account == currentTX.sender) ||
         (approvals[2].account == currentTX.sender) ||
         (approvals[3].account == currentTX.sender) ;
}

// ---------------- PUBLIC ---------------------------

void Deactivate() {
    if(currentTX.sender == getCreator()){
        sendQuantityAndAmount(getAssetBalance(AXTC_TOKEN_ID), AXTC_TOKEN_ID, getCurrentBalance(), getCreator());
        isDeactivated = true;
    }
}

void ApproveDistribution() {
    if(approveDistribution()){
        distributeToHolders(1, poolTokenId,0, pendingPayoutAXTC, AXTC_TOKEN_ID);
        paidAXTC += pendingPayoutAXTC;
        resetDistributionApproved();
        pendingPayoutAXTC=0;
    }
}

void UpdateGMV(long valueAXTC) {
    if(isAuthorized()){
        grossMarketValueAXTC = valueAXTC;
    }
}

void SendAXTPToHolder(long holderId, long quantityAXTP) {
    if(!isAuthorized()){
        return;
    }

    if(getAssetCirculating(poolTokenId) + quantityAXTP > poolTokenQuantity){
        messageBuffer[]="Not enough Pool Tokens left";
        sendMessage(messageBuffer, currentTX.sender);
        return;
    }
    mintAsset(toMint, poolTokenId);
    sendQuantity(quantityAXTP, poolTokenId, holderId);
}

void txReceived(void) {
    if(currentTX.quantityAXTC > 0){
        pendingPayoutAXTC += currentTX.quantityAXTC;
    }
}
