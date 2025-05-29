"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { socialImpactMetrics } from '../data/exampleData';
import ReactPaginate from 'react-paginate';

const SocialImpactMetrics: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const pageCount = Math.ceil(socialImpactMetrics.length / itemsPerPage);

  const displayedMetrics = socialImpactMetrics.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="p-4 max-w-[640px] mx-auto">
      <div className="serviceBox">
        <div className="relative overflow-hidden rounded-t-lg p-4 flex items-center">
          <div className="flex items-center">
            <Image src="/social-impact.png" width={16} height={16} alt="Social Impact Icon" className="mr-2" />
            <h2 className="text-2xl font-bold text-white">Social Impact Metrics</h2>
          </div>
        </div>
        <div className="p-4">
          {displayedMetrics.map((metric, index) => (
            <div key={index} className={`flex flex-col py-2 ${index < displayedMetrics.length - 1 ? 'border-b border-[#2b4f88]' : ''}`}>
              <div className="flex justify-between items-center">
                <label className="font-bold text-[16px] text-[#fefefe]">{metric.socialImpactMetric}</label>
                <div className="flex items-center">
                  <Image src="/completed.png" width={16} height={16} alt="Completed Icon" className="mr-2" />
                  <label className="text-[#d68122] text-[14px]">{metric.completionPercentage}%</label>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <div className='min-w-[120px]'>
                  <label className="block block-color">Expected</label>
                  <label className="text-[#fefefe] text-[16px]">{metric.expectedSocialImpactNumber} {metric.units}</label>
                </div>
                <div className='min-w-[120px]'>
                  <label className="block block-color">Achieved</label>
                  <label className="text-[#fefefe] text-[16px]">{(metric.expectedSocialImpactNumber * (metric.completionPercentage / 100)).toFixed(2)} {metric.units}</label>
                </div>
                <div />
              </div>
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
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={'flex justify-center space-x-2 mt-4'}
            activeClassName={'currentPaginationButton'}
            pageClassName={'paginationButton'}
            previousClassName={'paginationButton'}
            nextClassName={'paginationButton'}
            disabledClassName={'paginationButton disabled:opacity-50'}
            breakClassName={'paginationButton'}
          />
        </div>
      </div>
    </div>
  );
};

export default SocialImpactMetrics;
