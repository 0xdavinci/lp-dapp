import { useState, useEffect } from "react";
import { useContract } from "./useContract";
import { useAccount, useChainId } from "wagmi";

const useAdmins = () => {
    const { getContract } = useContract();
    const { address } = useAccount();
    const chainId = useChainId();

    const [admins, setAdmins] = useState<string[]>([]);
    const [defaultAdmin, setDefaultAdmin] = useState<string>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAdmins = async () => {
            setIsLoading(true);
            try {
                const contract = await getContract();
                if (!contract) {
                    setAdmins([]);
                    setDefaultAdmin(undefined);
                    return;
                }
                const admins = await contract.getAdmins();
                const defaultAdmin = await contract.defaultAdmin();
                setAdmins(admins);
                setDefaultAdmin(defaultAdmin);
            } catch (error) {
                console.error("Error fetching admins:", error);
                setAdmins([]);
                setDefaultAdmin(undefined);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdmins();
    }, [getContract, chainId, address]); // Add chainId and address as dependencies

    return { admins, defaultAdmin, isLoading };
};

export default useAdmins;