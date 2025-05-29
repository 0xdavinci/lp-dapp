import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

// Pocket Token ABI - ERC20 standard
const POCKET_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
] as const;

const POCKET_TOKEN_ADDRESS = {
  1: "0xa94485f44dd21c8cb547aee50979a29272ec5326", // Mainnet
  11155111: "0x0000000000000000000000000000000000000000", // Sepolia (placeholder)
} as const;

export const usePocketToken = () => {
  const { address, isConnected } = useAccount();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [decimals, setDecimals] = useState<number | null>(null);

  useEffect(() => {
    const checkBalance = async () => {
      if (!isConnected || !address) {
        console.log("Not connected or no address");
        setHasAccess(false);
        setIsLoading(false);
        return;
      }

      try {
        // Create provider
        const provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");
        console.log("Provider created");

        // Create contract instance
        const contract = new ethers.Contract(
          POCKET_TOKEN_ADDRESS[1],
          POCKET_TOKEN_ABI,
          provider
        );
        console.log("Contract instance created");

        // Get decimals
        const tokenDecimals = await contract.decimals();
        console.log("Decimals:", tokenDecimals);
        setDecimals(tokenDecimals);

        // Get balance
        const tokenBalance = await contract.balanceOf(address);
        console.log("Raw balance:", tokenBalance.toString());
        setBalance(tokenBalance);

        // Calculate formatted balance
        const formattedBalance = Number(ethers.formatUnits(tokenBalance, tokenDecimals));
        console.log("Formatted balance:", formattedBalance);

        // Set access based on balance
        setHasAccess(formattedBalance > 0);
        setError(null);
      } catch (err) {
        console.error("Error checking Pocket Token balance:", err);
        setError(err instanceof Error ? err.message : "Failed to verify Pocket Token balance");
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkBalance();
  }, [isConnected, address]);

  return {
    hasAccess,
    isLoading,
    error,
    balance: balance && decimals
      ? Number(ethers.formatUnits(balance, decimals))
      : 0,
  };
};
