#program name AXTTokenBurnTracker
#program description {"vs":1,"tp":"smc","nm":"AXT Token Burn Tracker","ds":"This contract tracks burned tokens of the AXT Ecosystem","av":{"bafkreif24abtng5qgo76yld6dipwyvld6cgxrqjuf4fqrrxo2fyp4adpoa":"image/jpg"}}
#program activationAmount 2500_0000

#pragma maxAuxVars 3
#pragma verboseAssembly
#pragma optimizationLevel 3
#pragma version 2.2.1

#define TRUE 1
#define FALSE 0

// Magic codes for methods
#define ADD_TRACKABLE_TOKEN 1
#define REMOVE_TRACKABLE_TOKEN 2
#define CREDIT_TRACKED_TOKEN 3
#define RETURN_TRACKED_TOKEN 4
#define ADD_CREDITOR_PERMISSION 5
#define REMOVE_CREDITOR_PERMISSION 6

#define MAP_KEY_TRACKABLE_TOKENS 1
#define MAP_KEY_CREDITOR_PERMISSIONS 2

// INTERNALS
struct TXINFO {
    long txId;
    long sender;
    long message[4];
} currentTx;

void main () {
    // loops over the transactions of the current block
    while ((currentTx.txId = getNextTx()) != 0) {
        currentTx.sender = getSender(currentTx.txId);
        readMessage(currentTx.txId, 0, currentTx.message);
            switch(currentTx.message[0]){
                case ADD_TRACKABLE_TOKEN:
                    // void setTrackableToken(long tokenId, long isEnabled)
                    setTrackableToken(currentTx.message[1], TRUE);
                    break;
                case REMOVE_TRACKABLE_TOKEN:
                    // void removeTrackableToken(long tokenId)
                    setTrackableToken(currentTx.message[1], FALSE);
                    break;
                case CREDIT_TRACKED_TOKEN:
                    // void creditTrackedToken(long tokenId,long quantity,long accountId)
                    creditTrackedToken(currentTx.message[1], currentTx.message[2], currentTx.message[3]);
                    break;
                case RETURN_TRACKED_TOKEN:
                    // void returnTrackedToken(long tokenId,long quantity,long accountId)
                    returnTrackedToken(currentTx.message[1], currentTx.message[2], currentTx.message[3]);
                    break;
                case ADD_CREDITOR_PERMISSION:
                    // void addCreditorPermission(long accountId)
                    setCreditorPermission(currentTx.message[1], TRUE);
                    break;
                case REMOVE_CREDITOR_PERMISSION:
                    // void removeCreditorPermission(long accountId)
                    setCreditorPermission(currentTx.message[1], FALSE);
                    break;
                default:
                    processTransaction();
            }
    }
};

void catch() {
  asm {
    JMP :__fn_main
  }
}

void processTransaction(){
    long assets[4];
    readAssets(currentTx.txId, assets);
    eventuallyTrackToken(assets[0]);
    eventuallyTrackToken(assets[1]);
    eventuallyTrackToken(assets[2]);
    eventuallyTrackToken(assets[3]);
}

void eventuallyTrackToken(long tokenId){
    if(!tokenId) { return; }
    long isTrackable = getMapValue(MAP_KEY_TRACKABLE_TOKENS, tokenId);
    if(!isTrackable) { return; }
    long currentCredits = getMapValue(tokenId, currentTx.sender);
    long newCredits = getQuantity(currentTx.txId, tokenId);
    setMapValue(tokenId, currentTx.sender, currentCredits + newCredits);
}

void setTrackableToken(long tokenId, long isEnabled){
    if(!hasCreatorPermission()){
        return;
    }

    setMapValue(MAP_KEY_TRACKABLE_TOKENS, tokenId, isEnabled);
}

void setCreditorPermission(long accountId, long isEnabled) {
    if(!hasCreatorPermission()){
        return;
    }
    setMapValue(MAP_KEY_CREDITOR_PERMISSIONS, accountId, isEnabled);
}

void creditTrackedToken(long tokenId, long quantity, long accountId){
    if(!hasCreditorPermission()){
        return;
    }

    // we don't check for trackable tokens, because
    // it may happen that a trackable was removed, but still has credits
    // it must be possible to de-credit at anytime.

    long currentCredits = getMapValue(tokenId,accountId);
    if(currentCredits == 0){
        return;
    }
    
    long newCredits = currentCredits - quantity;
    if (newCredits < 0){
        newCredits = 0;
    }
    
    setMapValue(tokenId, accountId, newCredits);
}

void returnTrackedToken(long tokenId, long quantity, long accountId){
    if(!hasCreditorPermission()){
        return;
    }

    // we don't check for trackable tokens, because
    // it may happen that a trackable was removed, but still has credits
    // it must be possible to de-credit at anytime.

    long currentCredits = getMapValue(tokenId,accountId);
    if(currentCredits == 0){
        return;
    }

    if(quantity == 0){
        return;
    }

    if(quantity > currentCredits){
        quantity = currentCredits;
    }

    long newCredits = currentCredits - quantity;
    if (newCredits < 0){
        newCredits = 0;
    }

    sendQuantity(quantity, tokenId, accountId);
    setMapValue(tokenId, accountId, newCredits);
}

// private
long hasCreatorPermission(){
   return currentTx.sender == getCreator();
}

long hasCreditorPermission() {
   return getMapValue(MAP_KEY_CREDITOR_PERMISSIONS, currentTx.sender);
}

