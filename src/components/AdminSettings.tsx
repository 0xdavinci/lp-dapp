"use client";

import React, { useState } from 'react';
import { CONTRACT_ADDRESSES } from '../utils/constants';
import { useChainId, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import abi from '../utils/contractABI';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import Image from 'next/image';
import useAdmins from '../hooks/useAdmins';

const AdminSettings: React.FC = () => {
  const { admins, defaultAdmin } = useAdmins();
  const { address, isConnected } = useAccount();

  const chainId = useChainId(); // Get the current network's chain ID
  const CONTRACT_ADDRESS = CONTRACT_ADDRESSES[chainId || 0];
  const { writeContract, data: hash, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, status } = useWaitForTransactionReceipt({ hash });

  const { theme } = useTheme();

  const [minCommitment, setMinCommitment] = useState<string>('');
  const [adminToAdd, setAdminToAdd] = useState<string>('');
  const [adminToRemove, setAdminToRemove] = useState<string>('');
  const [txType, setTxType] = useState<string>('addAdmin');

  const addAdmin = async () => {
    setTxType('addAdmin');
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "addAdmin",
        args: [ethers.getAddress(adminToAdd)],
      });
    } catch (err) {
      const errorMessage = (err as any).reason || "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };

  const removeAdmin = async () => {
    setTxType('removeAdmin');
    try {
      if (adminToRemove === defaultAdmin) {
        toast.error("Default admin cannot be removed.");
        return;
      }
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "removeAdmin",
        args: [ethers.getAddress(adminToRemove)],
      });
    } catch (err) {
      const errorMessage = (err as any).reason || "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };

  const minCommitmentUpdate = async () => {
    setTxType('minCommitmentUpdate');
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "setMinCommitmentAmountUSD",
        args: [ethers.parseEther(minCommitment || "0")],
      });
    } catch (err) {
      const errorMessage = (err as any).reason || "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
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
    <div className="serviceBox h-full">
      <div className={`relative overflow-hidden rounded-t-lg p-4 pb-0 flex items-center ${theme === 'dark' ? 'bg-[#1a2433]' : 'bg-[#ffffff]'}`}>
        <div className="flex items-center">
          <Image src={theme === 'dark' ? "/admin-setting.png" : "/admin-setting-light.png"} width={25} height={16} alt="Admin Icon" className="mr-2" />
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Admin Settings</h2>
        </div>
      </div>
      <div className="p-4">
        <label className="text-[var(--foreground)]">Minimum Commitment (USD)</label>
        <div className="flex items-center flex-col gap-2 sm:flex-row">
          <input
            type="number"
            value={minCommitment}
            onChange={(e) => setMinCommitment(e.target.value)}
            className={`flex-1 border p-2 w-full ${theme === 'dark' ? 'bg-[#101625] border-[#2b4f88]' : 'bg-[var(--secondary-bg)] border-[var(--border-color)]'}`}
            placeholder="0"
            min="0"
          />
          <button
            onClick={minCommitmentUpdate}
            className={`lg:ml-2 ${
              (txType === 'minCommitmentUpdate' && isConfirming) || Number(minCommitment) === 0 
                ? "ctaButtonDisabled" 
                : "ctaButton"
            } text-[var(--foreground)] p-2 w-11/12 sm:w-fit`}
            disabled={(txType === 'minCommitmentUpdate' && isConfirming) || Number(minCommitment) === 0}
          >
            {txType === 'minCommitmentUpdate' && isConfirming ? "Updating..." : "Update"}
          </button>
        </div>
        {address === defaultAdmin && (
          <div className='mt-4'>
            <label className="text-[var(--foreground)]">Add New Admin</label>
            <div className="flex items-center flex-col gap-2 sm:flex-row mb-4">
              <input
                type="text"
                value={adminToAdd}
                onChange={(e) => setAdminToAdd(e.target.value)}
                className={`border p-2 w-full ${theme === 'dark' ? 'bg-[#101625] border-[#2b4f88]' : 'bg-[var(--secondary-bg)] border-[var(--border-color)]'}`}
                placeholder="Enter wallet address"
              />
              <button
                onClick={addAdmin}
                className={`lg:ml-2 ${
                  (txType === 'addAdmin' && isConfirming) || !ethers.isAddress(adminToAdd) 
                    ? "ctaButtonDisabled" 
                    : "ctaButton"
                } text-[var(--foreground)] p-2 w-11/12 sm:w-fit`}
                disabled={(txType === 'addAdmin' && isConfirming) || !ethers.isAddress(adminToAdd)}
              >
                {txType === 'addAdmin' && isConfirming ? "Confirming..." : "Add"}
              </button>
            </div>
            <label className="text-[var(--foreground)]">Remove Admin</label>
            <div className="flex items-center flex-col gap-2 sm:flex-row mb-4">
              <select
                value={adminToRemove}
                onChange={(e) => setAdminToRemove(e.target.value)}
                className={`border p-2 w-full ${theme === 'dark' ? 'bg-[#101625] border-[#2b4f88]' : 'bg-[var(--secondary-bg)] border-[var(--border-color)]'}`}
              >
                <option value="" style={{ color: "#8293aa" }}>
                  Select admin to remove
                </option>
                {admins?.map((admin: string) => (
                  <option key={admin} value={admin}>
                    {admin === defaultAdmin? `${admin} (Default Admin)` : admin}
                  </option>
                ))}
              </select>
              <button
                onClick={removeAdmin}
                className={`lg:ml-2 ${
                  (txType === 'removeAdmin' && isConfirming) || !ethers.isAddress(adminToRemove) 
                    ? "ctaButtonDisabled" 
                    : "ctaButton"
                } text-[var(--foreground)] p-2 w-11/12 sm:w-fit`}
                disabled={(txType === 'removeAdmin' && isConfirming) || !ethers.isAddress(adminToRemove)}
              >
                {txType === 'removeAdmin' && isConfirming ? "Confirming..." : "Remove"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
