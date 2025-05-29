import { useContract } from "./useContract"; // Your hook for contract interactions

const { getContract } = useContract();

export async function checkHashInHistory(transactionHash: string): Promise<boolean> {
    const contract = await getContract();
    try {
        if (!contract) {
            throw new Error("Contract not found");
        }

        const logs = await contract.queryFilter("Withdrawal");

        // Check if the transaction hash exists in the logs
        return logs.some((log) => (log as any).args?.txHash.toLowerCase() === transactionHash.toLowerCase());
    } catch (error) {
        console.error("Error checking transaction hash:", error);
        return false;
    }
}