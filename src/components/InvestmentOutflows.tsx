"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ReactPaginate from "react-paginate";
import { useAccount, useChainId } from "wagmi";

interface InvestmentOutflowsProps {
  className?: string;
}

const InvestmentOutflows: React.FC<InvestmentOutflowsProps> = ({
  className,
}) => {
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const [investments, setInvestments] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;
  const pageCount = Math.ceil(investments.length / itemsPerPage);

  // Reset state when network changes
  useEffect(() => {
    setInvestments([]);
    setCurrentPage(0);
    setError(null);
  }, [chainId]);

  // Fetch investment data
  const fetchInvestments = async () => {
    if (!isConnected) return;

    setIsLoading(true);
    setError(null);
    try {
      const fetchWithRetry = async (
        url: string,
        options: RequestInit,
        retries: number
      ): Promise<Response> => {
        for (let i = 0; i < retries; i++) {
          try {
            const response = await fetch(url, options);
            if (!response.ok) {
              throw new Error(`Failed to fetch: ${response.statusText}`);
            }
            return response;
          } catch (error) {
            if (i === retries - 1) {
              throw error;
            }
            console.warn(`Retrying fetch... (${i + 1}/${retries})`);
            await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
          }
        }
        throw new Error("Max retries reached");
      };

      const response = await fetchWithRetry(
        `/api/get-investments?chainId=${chainId}`,
        {},
        3
      );
      if (!response.ok) {
        throw new Error("Failed to fetch investments");
      }

      const data = await response.json();

      // Log the raw data for debugging
      console.log("Raw investment data:", data);

      // Validate data structure
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format");
      }

      const sortedData = data.sort((a: any, b: any) => {
        try {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        } catch (error) {
          console.error("Error sorting dates:", error);
          return 0;
        }
      });

      // Validate and transform required fields
      const validData = sortedData.filter((item) => {
        try {
          // Transform expected_returns to number if it's a string
          const expectedReturns =
            typeof item.expected_returns === "string"
              ? parseFloat(item.expected_returns)
              : item.expected_returns;

          const isValid =
            item &&
            typeof item.investment_name === "string" &&
            typeof item.amount === "string" &&
            !isNaN(expectedReturns) && // Check if it's a valid number
            typeof item.social_impact_metric === "string" &&
            // typeof item.expected_social_impact === 'string' &&
            // typeof item.units === 'string';
            typeof item.expected_social_impact === "string";

          if (!isValid) {
            console.warn("Invalid investment data:", {
              item,
              expectedReturns,
              expectedReturnsType: typeof item.expected_returns,
            });
          }
          return isValid;
        } catch (error) {
          console.error("Error validating item:", error);
          return false;
        }
      });

      console.log("Validated investment data:", validData);
      setInvestments(validData);
    } catch (error: any) {
      console.error("Error fetching investments:", error);
      setError(
        error.message ||
          "Failed to fetch investment data. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch investments when the component mounts or network changes
  useEffect(() => {
    if (isConnected) {
      console.log("Fetching investments for chainId:", chainId);
      fetchInvestments();
    }
  }, [chainId, isConnected]);

  const displayedOutflows = investments.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  function convertDate(dateString: string): string {
    // Parse the input date string into a JavaScript Date object
    const date = new Date(dateString);

    // Adjust for timezone offset if needed
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

    // Format the date components
    const month = date.getMonth() + 1; // Months are zero-indexed
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Return the formatted string
    return `${month}/${day}/${year} ${hours}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return (
    <div className={`serviceBox ${className}`}>
      <div className="relative overflow-hidden rounded-t-lg p-4 flex items-center">
        <div className="flex items-center">
          <Image
            src="/investment.png"
            width={16}
            height={16}
            alt="Investment Icon"
            className="mr-2"
          />
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            Investment Outflows
          </h2>
        </div>
      </div>
      <div className="p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {isLoading && (
          <div className="text-center text-[var(--foreground)]">
            Loading investments...
          </div>
        )}
        {!isLoading && !error && displayedOutflows.length === 0 && (
          <p className="text-center text-gray-400">
            No investment outflows found.
          </p>
        )}
        {displayedOutflows.map((outflow, index) => (
          <div
            key={outflow.id}
            className={`flex flex-col py-2 ${
              index !== displayedOutflows.length - 1
                ? "border-b border-[#2b4f88]"
                : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <label className="font-bold text-[16px] text-[var(--foreground)]">
                  {outflow.investment_name}
                </label>
                <label className="block block-color">
                  {convertDate(outflow.created_at)}
                </label>
              </div>
              <div className="text-right flex flex-col">
                <label className="font-bold text-[var(--foreground)]">
                  {outflow.amount} ETH
                </label>
                <label className="text-[#02a46f] text-[14px]">
                  Expected: {outflow.expected_returns}%
                </label>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <Image
                src="/social-impact-orange.png"
                width={16}
                height={16}
                alt="Social Impact Icon"
                className="mr-2"
              />
              <label className="text-[#d68122] text-[14px]">
                {outflow.social_impact_metric}: {outflow.expected_social_impact}{" "}
                {outflow.units}
              </label>
            </div>
          </div>
        ))}
        <ReactPaginate
          previousLabel={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M11.354 1.354a.5.5 0 0 1 0 .707L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
              />
            </svg>
          }
          nextLabel={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M4.646 14.354a.5.5 0 0 1 0-.708L10.293 8 4.646 2.354a.5.5 0 0 1 .708-.708l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708 0z"
              />
            </svg>
          }
          breakLabel={"..."}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"flex justify-center space-x-2 mt-4"}
          activeClassName={"currentPaginationButton"}
          pageClassName={"paginationButton"}
          previousClassName={"paginationButton"}
          nextClassName={"paginationButton"}
          disabledClassName={"paginationButton disabled:opacity-50"}
          breakClassName={"paginationButton"}
          renderOnZeroPageCount={() => null}
          pageRangeDisplayed={1}
          marginPagesDisplayed={1}
        />
      </div>
    </div>
  );
};

export default InvestmentOutflows;
