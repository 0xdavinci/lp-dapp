import { useState, useEffect } from "react";
import { useContract } from "./useContract"; // Your hook for contract interactions
import { ethers } from "ethers";
import { PaymentEvent, WithdrawalEvent } from "../utils/types";
import { BigNumberish } from "ethers";

const usePaymentAndWithdrawalEvents = (lpAddress: string) => {
    const { getContract } = useContract();
    const [events, setEvents] = useState<(PaymentEvent | WithdrawalEvent)[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                const contract = await getContract();

                // Fetch PaymentMade events
                if (!contract) {
                    throw new Error("Contract not found");
                }
                const paymentFilter = contract.filters.PaymentMade(lpAddress);
                const paymentLogs = await contract.queryFilter(paymentFilter);
                const parsedPaymentEvents = paymentLogs
                    .map((log) => {
                        const parsedLog = contract.interface.parseLog(log);
                        if (!parsedLog) {
                            console.warn("Could not parse PaymentMade log:", log);
                            return null;
                        }
                        return {
                            type: "deposit",
                            blockNumber: log.blockNumber,
                            transactionHash: log.transactionHash,
                            lp: parsedLog.args.lp as string,
                            amount: ethers.formatEther(parsedLog.args.amount as BigNumberish),
                        } as PaymentEvent;
                    })
                    .filter((event): event is PaymentEvent => event !== null);

                // Fetch Withdrawal events
                const withdrawalFilter = contract.filters.Withdrawal(null, null); // Adjust filters as needed
                const withdrawalLogs = await contract.queryFilter(withdrawalFilter);
                const parsedWithdrawalEvents = withdrawalLogs
                    .map((log) => {
                        const parsedLog = contract.interface.parseLog(log);
                        if (!parsedLog) {
                            console.warn("Could not parse Withdrawal log:", log);
                            return null;
                        }
                        return {
                            type: "withdrawal",
                            blockNumber: log.blockNumber,
                            transactionHash: log.transactionHash,
                            to: parsedLog.args.to as string,
                            amount: ethers.formatEther(parsedLog.args.amount as BigNumberish),
                        } as WithdrawalEvent;
                    })
                    .filter((event): event is WithdrawalEvent => event !== null);

                // Combine and sort events by blockNumber
                const combinedEvents = [...parsedPaymentEvents, ...parsedWithdrawalEvents].sort(
                    (a, b) => a.blockNumber - b.blockNumber
                );

                setEvents(parsedPaymentEvents);
            } catch (err: any) {
                setError(err.message || "Failed to fetch events.");
            } finally {
                setLoading(false);
            }
        };

        if (lpAddress && !events.length) {
            fetchEvents();
        }
    }, [lpAddress, getContract]); // Re-run if lpAddress or contract changes

    return { events, error, loading };
};

export default usePaymentAndWithdrawalEvents;
