#program name RestMasterContract
#program activationAmount .25
#pragma optimizationLevel 3

#define VERSION 1
// #define SIMULATOR
#define TESTNET
// #define MAINNET


#ifdef SIMULATOR
    #define TOKEN_NAME "SIMRESTC"
    #define APPROVER_1 1
    #define APPROVER_2 2
    #define APPROVER_3 3
    #define APPROVER_4 4
#endif
#ifdef TESTNET
    #define TOKEN_NAME "TRESTC"
    #define APPROVER_1 3549690777743760998
    #define APPROVER_2 7473730462792140210
    #define APPROVER_3 5757380649245251466
    #define APPROVER_4 10746331379201355428
#endif
#ifdef MAINNET
    // TO DO
    #define TOKEN_NAME "RESTC"
    #define APPROVER_1 1
    #define APPROVER_2 2
    #define APPROVER_3 3
    #define APPROVER_4 4
#endif

// Set public functions magic numbers
#define REQUEST_MINT_STC 0x2ad2251e2c50bb44
#define APPROVE_MINT_STC 0xd29baa091c36518c
#define REQUEST_BURN_STC 0xc71ee27abd19dcf5
#define APPROVE_BURN_STC 0x8b089aff194be58c
#define REQUEST_SEND_TO_POOL 0xacb080bf3498cfb5
#define APPROVE_SEND_TO_POOL 0xe3d9426f20c5859b


// global variables, will be available in all functions
// external/loadable variables


// internal values, i.e. set during execution
long stcTokenId;
long pendingMintSTC;
long pendingBurnSTC;
long pendingPoolSendSTC;
long requestedPoolSendAddress;
long messageBuffer[4];


struct APPROVAL {
  long account,
    mintApproved,
    burnApproved,
    poolSendApproved;
} approvals[4];



const long MinimumApproval = 3;

struct TXINFO {
    long txId,
        timestamp,
        sender,
        quantitySTC,
        message[4];
} currentTX;

constructor();

void main(void) {
    while ((currentTX.txId = getNextTx()) != 0) {
        currentTX.sender = getSender(currentTX.txId);
        readMessage(currentTX.txId, 0, currentTX.message);

        switch (currentTX.message[0]) {
            case REQUEST_MINT_STC:
                RequestMintSTC(currentTX.message[1]);
                break;
            case APPROVE_MINT_STC:
                ApproveMintSTC();
            break;
            case REQUEST_BURN_STC:
                RequestBurnSTC(currentTX.message[1]);
                break;
            case APPROVE_BURN_STC:
                ApproveBurnSTC();
            break;
            case REQUEST_SEND_TO_POOL:
                RequestSendToPool(currentTX.message[1], currentTX.message[2]);
                break;
            case APPROVE_SEND_TO_POOL:
                ApproveSendToPool();
            break;
            default:
                continue;
        }
    }
}


// ---------------- PRIVATE ---------------------------

void constructor() {
    stcTokenId = issueAsset(TOKEN_NAME, "", 2);
    approvals[0].account = APPROVER_1;
    approvals[1].account = APPROVER_2;
    approvals[2].account = APPROVER_3;
    approvals[3].account = APPROVER_4;
}

void resetMintActionApproval() {
    approvals[0].mintApproved = 0;
    approvals[1].mintApproved = 0;
    approvals[2].mintApproved = 0;
    approvals[3].mintApproved = 0;
}

void resetBurnActionApproval() {
    approvals[0].mintApproved = 0;
    approvals[1].mintApproved = 0;
    approvals[2].mintApproved = 0;
    approvals[3].mintApproved = 0;
}

void resetPoolSendActionApproval() {
    approvals[0].poolSendApproved = 0;
    approvals[1].poolSendApproved = 0;
    approvals[2].poolSendApproved = 0;
    approvals[3].poolSendApproved = 0;
}


long approveMintAction() {
    if( approvals[0].account == currentTX.sender ) {
        approvals[0].mintApproved = 1;
    }

    if( approvals[1].account == currentTX.sender ) {
        approvals[1].mintApproved = 1;
    }

    if( approvals[2].account == currentTX.sender ) {
        approvals[2].mintApproved = 1;
    }

    if( approvals[3].account == currentTX.sender ) {
        approvals[3].mintApproved = 1;
    }

    if ((approvals[0].mintApproved +
        approvals[1].mintApproved +
        approvals[2].mintApproved +
        approvals[3].mintApproved) >= MinimumApproval){
       return 1;
   }
   return 0;

}

long approveBurnAction() {
    if( approvals[0].account == currentTX.sender ) {
        approvals[0].burnApproved = 1;
    }

    if( approvals[1].account == currentTX.sender ) {
        approvals[1].burnApproved = 1;
    }

    if( approvals[2].account == currentTX.sender ) {
        approvals[2].burnApproved = 1;
    }

    if( approvals[3].account == currentTX.sender ) {
        approvals[3].burnApproved = 1;
    }

    if ((approvals[0].burnApproved +
        approvals[1].burnApproved +
        approvals[2].burnApproved +
        approvals[3].burnApproved) >= MinimumApproval){
       return 1;
   }
   return 0;

}


long approveSendPoolAction() {
    if( approvals[0].account == currentTX.sender ) {
        approvals[0].poolSendApproved = 1;
    }

    if( approvals[1].account == currentTX.sender ) {
        approvals[1].poolSendApproved = 1;
    }

    if( approvals[2].account == currentTX.sender ) {
        approvals[2].poolSendApproved = 1;
    }

    if( approvals[3].account == currentTX.sender ) {
        approvals[3].poolSendApproved = 1;
    }

    if ((approvals[0].poolSendApproved +
        approvals[1].poolSendApproved +
        approvals[2].poolSendApproved +
        approvals[3].poolSendApproved) >= MinimumApproval){
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


void RequestSendToPool(long quantitySTC, long poolAddress) {
    if(!isAuthorized()){
        return;
    }

    requestedPoolSendAddress = poolAddress;
    pendingPoolSendSTC = quantitySTC;
    resetMintActionApproval();
}

void ApproveSendToPool(){
    if(!isAuthorized()){
        return;
    }

    if(approveSendPoolAction()){
        sendQuantity(pendingPoolSendSTC, stcTokenId, requestedPoolSendAddress);
        requestedPoolSendAddress = 0;
        pendingPoolSendSTC = 0;
        resetPoolSendActionApproval();
    }
}

void RequestMintSTC(long quantitySTC) {
    if(!isAuthorized()){
        return;
    }
    pendingMintSTC = quantitySTC;
    resetMintActionApproval();
}

void ApproveMintSTC(){
    if(!isAuthorized()){
        return;
    }

    if(approveMintAction()){
        mintAsset(pendingMintSTC, stcTokenId);
        pendingMintSTC = 0;
        resetMintActionApproval();
    }
}

void RequestBurnSTC(long quantitySTC) {
    if(!isAuthorized()){
        return;
    }
    pendingBurnSTC = quantitySTC;
    resetBurnActionApproval();
}

void ApproveBurnSTC(){
    if(!isAuthorized()){
        return;
    }

    if(approveBurnAction()){
        sendQuantity(pendingBurnSTC, stcTokenId, 0);
        pendingBurnSTC = 0;
        resetBurnActionApproval();
    }
}

