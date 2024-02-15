import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { actions as appActions } from "@/app/states/appState";
import {
  actions as accountActions,
  selectRememberWalletConnection,
} from "@/app/states/accountState";
import { useEffect, useRef } from "react";
import { requestWalletConnection } from "@/app/requestWalletConnection";
import { useAppContext } from "@/app/hooks/useAppContext";
import {
  ExtensionWalletError,
  GenericExtensionWallet,
  WalletConnection,
} from "@signumjs/wallets";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useInitRef } from "@/app/components/appInitializer/useInitRef";

export const WalletInitializer = () => {
  const { Ledger, Wallet, Platform } = useAppContext();
  const { setInitialized, isInitialized } = useInitRef();
  const { showWarning } = useSnackbar();
  const dispatch = useAppDispatch();
  const listenerRef = useRef<any>(null);
  const connectionRef = useRef<WalletConnection | null>(null);
  const rememberConnection = useAppSelector(selectRememberWalletConnection);

  useEffect(() => {
    if (isInitialized()) return;
    function handleDisconnectWallet() {
      listenerRef.current?.unlisten();
      connectionRef.current = null;
      dispatch(appActions.setIsWalletConnected(false));
      dispatch(appActions.setNodeHost(Ledger.DefaultNode));
      dispatch(accountActions.setPublicKey(""));
      Wallet.Extension = new GenericExtensionWallet();
    }

    function onNetworkChange(args: any) {
      if (args.networkName === Ledger.Network) {
        dispatch(appActions.setNodeHost(args.networkHost));
        return;
      }
      showWarning("Network changed");
    }

    function onAccountChange(args: any) {
      dispatch(accountActions.setPublicKey(args.accountPublicKey));
    }

    function onPermissionOrAccountRemoval() {
      showWarning("Permission or Account removed");
      handleDisconnectWallet();
    }

    function handleExtensionErrors(e: ExtensionWalletError) {
      switch (e.name) {
        case "NotFoundWalletError":
          dispatch(appActions.setWalletModal(true));
          break;
        case "InvalidNetworkError":
          dispatch(appActions.setWalletWrongNetworkModal(true));
          break;
        case "NotGrantedWalletError":
          showWarning("Action cancelled or not permitted");
          break;
        default:
          // unexpected error
          console.error(e);
      }
    }

    async function handleConnectWallet() {
      if (connectionRef.current) return;
      try {
        const connection = await Wallet.Extension.connect({
          appName: Platform.Name,
          networkName: Ledger.Network,
        });
        dispatch(appActions.setIsWalletConnected(true));
        dispatch(appActions.setNodeHost(connection.currentNodeHost));
        dispatch(accountActions.setPublicKey(connection.publicKey || ""));
        dispatch(accountActions.setRememberWalletConnection(true));

        listenerRef.current = connection.listen({
          onNetworkChanged: onNetworkChange,
          onAccountChanged: onAccountChange,
          onPermissionRemoved: onPermissionOrAccountRemoval,
          onAccountRemoved: onPermissionOrAccountRemoval,
        });
        connectionRef.current = connection;
      } catch (e) {
        if (e instanceof ExtensionWalletError) {
          handleExtensionErrors(e);
        } else {
          console.error(e);
        }
      }
    }

    function handleStartSigning() {
      dispatch(appActions.setSignTransactionModal(true));
    }

    function handleEndSigning() {
      dispatch(appActions.setSignTransactionModal(false));
    }

    window.addEventListener("connect-wallet", handleConnectWallet);
    window.addEventListener("disconnect-wallet", handleDisconnectWallet);
    window.addEventListener("wallet-sign-start", handleStartSigning);
    window.addEventListener("wallet-sign-end", handleEndSigning);

    if (rememberConnection) {
      requestWalletConnection();
    }

    setInitialized();

    return () => {
      listenerRef.current?.unlisten();
      window.removeEventListener("connect-wallet", handleConnectWallet);
      window.removeEventListener("disconnect-wallet", handleDisconnectWallet);
      window.removeEventListener("wallet-sign-start", handleStartSigning);
      window.removeEventListener("wallet-sign-end", handleEndSigning);
    };
  }, [rememberConnection]);

  return null;
};
