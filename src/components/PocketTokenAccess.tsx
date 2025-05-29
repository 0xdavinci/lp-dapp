import React from 'react';
import { usePocketToken } from '../hooks/usePocketToken';
import { useTheme } from '../context/ThemeContext';

interface PocketTokenAccessProps {
  children: React.ReactNode;
}

const PocketTokenAccess: React.FC<PocketTokenAccessProps> = ({ children }) => {
  const { hasAccess, isLoading, error, balance } = usePocketToken();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--foreground)] mx-auto"></div>
          <p className="mt-2 text-[var(--foreground)]">Checking Pocket Token balance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="p-4 text-center">
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-[#1a2433]' : 'bg-white'} shadow-lg`}>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Access Denied</h2>
          <p className="text-[var(--foreground)] mb-4">
            You need to hold Pocket Tokens to access this page.
          </p>
          <div className="text-sm text-gray-500">
            Current Balance: {balance} Pocket Tokens
          </div>
          <div className="mt-4">
            <a
              href="https://etherscan.io/token/0xa94485f44dd21c8cb547aee50979a29272ec5326"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View Pocket Token on Etherscan
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PocketTokenAccess; 