"use client";

import type { NextPage } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AdminDashboard from "../components/AdminDashboard";
import { useTheme } from '../context/ThemeContext';
import AdminProtectedRoute from "../components/AdminProtectedRoute";

const Admin: NextPage = () => {
  const { theme } = useTheme();
  return (
    <AdminProtectedRoute>
      <div className={`bodyText ${theme === 'dark' ? 'bg-[#101625]' : 'bg-[var(--background)]'}`}>
        <Header />
        <main className="min-h-[100vh] pt-24 max-w-[1440px] mx-auto">
          <AdminDashboard />
        </main>
      </div>
      <Footer />
    </AdminProtectedRoute>
  );
};

export default Admin;
