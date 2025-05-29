import { useEffect } from 'react';
import { useChainId } from 'wagmi';

export const useNetworkChange = (callback: () => void, cleanup?: () => void) => {
    const chainId = useChainId();

    useEffect(() => {
        // Cleanup previous state if cleanup function is provided
        if (cleanup) {
            cleanup();
        }
        
        // Execute callback for new network
        callback();
    }, [chainId, callback, cleanup]);
}; 