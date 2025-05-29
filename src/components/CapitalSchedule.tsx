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

const CapitalSchedule: React.FC = () => {
  const chainId = useChainId(); // Get the current network's chain ID
  const CONTRACT_ADDRESS = CONTRACT_ADDRESSES[chainId || 0];
  const { writeContract, data: hash, status, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const { theme } = useTheme();

  const [lpAddress, setLpAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const callSchedule = async () => {
    try {
      const tx = await writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "createCashCall",
        args: [
          ethers.getAddress(lpAddress),
          ethers.parseEther(amount),
          ethers.toBigInt((Math.floor(dueDate?.getTime()! / 1000).toString()))],
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
    <div className="serviceBox w-full mx-auto h-full relative z-10">
      <div className="relative rounded-t-lg p-4 flex items-center">
        <div className="flex items-center">
          <Image src={theme === 'dark' ? "/calendar.png" : "/calendar-light.png"} width={16} height={16} alt="Calendar Icon" className="mr-2" />
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Capital Schedule</h2>
        </div>
      </div>
      <div className="p-4">
        <label className="block">Wallet Address</label>
        <input
          type="text"
          value={lpAddress}
          onChange={(e) => setLpAddress(e.target.value)}
          className={`border p-2 w-full ${theme === 'dark' ? 'bg-[#101625] border-[#2b4f88]' : 'bg-[var(--secondary-bg)] border-[var(--border-color)]'}`}
          placeholder="Enter wallet address"
        />
        <div className='flex mt-2'>
          <div className="mb-2 w-1/2 pr-2">
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
          <div className="mb-2 w-1/2 pr-2 lg:ml-10 md:ml-10">
            <label className="block">Due Date</label>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              dateFormat="yyyy-MM-dd"
              className={`border p-2 w-full ${theme === 'dark' ? 'bg-[#101625] border-[#2b4f88]' : 'bg-[var(--secondary-bg)] border-[var(--border-color)]'}`}
              placeholderText="Select a date"
            />
          </div>
        </div>
        <button
          onClick={callSchedule}
          className={isConfirming || !ethers.isAddress(lpAddress) || Number(amount) == 0 || Number(dueDate) == 0 ?
            "ctaButtonDisabled text-[var(--foreground)] p-2 w-11/12 mt-2"
            : "ctaButton text-[var(--foreground)] p-2 w-11/12 mt-2"}
          disabled={isConfirming || !ethers.isAddress(lpAddress) || Number(amount) == 0 || Number(dueDate) == 0}
        >
          {(isConfirming) ? "Confirming..." : "Schedule Capital Call"}
        </button>
      </div>
    </div>
  );
};

export default CapitalSchedule;
