"use client";

import React, { useState } from 'react';
import AccountDetails from './AccountDetails';
import CallHistory from './CallHistory';
import PaymentForm from './PaymentForm';
import EventLog from './PaymentEventLog';
import { useAccount } from 'wagmi';

const Dashboard: React.FC = () => {
  const { isConnected } = useAccount();

  const [refreshPage, setRefreshPage] = useState(false);

  return (
    isConnected ? (
      <div className="p-4">
        {/* Audit Badge */}
        <div className="flex justify-center mb-8">
          <a
            href="/audit/Audit_report.pdf" // Replace with your audit company's link
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 group"
          >
            <img
              src="/audit-badge.png" // Replace with your audit badge image URL
              alt="Audit Badge"
              className="w-16 h-16 lg:w-20 lg:h-20 cursor-pointer transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-sm lg:text-base font-semibold text-[var(--foreground)]">
              Audited by [Audit Company] {/* Replace with your audit company's name */}
            </span>
          </a>
        </div>

        <div className="flex flex-col lg:flex-row justify-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="w-full">
            <AccountDetails className="h-full" refreshPage={refreshPage} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-center space-y-4 lg:space-y-0 lg:space-x-4 mt-4">
          <div className="w-full lg:w-1/2 flex flex-col">
            <EventLog className="" />
            <CallHistory className="" />
          </div>
          <div className="w-full lg:w-1/2">
            <PaymentForm className="" setRefreshPage={setRefreshPage} />
          </div>
        </div>
      </div>
    ) : (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl font-bold text-[var(--foreground)]">Connecting to your account...</p>
      </div>
    )
  );
};

export default Dashboard;
