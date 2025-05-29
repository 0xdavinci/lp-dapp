"use client";

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image';
import { useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESSES } from '../utils/constants';
import abi from '../utils/contractABI';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';

const SetLP: React.FC = () => {
  const chainId = useChainId(); // Get the current network's chain ID
  const CONTRACT_ADDRESS = CONTRACT_ADDRESSES[chainId || 0];
  const { writeContract, data: hash, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, status } = useWaitForTransactionReceipt({ hash });
  const { theme } = useTheme();

  const [lpName, setLpName] = useState<string>('');
  const [lpAddress, setLpAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [endDate, setDueDate] = useState<Date | null>(null);

  const callSchedule = async () => {
    try {
      const tx = await writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "setCommitment",
        args: [
          lpName,
          ethers.getAddress(lpAddress),
          ethers.parseEther(amount),
          ethers.toBigInt((Math.floor(endDate?.getTime()! / 1000).toString()))],
      });
      console.log("Transaction submitted:", tx);
    } catch (err) {
      console.error("Transaction failed:", err);
    }
  };

  React.useEffect(() => {
    if (status === "error") {
      toast.error("An error occurred while processing the transaction.");
    } else if (isConfirmed) {
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
    }
    if (error) {
      const errorMessage = error.message.includes("User denied transaction signature")
        ? "Transaction was rejected by the user."
        : "An error occurred during the transaction.";
      toast.error(errorMessage);
    }
  }, [isConfirmed, error, status]);

  return (
    <div className="serviceBox h-full relative z-20">
      <div className="relative rounded-t-lg p-4 flex items-center pb-0">
        <div className="flex items-center">
          <Image src={theme === 'dark' ? "/lp.png" : "/lp-light.png"} width={25} height={16} alt="Calendar Icon" className="mr-2" />
          <h2 className="text-2xl font-bold">Set Limited Partner</h2>
        </div>
      </div>
      <div className="p-4">
        <label className="block">Limited Partner Name</label>
        <input
          type="text"
          value={lpName}
          onChange={(e) => setLpName(e.target.value)}
          className={`border p-2 w-full ${theme === 'dark' ? 'bg-[#101625] border-[#2b4f88]' : 'bg-[var(--secondary-bg)] border-[var(--border-color)]'}`}
          placeholder="Enter name"
        />
        <label className="block mt-2">Limited Partner Address</label>
        <input
          type="text"
          value={lpAddress}
          onChange={(e) => setLpAddress(e.target.value)}
          className={`border p-2 w-full ${theme === 'dark' ? 'bg-[#101625] border-[#2b4f88]' : 'bg-[var(--secondary-bg)] border-[var(--border-color)]'}`}
          placeholder="Enter wallet address"
        />
        <div className='flex mt-2'>
          <div className="mb-2 w-1/2 pr-2">
            <label className="block">Commitment Amount (ETH)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`border p-2 w-full ${theme === 'dark' ? 'bg-[#101625] border-[#2b4f88]' : 'bg-[var(--secondary-bg)] border-[var(--border-color)]'}`}
              placeholder="0"
              min="0"
            />
          </div>
          <div className="mb-2 w-1/2 pr-2 lg:ml-10 md:ml-10 mt-auto">
            <label className="block">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setDueDate(date)}
              dateFormat="yyyy-MM-dd"
              className={`border p-2 w-full ${theme === 'dark' ? 'bg-[#101625] border-[#2b4f88]' : 'bg-[var(--secondary-bg)] border-[var(--border-color)]'}`}
              placeholderText="Select a date"
            />
          </div>
        </div>
        <button
          onClick={callSchedule}
          className={isConfirming || lpName.trim() === '' || !ethers.isAddress(lpAddress) || Number(amount) == 0 || Number(endDate) == 0 ?
            "ctaButtonDisabled text-[var(--foreground)] p-2 w-11/12 mt-2"
            : "ctaButton text-[var(--foreground)] p-2 w-11/12 mt-2"}
          disabled={isConfirming || lpName.trim() === '' || !ethers.isAddress(lpAddress) || Number(amount) == 0 || Number(endDate) == 0}
        >
          {(isConfirming) ? "Confirming..." : "Set New LP"}
        </button>
      </div>
    </div>
  );
};

export default SetLP;
