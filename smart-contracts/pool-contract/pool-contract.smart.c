/**
This contract must be pre-configured, before being deployed:

1. Approver Account IDs
2. AXTC_TOKEN_ID - i.e. the token must be issued before this contract can be deployed
3. AXTC_MASTER_CONTRACT_ID - i.e. implicitely created with previous issuance
4. Do not forget the SIMULATOR,TESTNET,MAINNET defines!
*/

#program name AXTPoolContractRef
#program activationAmount .25
#pragma optimizationLevel 3
#pragma maxAuxVars 3
#pragma version 2.2.1

// #define SIMULATOR
// #define TESTNET
// #define MAINNET

#ifdef TESTBED
    #define APPROVER_1 301
    #define APPROVER_2 302
    #define APPROVER_3 303
    #define APPROVER_4 304
    #define AXTC_TOKEN_ID 101011
    #define AXTC_MASTER_CONTRACT_ID 101
#endif

#ifdef SIMULATOR
    #define APPROVER_1 1
    #define APPROVER_2 2
    #define APPROVER_3 3
    #define APPROVER_4 4
    #define AXTC_TOKEN_ID 101011
    #define AXTC_MASTER_CONTRACT_ID 101
#endif
#ifdef TESTNET
    #define APPROVER_1 3549690777743760998
    #define APPROVER_2 7473730462792140210
    #define APPROVER_3 5757380649245251466
    #define APPROVER_4 10746331379201355428
    #define AXTC_TOKEN_ID 17364735717996724982
    #define AXTC_MASTER_CONTRACT_ID 11140234818474766359
#endif
#ifdef MAINNET
    #define APPROVER_1 8797953487734693092
    #define APPROVER_2 7001023189548812882
    #define APPROVER_3 3744968806698214868
    #define APPROVER_4 9467750625510510168
    #define AXTC_TOKEN_ID 6819420180754712492
    #define AXTC_MASTER_CONTRACT_ID 16178473761798608633
#endif

#define SEND_AXTP_TO_HOLDER 1
#define APPROVE_DISTRIBUTION 2
#define UPDATE_GMV 3
#define REQUEST_REFUND_AXTC 4
#define APPROVE_REFUND_AXTC 5
#define DEACTIVATE 99

// global variables, will be available in all functions
// external/loadable variables
long poolName;
long poolRate; // two digits
long poolTokenQuantity;


#ifdef SIMULATOR
    const poolName = "AXTP0001";
    const poolRate = 5000_00;
    const poolTokenQuantity = 100;
#endif

#ifdef TESTBED
    const poolName = TESTBED_poolName;
    const poolRate = TESTBED_poolRate;
    const poolTokenQuantity = TESTBED_poolTokenQuantity;
#endif



// internal values, i.e. set during execution
long nominalValueAXTC;
long poolTokenId;
long paidAXTC;
long grossMarketValueAXTC;
long refundAXTC;

struct APPROVAL {
  long account, distributionApproved, refundingApproved;
} approvals[4];

long isDeactivated = false;
const long MinimumApproval = 3;

struct TXINFO {
    long txId,
        timestamp,
        sender,
        quantityAXTP,
        message[4];
} currentTX;

long messageBuffer[4];

constructor();

void main(void) {
    while ((currentTX.txId = getNextTx()) != 0) {

        currentTX.sender = getSender(currentTX.txId);
        currentTX.quantityAXTP = getQuantity(currentTX.txId, poolTokenId);

        if(isDeactivated){
            refund();
            continue;
        }

        readMessage(currentTX.txId, 0, currentTX.message);

        switch (currentTX.message[0]) {
            case SEND_AXTP_TO_HOLDER:
                SendAXTPToHolder(currentTX.message[1], currentTX.message[2]);
                break;
            case APPROVE_DISTRIBUTION:
                 ApproveDistribution();
                break;
            case REQUEST_REFUND_AXTC:
                 RequestRefundAXTC(currentTX.message[1]);
                break;
            case APPROVE_REFUND_AXTC:
                 ApproveRefundAXTC();
                break;
            case UPDATE_GMV:
                 UpdateGMV(currentTX.message[1]);
                break;
            case DEACTIVATE:
                 Deactivate();
                break;
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

void resetRefundAXTCApproved() {
    approvals[0].refundingApproved = 0;
    approvals[1].refundingApproved = 0;
    approvals[2].refundingApproved = 0;
    approvals[3].refundingApproved = 0;
}

long approveDistributionAction() {
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

    return( (approvals[0].distributionApproved +
            approvals[1].distributionApproved +
            approvals[2].distributionApproved +
            approvals[3].distributionApproved) >= MinimumApproval);
}

long approveRefundAXTCAction() {
    if( approvals[0].account == currentTX.sender ) {
        approvals[0].refundingApproved = 1;
    }

    if( approvals[1].account == currentTX.sender ) {
        approvals[1].refundingApproved = 1;
    }

    if( approvals[2].account == currentTX.sender ) {
        approvals[2].refundingApproved = 1;
    }

    if( approvals[3].account == currentTX.sender ) {
        approvals[3].refundingApproved = 1;
    }

    return( (approvals[0].refundingApproved +
            approvals[1].refundingApproved +
            approvals[2].refundingApproved +
            approvals[3].refundingApproved) >= MinimumApproval);
}

long isAuthorized() {
    return (approvals[0].account == currentTX.sender) ||
           (approvals[1].account == currentTX.sender) ||
         (approvals[2].account == currentTX.sender) ||
         (approvals[3].account == currentTX.sender);
}

long refund(){
    sendAmount(getAmount(currentTX.txId), currentTX.sender);
    if(currentTX.quantityAXTP > 0){
        sendQuantity(currentTX.quantityAXTP, poolTokenId, currentTX.sender);
    }

    long axtcQuantity = getQuantity(currentTX.txId, AXTC_TOKEN_ID);
    if(axtcQuantity > 0) {
        sendQuantity(axtcQuantity, AXTC_TOKEN_ID, currentTX.sender);
    }

    sendBalance(getCreator());
}

// ---------------- PUBLIC ---------------------------

void Deactivate() {
    if(currentTX.sender == getCreator()){
        isDeactivated = true;
        long axtcBalance = getAssetBalance(AXTC_TOKEN_ID);
        if(axtcBalance > 0){
            sendQuantity(axtcBalance, AXTC_TOKEN_ID, AXTC_MASTER_CONTRACT_ID);
        }
        sendBalance(getCreator());
    }
}

void ApproveDistribution() {
    if(approveDistributionAction()){
        resetDistributionApproved();
        long payout = getAssetBalance(AXTC_TOKEN_ID);
        distributeToHolders(1, poolTokenId, 0, AXTC_TOKEN_ID, payout);
        paidAXTC += payout;
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
    long toMint = quantityAXTP - getAssetBalance(poolTokenId);
    if(getAssetCirculating(poolTokenId) + toMint > poolTokenQuantity){
        messageBuffer[]="Not enough Pool Tokens left";
        sendMessage(messageBuffer, currentTX.sender);
        return;
    }
    mintAsset(toMint, poolTokenId);
    sendQuantity(quantityAXTP, poolTokenId, holderId);
}

void RequestRefundAXTC(long quantityAXTC) {
    if(!isAuthorized()){
        return;
    }
    long balance = getAssetBalance(AXTC_TOKEN_ID);
    if(quantityAXTC > balance){
        messageBuffer[]="Not enough AXTC for refunding";
        sendMessage(messageBuffer, currentTX.sender);
    }else{
        refundAXTC = quantityAXTC;
        resetRefundAXTCApproved();
    }
}

void ApproveRefundAXTC() {
    if(!isAuthorized() || refundAXTC == 0){
        return;
    }
    if(approveRefundAXTCAction()){
        resetRefundAXTCApproved();
        sendQuantity(refundAXTC, AXTC_TOKEN_ID, AXTC_MASTER_CONTRACT_ID);
        refundAXTC = 0;
    }
}
