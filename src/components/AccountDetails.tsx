"use client";

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useAccount } from 'wagmi';
import useLPData from '../hooks/useLPData';
import { formatNumber } from '../utils/types';
import useCallSchedule from '../hooks/useCallSchedule';

interface AccountDetailsProps {
  className?: string;
  refreshPage?: Boolean
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ className, refreshPage }) => {
  const { address } = useAccount();
  const { Data, loading, callSchedule, fetchLPData } = useLPData(address || "0x");
  const { pendingCapitalCall: pendingCapitalCall } = useCallSchedule(address || "0x");

  useEffect(() => {
    fetchLPData();
  }, [refreshPage]);

  return (
    <div className={`${className} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`}>
      <div className="serviceBox">
        <div className="p-4">
          <label className="block">Total Commitment</label>
          <p className="text-[24px]">{!loading ? formatNumber(Data?.totalCommitmentInETH) : ` - `} ETH</p>
          <label className="block-color block">End Time: {!loading ? format((Data?.commitmentEndTime || 0) * 1000, "MM/dd/yy") : ` - `}</label>
        </div>
      </div>
      <div className="serviceBox">
        <div className="p-4">
          <label className="block">Deposited to Date</label>
          <p className="text-[24px]">{!loading ? formatNumber(Data?.depositedToDateInETH) : ` - `} ETH</p>
          <label className="block-color block">{!loading ? Intl.NumberFormat('en-US', { maximumFractionDigits: 3 }).format(Data?.depositedPercentage ?? 0) : ` - `}% of total commitment</label>
        </div>
      </div>
      <div className="serviceBox">
        <div className="p-4">
          <label className="block">Remaining Commitment</label>
          <p className="text-[24px]">{!loading ? formatNumber(Data?.remainingCommitmentInETH) : ` - `} ETH</p>
          <label className="block-color block">{!loading ? Intl.NumberFormat('en-US', { maximumFractionDigits: 3 }).format(Data?.remainingPercentage ?? 0) : ` - `}% remaining</label>
        </div>
      </div>
      <div className="serviceBox">
        <div className="p-4">
          <label className="block">Next Capital Call</label>
          <p className="text-[24px]">{!loading ? formatNumber(pendingCapitalCall?.callAmount) : ` - `} ETH</p>
          <label className="block-color block">Due {!loading ? format((pendingCapitalCall?.date || 0), "MM/dd/yy") : ` - `}</label>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
