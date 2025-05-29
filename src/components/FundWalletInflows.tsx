"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { fundWalletInflows } from '../data/exampleData';
import ReactPaginate from 'react-paginate';
import { format } from 'date-fns';
import { useTheme } from '../context/ThemeContext';
import { useFetchInflowEvents } from '../hooks/useInflowData';
import { useContract } from '../hooks/useContract';
import BlockDate from './BlockDate';
import { useWalletClient } from 'wagmi';

interface FundWalletInflowsProps {
  className?: string;
}

interface InflowData {
  type: string;
  name: string;
  ethAmount: string;
  blockNumber: number;
}

const FundWalletInflows: React.FC<FundWalletInflowsProps> = ({ className }) => {
  const [inflowData, setInflowData] = useState<InflowData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const pageCount = Math.ceil(inflowData.length / itemsPerPage);
  const { theme } = useTheme();

  const { data: walletClient } = useWalletClient();

  const { fetchInflowEvents } = useFetchInflowEvents();

  // Fetch inflow events
  useEffect(() => {
    const loadInflowData = async () => {
      try {
        const events = await fetchInflowEvents();

        const formattedEvents = events.map((event) => ({
          type: event.type,
          name: event.name,
          ethAmount: event.amount, // Ensure it's parsed as a float
          blockNumber: event.blockNumber, // Convert block timestamp to ISO string
        }))
          .sort((a, b) => b.blockNumber - a.blockNumber);

        setInflowData(formattedEvents);
      } catch (error) {
        console.error("Error fetching inflow events:", error);
      }
    };

    if (walletClient)
      loadInflowData();
  }, [walletClient]);

  // console.log("inflowdata", fetchInflowEvents())
  const displayedInflows = inflowData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'deposit':
        return '/deposit.png';
      case 'investment':
        return '/investment.png';
      default:
        return '';
    }
  };

  return (
    <div className={`serviceBox ${className}`}>
      <div className="relative overflow-hidden rounded-t-lg p-4 flex items-center">
        <div className="flex items-center">
          <Image src={theme === 'dark' ? "/fund.png" : "/fund-light.png"} width={16} height={16} alt="Fund Icon" className="mr-2" />
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Fund Wallet Inflows</h2>
        </div>
      </div>
      <div className="p-4">
        {displayedInflows.map((inflow, index) => (
          <div className={`flex justify-between items-center py-2 ${index !== (displayedInflows?.length - 1) ? 'border-b border-[#2b4f88]' : ''}`} key={`inflow-list-${index}`}>
            <div className="flex items-center">
              <Image
                src={getTypeIcon(inflow.type)}
                width={48}
                height={48}
                alt={inflow.type}
              />
              <div className="ml-4">
                <label className="font-bold text-[16px] text-[var(--foreground)]">{inflow.name}</label>
                <label className="block block-color"><BlockDate blockNumber={inflow.blockNumber} /></label>
              </div>
            </div>
            <label className="text-right font-bold text-[var(--foreground)]">{inflow.ethAmount} ETH</label>
          </div>
        ))}
        <ReactPaginate
          previousLabel={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M11.354 1.354a.5.5 0 0 1 0 .707L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
            </svg>
          }
          nextLabel={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M4.646 14.354a.5.5 0 0 1 0-.708L10.293 8 4.646 2.354a.5.5 0 0 1 .708-.708l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708 0z" />
            </svg>
          }
          breakLabel={"..."}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={'flex justify-center space-x-2 mt-4'}
          activeClassName={'currentPaginationButton'}
          pageClassName={'paginationButton'}
          previousClassName={'paginationButton'}
          nextClassName={'paginationButton'}
          disabledClassName={'paginationButton disabled:opacity-50'}
          breakClassName={'paginationButton'}
          renderOnZeroPageCount={() => null}
          pageRangeDisplayed={1}
          marginPagesDisplayed={1}
        />
      </div>
    </div>
  );
};

export default FundWalletInflows;
