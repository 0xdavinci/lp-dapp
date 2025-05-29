import { BigNumberish, ethers } from "ethers";
import { useContract } from "./useContract"; // Your hook for contract interactions

export const useFetchInflowEvents = () => {

    const { getContract } = useContract();

    const fetchInflowEvents = async () => {
        try {

            const contract = await getContract();

            if (!contract) {
                throw new Error("Contract not found");
            }
            // Query all PaymentMade events
            const logs = await contract.queryFilter("PaymentMade");

            // Parse the logs into a readable format
            const parsedEvents = logs
                .map((log) => {
                    const parsedLog = contract.interface.parseLog(log);
                    if (!parsedLog) {
                        console.warn("Could not parse PaymentMade log:", log);
                        return null; // Return null if parsing fails
                    }
                    return {
                        type: "deposit",
                        name: parsedLog.args.name,
                        amount: ethers.formatEther(parsedLog.args.amount as BigNumberish),
                        blockNumber: log.blockNumber,
                    };
                })
                .filter((event): event is { type: string; name: string; amount: string; blockNumber: number } => event !== null); // Filter out null values

            return parsedEvents;
        } catch (error) {
            console.error("Error fetching PaymentMade events:", error);
            return [];
        }
    }


    return { fetchInflowEvents };
}
