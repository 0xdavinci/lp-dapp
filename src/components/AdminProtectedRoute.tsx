import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAdmins from '../hooks/useAdmins';
import { useAccount } from 'wagmi';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { admins, isLoading } = useAdmins();

  // Show loading or nothing while checking admin status
  if (isLoading || !isConnected) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If not admin, redirect to home and show nothing
  if (!isLoading && (!address || !admins.includes(address as `0x${string}`))) {
    router.push('/');
    return null;
  }

  // If admin, show the protected content
  return <>{children}</>;
};

export default AdminProtectedRoute; 