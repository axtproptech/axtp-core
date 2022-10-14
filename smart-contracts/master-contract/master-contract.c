#define VERSION 1
#define SIMULATOR
#define TESTNET
// #define MAINNET

#program name AXTMasterContract
#program activationAmount .25
#pragma optimizationLevel 3
#pragma maxAuxVars 4

#ifdef SIMULATOR
    #define TOKEN_NAME "SIMAXTC"
    #define APPROVER_1 1
    #define APPROVER_2 2
    #define APPROVER_3 3
    #define APPROVER_4 4
#endif
#ifdef TESTNET
    #define TOKEN_NAME "TAXTC"
    #define APPROVER_1 3549690777743760998
    #define APPROVER_2 7473730462792140210
    #define APPROVER_3 5757380649245251466
    #define APPROVER_4 10746331379201355428
#endif
#ifdef MAINNET
    // TO DO
    #define TOKEN_NAME "AXTC"
    #define APPROVER_1 1
    #define APPROVER_2 2
    #define APPROVER_3 3
    #define APPROVER_4 4
#endif

// Set public functions magic numbers
#define REQUEST_MINT_AXTC 0x2ad2251e2c50bb44
#define APPROVE_MINT_AXTC 0xd29baa091c36518c
#define REQUEST_BURN_AXTC 0xc71ee27abd19dcf5
#define APPROVE_BURN_AXTC 0x8b089aff194be58c
#define REQUEST_SEND_TO_POOL 0xacb080bf3498cfb5
#define APPROVE_SEND_TO_POOL 0xe3d9426f20c5859b
#define DEACTIVATE 0x6a20a7b2b4abec85

// global variables, will be available in all functions
// external/loadable variables
long axtcTokenId;

// internal values, i.e. set during execution
long pendingMintAXTC;
long pendingBurnAXTC;
long pendingPoolSendAXTC;
long requestedPoolSendAddress;
long messageBuffer[4];
long isDeactivated = false;

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
        quantityAXTC,
        message[4];
} currentTX;

constructor();

void main(void) {
    while ((currentTX.txId = getNextTx()) != 0) {
        if(isDeactivated){
            continue;
        }

        currentTX.sender = getSender(currentTX.txId);
        readMessage(currentTX.txId, 0, currentTX.message);

        switch (currentTX.message[0]) {
            case REQUEST_MINT_AXTC:
                RequestMintAXTC(currentTX.message[1]);
                break;
            case APPROVE_MINT_AXTC:
                ApproveMintAXTC();
            break;
            case REQUEST_BURN_AXTC:
                RequestBurnAXTC(currentTX.message[1]);
                break;
            case APPROVE_BURN_AXTC:
                ApproveBurnAXTC();
            break;
            case REQUEST_SEND_TO_POOL:
                RequestSendToPool(currentTX.message[1], currentTX.message[2]);
                break;
            case APPROVE_SEND_TO_POOL:
                ApproveSendToPool();
            case DEACTIVATE:
                Deactivate();
            break;
            default:
                continue;
        }
    }
}


// ---------------- PRIVATE ---------------------------

void constructor() {
    if(!axtcTokenId){
        axtcTokenId = issueAsset(TOKEN_NAME, "", 2);
    }
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
    approvals[0].burnApproved = 0;
    approvals[1].burnApproved = 0;
    approvals[2].burnApproved = 0;
    approvals[3].burnApproved = 0;
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

    return ((approvals[0].mintApproved +
        approvals[1].mintApproved +
        approvals[2].mintApproved +
        approvals[3].mintApproved) >= MinimumApproval);

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

    return ((approvals[0].burnApproved +
        approvals[1].burnApproved +
        approvals[2].burnApproved +
        approvals[3].burnApproved) >= MinimumApproval);

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

    return ((approvals[0].poolSendApproved +
        approvals[1].poolSendApproved +
        approvals[2].poolSendApproved +
        approvals[3].poolSendApproved) >= MinimumApproval);
}


long isAuthorized() {
    return (approvals[0].account == currentTX.sender) ||
         (approvals[1].account == currentTX.sender) ||
         (approvals[2].account == currentTX.sender) ||
         (approvals[3].account == currentTX.sender);
}

// ---------------- PUBLIC ---------------------------
void Deactivate() {
    if(currentTX.sender == getCreator()){
        sendQuantityAndAmount(getAssetBalance(axtcTokenId), axtcTokenId, getCurrentBalance(), getCreator());
        isDeactivated = true;
    }
}


void RequestSendToPool(long quantityAXTC, long poolAddress) {
    if(!isAuthorized()){
        return;
    }

    requestedPoolSendAddress = poolAddress;
    pendingPoolSendAXTC = quantityAXTC;
    resetPoolSendActionApproval();
}

void ApproveSendToPool(){
    if(!isAuthorized()){
        return;
    }

    if(approveSendPoolAction()){
        sendQuantity(pendingPoolSendAXTC, axtcTokenId, requestedPoolSendAddress);
        requestedPoolSendAddress = 0;
        pendingPoolSendAXTC = 0;
        resetPoolSendActionApproval();
    }
}

void RequestMintAXTC(long quantityAXTC) {
    if(!isAuthorized()){
        return;
    }
    pendingMintAXTC = quantityAXTC;
    resetMintActionApproval();
}

void ApproveMintAXTC(){
    if(!isAuthorized()){
        return;
    }

    if(approveMintAction()){
        mintAsset(pendingMintAXTC, axtcTokenId);
        pendingMintAXTC = 0;
        resetMintActionApproval();
    }
}

void RequestBurnAXTC(long quantityAXTC) {
    if(!isAuthorized()){
        return;
    }
    pendingBurnAXTC = quantityAXTC;
    resetBurnActionApproval();
}

void ApproveBurnAXTC(){
    if(!isAuthorized()){
        return;
    }

    if(approveBurnAction()){
        sendQuantity(pendingBurnAXTC, axtcTokenId, 0);
        pendingBurnAXTC = 0;
        resetBurnActionApproval();
    }
}

