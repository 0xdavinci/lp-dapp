import { useState, useEffect } from "react";
import { useContract } from "./useContract";  // Use your previously created hook for contract interaction

const getAdmins = () => {
    const { getContract } = useContract(); // Use your previously created hook for contract interaction

    const [admins, setAdmins] = useState<string[]>([]);

    useEffect(() => {
        const fetchAmdins = async () => {
            const contract = await getContract();
            if (!contract) {
                return false;
            }
            const admins = await contract.getAdmins();
            setAdmins(admins);
        }

        if (admins.length === 0) {
            fetchAmdins();
        }

        return () => {}
    }, [getContract])

    return admins;
};
export default getAdmins;