"use client";

import React, { useState, useEffect } from 'react';
import useLPData from '../hooks/useLPData';
import { ethers } from "ethers";
import { useAccount, useChainId, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import abi from '../utils/contractABI';
import { CONTRACT_ADDRESSES } from '../utils/constants';
import useCallSchedule from '../hooks/useCallSchedule';
import { toast } from 'react-toastify';

interface PaymentFormProps {
  className?: string;
  setRefreshPage?: Function
}

const PaymentForm: React.FC<PaymentFormProps> = ({ className, setRefreshPage }) => {
  const { address } = useAccount();
  const chainId = useChainId(); // Get the current network's chain ID
  const CONTRACT_ADDRESS = CONTRACT_ADDRESSES[chainId || 0];

  const { pendingCapitalCall: pendingCapitalCall } = useCallSchedule(address || "0x");

  const pendingCallId = pendingCapitalCall?.id;
  // Use the new useWriteContract hook
  const { writeContract, data: hash, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, status } = useWaitForTransactionReceipt({ hash });

  const { ethUsdRate } = useLPData(address || "0x");

  const [ethAmount, setEthAmount] = useState("");
  const [usdAmount, setUsdAmount] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reset form state when network changes
  useEffect(() => {
    setEthAmount("");
    setUsdAmount(0);
    setValidationError(null);
  }, [chainId]);

  useEffect(() => {
    const eth = parseFloat(ethAmount);
    if (!isNaN(eth)) {
      setUsdAmount(eth * Number(ethUsdRate));
    }
  }, [ethAmount, chainId, ethUsdRate]);

  useEffect(() => {
    if (!isConfirming) {
      setRefreshPage!((prev: Boolean) => !prev);
    }
  }, [isConfirming, setRefreshPage]);

  const validateForm = () => {
    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      setValidationError("Please enter a valid amount greater than 0");
      return false;
    }
    if (!pendingCallId) {
      setValidationError("No pending capital call found for your account");
      return false;
    }
    if (!address) {
      setValidationError("Please connect your wallet");
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const tx = writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "makePayment",
        args: [
          ethers.getAddress(address ?? "0x"),
          ethers.toBigInt(pendingCallId.toString())
        ],
        value: ethers.parseEther(ethAmount || "0"),
      });
    } catch (err: any) {
      let errorMessage = "An unexpected error occurred.";
      
      if (err.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient balance to complete the transaction.";
      } else if (err.message?.includes("gas required exceeds allowance")) {
        errorMessage = "Transaction would fail. Please check gas settings.";
      } else if (err.message?.includes("nonce has already been used")) {
        errorMessage = "Transaction already submitted. Please wait for confirmation.";
      } else if (err.message?.includes("execution reverted")) {
        errorMessage = "Transaction failed. You may not be eligible for this capital call.";
      }
      
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (status === "error") {
      toast.error("An error occurred while processing the transaction.");
    } else if (isConfirmed) {
      toast.success(
        <div>
          <strong>{`Deposited ${ethAmount} ETH successfully!`}</strong>
          <br />
          <a
            href={`https://sepolia.etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'black', textDecoration: 'underline' }}
          >
            View transaction on Etherscan
          </a>
        </div>
      );
    }

    if (error) {
      const errorMessage = error.message.includes("User denied transaction signature")
        ? "Transaction was rejected by the user."
        : "An error occurred during the transaction.";
      toast.error(errorMessage);
    }
  }, [isConfirmed, error, status]);

  return (
    <div className={`serviceBox ${className}`}>
      <div className="relative overflow-hidden rounded-t-lg p-4 pb-0 flex items-center">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold">Make Deposit</h2>
        </div>
      </div>
      <div className="p-4">
        {validationError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {validationError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block">Amount (ETH)</label>
            <input
              type="number"
              value={ethAmount}
              onChange={(e) => setEthAmount(e.target.value)}
              className="border p-2 w-full bg-[var(--secondary-bg)] border-[var(--border-color)]"
              placeholder='0.00'
              min="0"
              step="0.001"
            />
          </div>
          <div className="mb-2">
            <label className="block">≈ {(parseFloat(ethAmount) * Number(ethUsdRate)).toFixed(2)} USD</label>
          </div>
          <button
            className={
              isConfirming || Number(ethAmount) == 0 ?
                "ctaButtonDisabled p-2" :
                "ctaButton p-2 text-[var(--button-text-color)]"}
            disabled={isConfirming || Number(ethAmount) == 0}>
            {isConfirming ? "Processing..." : "Deposit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
