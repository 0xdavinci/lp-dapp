"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ReactPaginate from 'react-paginate';
import { format } from 'date-fns';
import { useAccount } from 'wagmi';
import { formatNumber } from '../utils/types';
import useCallSchedule from '../hooks/useCallSchedule';

interface CallHistoryProps {
  className?: string;
}

const CallHistory: React.FC<CallHistoryProps> = ({ className }) => {
  const { address } = useAccount();

  const { callSchedules: displaySchedules, loading } = useCallSchedule(address || "0x");

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const pageCount = Math.ceil(displaySchedules.length / itemsPerPage);
  const paginatedSchedules = displaySchedules.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
   );

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'text-[#d68122] bg-[#483b2f]';
      case 'completed':
        return 'text-[#02a46f] bg-[#154040]';
      case 'pending':
        return 'text-[#eab866] bg-[#592c04]';
      default:
        return '';
    }
  };

  return (
    <div className={`serviceBox ${className}`}>
      <div className="relative overflow-hidden rounded-t-lg p-4 flex items-center">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Capital Call Schedule</h2>
        </div>
      </div>
      <div className="p-4">
        {loading && <p className="text-center text-[var(--foreground)]">Loading schedules...</p>}
        {!loading && displaySchedules.length === 0 && (
          <p className="text-center text-gray-400">No schedules available.</p>
        )}
        {paginatedSchedules.map((call, index) => (
          <div key={call.id} className={`flex justify-between items-center py-2 ${index !== (paginatedSchedules.length - 1) ? 'border-b border-[var(--border-color)]' : ''}`}>
            <div className="flex items-center">
              {/* <Image
                src="/schedule.png"
                width={48}
                height={48}
                alt="Schedule Icon"
                className='w-[32px] h-[32px] sm:w-[48px] sm:h-[48px]'
              /> */}
              <div className="ml-4">
                <label className="font-bold text-[16px] text-[var(--foreground)]">{formatNumber(call.callAmount)} ETH</label>
                <label className="block block-color">{format(new Date(call.date), "M/d/yyyy HH:mm:ss")}</label>
              </div>
            </div>
            <label className={`px-4 py-2 rounded-full font-bold text-[12px] ${getStatusStyles(call.status)}`}>
              {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
            </label>
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

export default CallHistory;
