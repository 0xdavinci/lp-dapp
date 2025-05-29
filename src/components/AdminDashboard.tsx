"use client";

import React from 'react';
import AdminSettings from './AdminSettings';
import CapitalSchedule from './CapitalSchedule';
import AddNewInvestment from './AddNewInvestment';
import SetLP from './SetLP';

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col xl:flex-row gap-4 max-w-[1280px] mx-auto">
        <div className="flex-1">
          <AdminSettings />
        </div>
        <div className="flex-1">
          <SetLP />
        </div>
      </div>
      <div className="mt-4">
        <CapitalSchedule />
      </div>
      <div className="mt-8 lg:mt-4">
        <AddNewInvestment />
      </div>
    </div>
  );
};

export default AdminDashboard;
