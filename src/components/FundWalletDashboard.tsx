"use client";

import React, { useEffect } from 'react';
import FundWalletInflows from './FundWalletInflows';
import InvestmentOutflows from './InvestmentOutflows';
import { useContract } from '../hooks/useContract';
import { useWalletClient } from 'wagmi';
import { CONTRACT_ADDRESSES } from '../utils/constants';
import PocketTokenAccess from './PocketTokenAccess';

const FundWalletDashboard: React.FC = () => {
  const { data: walletClient } = useWalletClient();
  const { contractBalance, getContract } = useContract();
  const { chainId } = useContract();
  const CONTRACT_ADDRESS = CONTRACT_ADDRESSES[chainId || 0];

  useEffect(() => {
    if (walletClient)
      getContract();
  }, [walletClient, chainId]);

  return (
    <PocketTokenAccess>
      <div className="p-4">
        <div className="flex justify-center items-center mb-4">
          <div className="serviceBoxBalance">
            <div className="p-4">
              <label className="block">FundWallet Balance</label>
              <p className="text-[24px]">{contractBalance} ETH</p>
              <a
                href={`https://${chainId === 1 ? "etherscan.io" : "sepolia.etherscan.io"}/address/${CONTRACT_ADDRESS}`} // Etherscan link for the address
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm lg:text-base mt-2"
              >
                {CONTRACT_ADDRESS}
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="w-full lg:w-1/2 flex flex-col">
            <FundWalletInflows />
          </div>
          <div className="w-full lg:w-1/2">
            <InvestmentOutflows />
          </div>
        </div>
      </div>
    </PocketTokenAccess>
  );
};

export default FundWalletDashboard;