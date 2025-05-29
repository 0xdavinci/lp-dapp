import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import { format } from 'date-fns';

interface BlockDateProps {
    blockNumber: number;
}

const BlockDate: React.FC<BlockDateProps> = ({ blockNumber }) => {

    const { data: walletClient } = useWalletClient();

    const [loading, setLoading] = useState<Boolean>(true);
    const [date, setDate] = useState<string>();

    useEffect(() => {
        const getDateFromBlockNumber = async (blockNumber: number) => {
            if (!walletClient) throw new Error("Wallet client not connected");

            const provider = new ethers.BrowserProvider(walletClient.transport);

            try {
                const block = await provider.getBlock(blockNumber);
                if (!block) {
                    throw new Error('Block not found!');
                }

                const date = format(new Date(block.timestamp * 1000), "M/d/yyyy HH:mm:ss"); // Convert to milliseconds
                setDate(date);
            } catch (error) {
                console.error('Error fetching block:', error);
                throw error; // Re-throw the error for the caller to handle
            }
            finally {
                setLoading(false);
            }

            return false;
        };

        getDateFromBlockNumber(blockNumber);
    }, [blockNumber])

    return !loading ? date : ` - `
};

export default BlockDate;