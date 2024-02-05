#program name AXTBurnContract
#program description This contract burns and tracks burned tokens.
#program activationAmount 3000_0000

#pragma maxAuxVars 3
#pragma verboseAssembly
#pragma optimizationLevel 3
#pragma version 2.1.1

// Magic codes for methods
#define ADD_TRACKABLE_TOKEN 1
#define REMOVE_TRACKABLE_TOKEN 2
#define CREDIT_TRACKED_TOKEN 3

#define MAP_KEY_TRACKABLE_TOKENS 1

// INTERNALS
struct TXINFO {
    long txId;
    long sender;
    long message[4];
} currentTx;

constructor();

void main () {
    // loops over the transactions of the current block
    while ((currentTx.txId = getNextTx()) != 0) {
        currentTx.sender = getSender(currentTx.txId);
        readMessage(currentTx.txId, 0, currentTx.message);
            switch(currentTx.message[0]){
                case ADD_TRACKABLE_TOKEN:
                    // void addTrackableToken(long tokenId)
                    addTrackableToken(currentTx.message[1]);
                    break;
                case REMOVE_TRACKABLE_TOKEN:
                    // void removeTrackableToken(long tokenId)
                    removeTrackableToken(currentTx.message[1]);
                    break;
                case CREDIT_TRACKED_TOKEN:
                    // void creditTrackedToken(long tokenId,long quantity,long accountId)
                    creditTrackedToken(currentTx.message[1], currentTx.message[2], currentTx.message[3]);
                    break;
                default:
                    processTransaction();
            }
    }
};


void constructor() {
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

void addTrackableToken(long tokenId){
    if(!hasPermission()){
        return;
    }

    setMapValue(MAP_KEY_TRACKABLE_TOKENS, tokenId, 1);
}

void removeTrackableToken(long tokenId){
    if(!hasPermission()){
        return;
    }

    setMapValue(MAP_KEY_TRACKABLE_TOKENS, tokenId, 0);
}

void creditTrackedToken(long tokenId, long quantity, long accountId){
    if(!hasPermission()){
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

// private
long hasPermission(){
   return currentTx.sender == getCreator();
}
