import { useState, useEffect, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { registry } from "@neptunemutual/sdk";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";

export const useLiquidityBalance = () => {
  const [balance, setBalance] = useState("0");
  const { library, account, chainId } = useWeb3React();

  const fetchBalance = useCallback(async () => {
    if (!chainId || !account) return "0";

    try {
      const signerOrProvider = getProviderOrSigner(library, account, chainId);

      const liquidityTokenInstance = await registry.LiquidityToken.getInstance(
        chainId,
        signerOrProvider
      );

      if (!liquidityTokenInstance) {
        console.log(
          "Could not get an instance of the protocol stablecoin from the SDK"
        );
      }

      return liquidityTokenInstance.balanceOf(account);
    } catch (e) {
      console.error(e);
    }

    return "0";
  }, [account, chainId, library]);

  useEffect(() => {
    let ignore = false;

    fetchBalance().then((_balance) => {
      if (ignore) return;
      setBalance(_balance.toString());
    });

    return () => (ignore = true);
  }, [fetchBalance]);

  return { balance };
};
