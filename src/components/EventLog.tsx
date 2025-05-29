"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ReactPaginate from 'react-paginate';
import usePaymentAndWithdrawalEvents from '../hooks/useEvent';
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
  const [provider, setProvider] = useState<ethers.WebSocketProvider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

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
          amount: ethers.formatEther(parsedLog.args[1] as BigNumberish),
        };
      }
    } catch (error) {
      console.error("Error decoding log:", error);
      setError("Failed to decode transaction log. Please try refreshing the page.");
    }
    return false;
  };

  // Cleanup function for network changes
  const cleanup = () => {
    if (provider) {
      provider.removeAllListeners();
      setIsWebSocketConnected(false);
    }
    setDecodedLogs([]);
    setCurrentPage(0);
    setError(null);
  };

  // Initialize WebSocket provider and subscribe to events
  useEffect(() => {
    cleanup();

    try {
      const newProvider = new ethers.WebSocketProvider(WSS_CHAINSTACK_URL[chainId || 0]);
      setProvider(newProvider);

      // Handle WebSocket connection
      newProvider.on("connect", () => {
        setIsWebSocketConnected(true);
        setError(null);
      });

      newProvider.on("error", (error) => {
        setIsWebSocketConnected(false);
        setError(`WebSocket connection error: ${error.message}`);
      });

      // Subscribe to logs
      newProvider.on({
        address: CONTRACT_ADDRESS
      }, async (log) => {
        const newCallLog = decodeLog(log);
        if(newCallLog) {
          setDecodedLogs(prev => [...prev, newCallLog]);
        }
      });

      return () => {
        newProvider.removeAllListeners();
      };
    } catch (error) {
      setError(`Failed to initialize WebSocket connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsWebSocketConnected(false);
    }
  }, [chainId, CONTRACT_ADDRESS]);

  useEffect(() => {
    const reversedEvents = [...events, ...decodedLogs].reverse();
    const displayedEvents = reversedEvents.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );
    setDisplayedEvents(displayedEvents);
  }, [events, currentPage, decodedLogs, chainId, itemsPerPage]);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return (
    <div className={`serviceBox ${className}`}>
      <div className="relative overflow-hidden rounded-t-lg p-4 flex items-center">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Transaction History</h2>
        </div>
      </div>
      <div className="p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {!isWebSocketConnected && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            Connecting to network...
          </div>
        )}
        {loading && <p className="text-center text-[var(--foreground)]">Loading events...</p>}
        {!loading && events.length === 0 && !error && (
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
          previousLabel={'🞀'}
          nextLabel={'🞂'}
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
