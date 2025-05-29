import { useAccount, useBalance } from 'wagmi';
import { useState, useEffect } from 'react';

// Fetch the current ETH price in USD
const fetchEthPrice = async (): Promise<number> => {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
  const data = await response.json();
  return data.ethereum.usd; // ETH price in USD
};

// Custom hook to retrieve account data
export const useWalletData = () => {
  const { address, isConnected } = useAccount(); // Get connected account details
  const { data: balanceData } = useBalance({ address }); // Get ETH balance
  const [ethPrice, setEthPrice] = useState<number | null>(null); // ETH price in USD
  const [usdValue, setUsdValue] = useState<number>(0); // USD value of ETH balance

  useEffect(() => {
    // Fetch ETH price when the component is mounted
    fetchEthPrice()
      .then((price) => {
        setEthPrice(price);
      })
      .catch((error) => console.error('Error fetching ETH price:', error));
  }, []);

  useEffect(() => {
    if (balanceData?.value && ethPrice) {
      // Calculate the USD value of the ETH balance
      const ethBalance = Number(balanceData.value) / 1e18; // Convert wei to ETH
      setUsdValue(ethBalance * ethPrice);
    }
  }, [balanceData, ethPrice]);

  return {
    address,
    isConnected,
    ethBalance: balanceData?.value ? Number(balanceData.value) / 1e18 : 0, // Convert wei to ETH
    usdValue,
  };
};
