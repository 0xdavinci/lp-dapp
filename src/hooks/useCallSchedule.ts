import { useState, useEffect } from "react";
import { useContract } from "./useContract";  // Use your previously created hook for contract interaction
import { ethers } from "ethers";

const useCallSchedule = (lpAddress: string) => {
    
  const { getContract } = useContract();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [callSchedules, setCallSchedules] = useState<any[]>([]);  
  const [nextCapitalCall, setNextCapitalCall] = useState<any | null>();
  const [pendingCapitalCall, setPendingCapitalCall] = useState<any | null>();

  useEffect(() => {
    const fetchCallScheduleData = async () => {
      setLoading(true);
      try {
        const contract = await getContract();

        if (!contract) {
          return false;
        } 
        const callSchedule = await contract.getCashCalls(lpAddress); 
        const schedules = Array.isArray(callSchedule)
          ? callSchedule
          : JSON.parse(callSchedule || "[]"); // Parse the string if it's not an array

        // Map through schedules and extract necessary data
        const processedSchedules = schedules.map((item: any, index: number, array: any[]) => {
          const commitmentEndTime = Number(item[2]); // Convert UNIX timestamp to number
          const beforeCommitmentEndTime = array[index - 1] ? Number(array[index - 1][2]) : 0;
  
          const now = new Date().getTime() / 1000; // Current time in seconds
  
          let status = "completed"; // Default to completed
   
          if (commitmentEndTime < now) {
            status = "completed";
          } else if (commitmentEndTime > now && beforeCommitmentEndTime < now) {
            status = "pending";
          } else {
            status = "upcoming";
          }

          return {
            id: index,
            callAmount: ethers.formatEther(item[0]), // Convert BigNumber to string
            depositedToDate: item[1].toString(), // Convert BigNumber to string
            date: new Date(Number(item[2]) * 1000), // Convert UNIX timestamp to JS Date
            isExcuted: item[3],
            status,
          };
        });
        setCallSchedules(processedSchedules);

        const nextCapitalCall = processedSchedules.find(
            (schedule:any) => schedule.status === "upcoming"
        ); 
        setNextCapitalCall(nextCapitalCall);

        const pendingCapitalCall = processedSchedules.find(
            (schedule:any) => schedule.status === "pending"
        ); 
        setPendingCapitalCall(pendingCapitalCall);


      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (lpAddress) {
        fetchCallScheduleData();
    }

    return () => {}
  }, [lpAddress, getContract]);

  return { callSchedules, nextCapitalCall, pendingCapitalCall, error, loading };
};

export default useCallSchedule;
