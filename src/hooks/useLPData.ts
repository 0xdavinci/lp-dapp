import { useState, useEffect } from "react";
import { useContract } from "./useContract";  // Use your previously created hook for contract interaction
import { ethers } from "ethers";
import { LPData, toFixed } from "../utils/types";

const useLPData = (lpAddress: string) => {
  const { getContract } = useContract();
  const [Data, setData] = useState<LPData | null>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [ethUsdRate, setEthUsdRate] = useState<string>();
  const [callSchedule, setCallSchedule] = useState<string>();

  const fetchLPData = async () => {
    setLoading(true);
    try {
      const contract = await getContract();

      if (!contract) {
        return false;
      }
      // Fetch data from the contract
      const ETHUSDRateBignumber = await contract.getETHUSDCExchangeRate();
      const ETHUSDRate = ethers.formatEther(ETHUSDRateBignumber);
      setEthUsdRate(ETHUSDRate);

      const callSchedule = await contract.getCashCalls(lpAddress);
      setCallSchedule(callSchedule);

      const lpData = await contract.lpData(lpAddress);

      // Calculate additional derived data
      const totalCommitment = Number(lpData.commitmentAmount);
      const depositedToDate = Number(lpData.totalPaid);
      const commitmentEndTime = Number(lpData.endTime);
      const totalCommitmentInETH = ethers.formatEther(toFixed(totalCommitment).toString());
      const depositedToDateInETH = ethers.formatEther(toFixed(depositedToDate).toString());
      const remainingCommitmentInETH = (Number(totalCommitmentInETH) - Number(depositedToDateInETH)).toString();
      const depositedPercentage = totalCommitment
        ? (depositedToDate / totalCommitment) * 100
        : 0;
      const remainingPercentage = 100 - depositedPercentage;

      // Set the data
      setData({
        totalCommitmentInETH,
        commitmentEndTime,
        depositedToDateInETH,
        remainingCommitmentInETH,
        depositedPercentage,
        remainingPercentage,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    if (lpAddress && !Data) {
      fetchLPData();
    }

    return () => { }
  }, [lpAddress, getContract]);

  return { Data, ethUsdRate, callSchedule, error, loading, fetchLPData };
};

export default useLPData;
