import { ethers } from "ethers";
import { useWalletClient, useChainId } from "wagmi";
import abi from "../utils/contractABI";
import { CONTRACT_ADDRESSES } from "../utils/constants";
import { useCallback, useState, useEffect } from "react";

export const useContract = () => {
  const chainId = useChainId(); // Get the current network's chain ID
  const { data: walletClient } = useWalletClient();
  const [contractBalance, setContractBalance] = useState<string>('0');

  const getContract = useCallback(async () => {
    if (!walletClient) {
      //throw new Error("Wallet client not connected")
      return false;
    };

    // Get the contract address for the current chain ID
    const CONTRACT_ADDRESS = CONTRACT_ADDRESSES[chainId || 0];

    if (!CONTRACT_ADDRESS) {
      //throw new Error(`Unsupported network with chain ID: ${chainId}`);
      return false;
    }

    try {
      // Create a provider and signer
      const provider = new ethers.BrowserProvider(walletClient.transport);
      const signer = await provider.getSigner();

      const contractBalanceWei = await provider.getBalance(CONTRACT_ADDRESS);
      const contractBalance = ethers.formatEther(contractBalanceWei);
      setContractBalance(contractBalance);
      // Return the contract instance
      return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
    } catch (error) {
      console.error("Error creating contract instance:", error);
      return false;
    }
  }, [walletClient, chainId]);

  // Reset state when network changes
  useEffect(() => {
    setContractBalance('0');
  }, [chainId]);

  return { getContract, contractBalance, chainId };
};
