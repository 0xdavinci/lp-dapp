"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ReactPaginate from 'react-paginate';
import usePaymentAndWithdrawalEvents from '../hooks/usePaymentEvent';
import { useAccount, useChainId } from 'wagmi';
import BlockDate from './BlockDate';
import { BigNumberish, ethers } from 'ethers';
import abi from "../utils/contractABI";
import { CASHCALL_TOPIC, CONTRACT_ADDRESSES, WSS_CHAINSTACK_URL } from '../utils/constants';

interface EventLogProps {
  className?: string;
}

const EventLog: React.FC<EventLogProps> = ({ className }) => {
  const { address } = useAccount();
  const chainId = useChainId(); // Get the current network's chain ID
  const CONTRACT_ADDRESS = CONTRACT_ADDRESSES[chainId || 0];
  const iface = new ethers.Interface(abi);
  const { events, loading } = usePaymentAndWithdrawalEvents(address || "0x");
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedEvents, setDisplayedEvents] = useState<Array<any>>([]);

  const [decodedLogs, setDecodedLogs] = useState<Array<any>>([]);

  const itemsPerPage = 5;
  const pageCount = Math.ceil(events.length / itemsPerPage);

  const decodeLog = (log: ethers.Log) => {
    try {
      const parsedLog = iface.parseLog(log);

      console.log(parsedLog?.name);

      if (parsedLog?.name == "PaymentMade") {

        return {
          type: "deposit",
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          lp: parsedLog.args[0] as string,
          amount: ethers.formatEther(parsedLog.args[2] as BigNumberish),
        };
      }
    } catch (error) {
      console.error("Error decoding log:", error);
    }
    return false;
  };

  useEffect(() => {
    const reversedEvents = [...events, ...decodedLogs].reverse();

    const displayedEvents = reversedEvents.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );

    setDisplayedEvents(displayedEvents);
  }, [events, currentPage, decodedLogs, chainId])

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    // Initialize WebSocketProvider
    const provider = new ethers.WebSocketProvider(WSS_CHAINSTACK_URL[chainId || 0]);

    // Define filter for logs
    const filter = {
      address: CONTRACT_ADDRESS,
      topics: [CASHCALL_TOPIC],
    };

    // Subscribe to logs
    provider.on({
      address: CONTRACT_ADDRESS
    }, async (log) => {
      const newCallLog = decodeLog(log);

      console.log('newCallLog', newCallLog);

      if (newCallLog) {
        setDecodedLogs(prev => [...prev, newCallLog]);
      }
    });
  }, [chainId]);

  return (
    <div className={`serviceBox ${className}`}>
      <div className="relative overflow-hidden rounded-t-lg p-4 flex items-center">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Transaction History</h2>
        </div>
      </div>
      <div className="p-4">
        {loading && <p className="text-center text-[var(--foreground)]">Loading events...</p>}
        {!loading && events.length === 0 && (
          <p className="text-center text-gray-400">No transactions found.</p>
        )}
        {displayedEvents.map((transaction, index) => (
          <div key={`tx-history-${index}`} className={`flex justify-between items-center py-2 ${index !== (displayedEvents?.length - 1) ? "border-b border-[var(--border-color)]" : ""}`}>
            <div className="flex items-center">
              <Image
                src={transaction.type === 'deposit' ? '/deposit.png' : '/withdrawal.png'}
                width={48}
                height={48}
                alt={transaction.type}
                className='w-[32px] h-[32px] sm:w-[48px] sm:h-[48px]'
              />
              <div className="ml-4">
                <label className="font-bold text-[16px] text-[var(--foreground)]">{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</label>
                <label className="block block-color"><BlockDate blockNumber={transaction.blockNumber} /></label>
              </div>
            </div>
            <label className="text-right font-bold text-[var(--foreground)]">{transaction.amount} ETH</label>
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

export default EventLog;
