"use client";

import React, { useState } from 'react';
import { useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESSES } from '../utils/constants';
import abi from '../utils/contractABI';
import { ethers } from 'ethers';
import { toast } from "react-toastify";
import { useTheme } from '../context/ThemeContext';

const AddNewInvestment: React.FC = () => {
  const { theme } = useTheme();

  const chainId = useChainId(); // Get the current network's chain ID
  const CONTRACT_ADDRESS = CONTRACT_ADDRESSES[chainId || 0];
  const { writeContract, data: hash, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, status } = useWaitForTransactionReceipt({ hash });

  const [investmentName, setInvestmentName] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [expectedReturns, setExpectedReturns] = useState<string>('');
  const [socialImpactMetric, setSocialImpactMetric] = useState<string>('');
  const [expectedSocialImpact, setExpectedSocialImpact] = useState<string>('');

  const handleAddInvestment = async () => {
    try {
      const tx = await writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "withdraw",
        args: [ethers.parseEther(amount || "0"), ethers.getAddress(walletAddress)],
      });

      console.log("Transaction submitted:", tx);
    } catch (err: any) {
      console.error("Transaction failed:", err);
      const errorMessage =
        err.reason || "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };

  async function saveData() {
    const response = await fetch("/api/addInvestment", {
      method: "POST",
      body: JSON.stringify({
        chainId: chainId,
        investmentName,
        walletAddress,
        amount,
        expectedReturns,
        socialImpactMetric,
        expectedSocialImpact,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return false;
    }

    const result = await response.json();

    // Clear form fields
    setInvestmentName("");
    setWalletAddress("");
    setAmount("");
    setExpectedReturns("");
    setSocialImpactMetric("");
    setExpectedSocialImpact("");
  }

  React.useEffect(() => {
    if (isConfirmed) {
      toast.success(
        <div>
          <strong>Transaction confirmed successfully!</strong>
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
      saveData();
    }
  }, [isConfirmed]);

  React.useEffect(() => {
    if (status === 'error') {
      toast.error("An error occurred while processing the transaction.");
    }

    if (error) {
      const errorMessage = error.message.includes("User denied transaction signature")
        ? "Transaction was rejected by the user."
        : "An error occurred during the transaction.";
      toast.error(errorMessage);
    }
  }, [status, error]);

  return (
    <div className="serviceBox w-full mx-auto">
      <div className="relative overflow-auto rounded-t-lg p-4 pb-0 flex items-center">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold">$ Add New Investment</h2>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2">
          <label className="block">Investment Name</label>
          <input
            type="text"
            value={investmentName}
            onChange={(e) => setInvestmentName(e.target.value)}
            className={`border p-2 w-full ${theme === 'dark' ? 'bg-[#101625] border-[#2b4f88]' : 'bg-[var(--secondary-bg)] border-[var(--border-color)]'}`}
            placeholder="Enter investment name"
          />
        </div>
        <div className="mb-2">
          <label className="block">Wallet Address</label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className={`border p-2 w-full ${theme === 'dark' ? 'bg-[#101625] border-[#2b4f88]' : 'bg-[var(--secondary-bg)] border-[var(--border-color)]'}`}
            placeholder="Enter wallet address"
          />
        </div>
        <div className="flex mb-2 space-x-2">
          <div className="flex-1">
            <label className="block">Amount (ETH)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`border p-2 w-full ${theme === 'dark' ? 'bg-[#101625] border-[#2b4f88]' : 'bg-[var(--secondary-bg)] border-[var(--border-color)]'}`}
              placeholder="0"
              min="0"
            />
          </div>
          <div className="flex-1">
            <label className="block">Expected Returns (%)</label>
            <input
              type="number"
              value={expectedReturns}
              onChange={(e) => setExpectedReturns(e.target.value)}
              className={`border p-2 w-full ${theme === 'dark' ? 'bg-[#101625] border-[#2b4f88]' : 'bg-[var(--secondary-bg)] border-[var(--border-color)]'}`}
              placeholder="0"
              min="0"
            />
          </div>
        </div>
        <div className="mb-2">
          <label className="block">Social Impact Metric</label>
          <input
            type="text"
            value={socialImpactMetric}
            onChange={(e) => setSocialImpactMetric(e.target.value)}
            className={`border p-2 w-full ${theme === 'dark' ? 'bg-[#101625] border-[#2b4f88]' : 'bg-[var(--secondary-bg)] border-[var(--border-color)]'}`}
            placeholder="e.g. Carbon reduction, Jobs created"
          />
        </div>
        <div className="mb-4">
          <label className="block">Expected Social Impact</label>
          <input
            type="text"
            value={expectedSocialImpact}
            onChange={(e) => setExpectedSocialImpact(e.target.value)}
            className={`border p-2 w-full ${theme === 'dark' ? 'bg-[#101625] border-[#2b4f88]' : 'bg-[var(--secondary-bg)] border-[var(--border-color)]'}`}
            placeholder="e.g. 1000 tons, 500 jobs"
          />
        </div>
        <button
          onClick={handleAddInvestment}
          className={isConfirming || !ethers.isAddress(walletAddress) || Number(amount) == 0 ?
            "ctaButtonDisabled p-2 w-11/12" :
            "ctaButton p-2 w-11/12"}
          disabled={isConfirming || !ethers.isAddress(walletAddress) || Number(amount) == 0}
        >
          {isConfirming ? "Confirming..." : "Add New Investment"}
        </button>
      </div>
    </div>
  );
};

export default AddNewInvestment;
