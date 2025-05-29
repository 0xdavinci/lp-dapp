// src/components/AdminControls.tsx
"use client";

import React from 'react';
import { managers } from '../data/exampleData';
import Image from 'next/image';

const AdminControls: React.FC = () => {
  return (
    <div className="serviceBox">
      <div className="relative overflow-hidden rounded-t-lg bg-[#97b2bd] p-4 flex items-center">
        <div className="flex items-center">
          <div className="relative w-16 h-16 mr-4">
            <Image src="/admincontrols.jpg" alt="Admin Controls Icon" className="rounded-full" layout="fill" objectFit="cover" />
          </div>
          <h2 className="text-2xl font-bold text-white">Admin Controls</h2>
        </div>
      </div>
      <div className="p-4">
        <div className="hidden lg:block">
          {managers.map((manager) => (
            <div key={manager.id} className="flex items-center mb-2">
              <input
                type="text"
                value={manager.username}
                className="border p-2 mr-2 flex-grow"
                disabled
              />
              <button className="px-4 mr-2 bg-red-500 text-white py-2 rounded-lg">X</button>
              <input
                type="text"
                placeholder="Optional Message"
                className="border p-2 mr-2 flex-grow"
              />
              <input
                type="number"
                placeholder="ETH Amount"
                className="border p-2 mr-2"
              />
              <button className="ctaButton text-white p-2 mr-2">
                Send
              </button>
            </div>
          ))}
          <div className="flex items-center mt-4">
            <input
              type="text"
              placeholder="Username"
              className="border p-2 mr-2 flex-grow"
            />
            <button className="ctaButton text-white p-2">
              Add Manager
            </button>
          </div>
        </div>
        <div className="block lg:hidden space-y-4">
          {managers.map((manager) => (
            <div key={manager.id} className="p-4 border rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-2">
                <input
                  type="text"
                  value={manager.username}
                  className="border p-2 flex-grow"
                  disabled
                />
                <button className="px-4 bg-red-500 text-white py-2 rounded-lg">X</button>
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Optional Message"
                  className="border p-2 w-full"
                />
              </div>
              <div className="flex justify-between items-center">
                <input
                  type="number"
                  placeholder="ETH Amount"
                  className="border p-2 flex-grow"
                />
                <button className="ctaButton text-white p-2 ml-2">
                  Send
                </button>
              </div>
            </div>
          ))}
          <div className="flex items-center mt-4">
            <input
              type="text"
              placeholder="Username"
              className="border p-2 mr-2 flex-grow"
            />
            <button className="ctaButton text-white p-2">
              Add Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminControls;
