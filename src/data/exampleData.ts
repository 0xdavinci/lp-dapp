export const accountDetails = {
  walletAddress: '0x1234567890abcdef',
  commitmentAmount: 1000000,
  totalPaid: 500000,
  remainingCommitment: 500000,
};

export const transactionHistory = [
  { id: 1, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 0 * 24 * 60 * 60 * 1000).toISOString(), type: 'deposit', usdAmount: 250000.00 },
  { id: 2, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 1 * 24 * 60 * 60 * 1000).toISOString(), type: 'withdrawal', usdAmount: 100000.00 },
  { id: 3, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 2 * 24 * 60 * 60 * 1000).toISOString(), type: 'deposit', usdAmount: 300000.00 },
  { id: 4, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 3 * 24 * 60 * 60 * 1000).toISOString(), type: 'withdrawal', usdAmount: 50000.00 },
  { id: 5, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 4 * 24 * 60 * 60 * 1000).toISOString(), type: 'deposit', usdAmount: 400000.00 },
  { id: 6, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 5 * 24 * 60 * 60 * 1000).toISOString(), type: 'withdrawal', usdAmount: 75000.00 },
  { id: 7, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 6 * 24 * 60 * 60 * 1000).toISOString(), type: 'deposit', usdAmount: 500000.00 },
  { id: 8, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 7 * 24 * 60 * 60 * 1000).toISOString(), type: 'withdrawal', usdAmount: 150000.00 },
  { id: 9, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 8 * 24 * 60 * 60 * 1000).toISOString(), type: 'deposit', usdAmount: 600000.00 },
  { id: 10, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 9 * 24 * 60 * 60 * 1000).toISOString(), type: 'withdrawal', usdAmount: 200000.00 },
];

export const callSchedule = [
  { id: 1, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 0 * 24 * 60 * 60 * 1000).toISOString(), status: 'upcoming', usdAmount: 250000.00 },
  { id: 2, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed', usdAmount: 100000.00 },
  { id: 3, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'upcoming', usdAmount: 300000.00 },
  { id: 4, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'pending', usdAmount: 50000.00 },
  { id: 5, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 4 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed', usdAmount: 400000.00 },
  { id: 6, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'upcoming', usdAmount: 75000.00 },
  { id: 7, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 6 * 24 * 60 * 60 * 1000).toISOString(), status: 'pending', usdAmount: 500000.00 },
  { id: 8, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 7 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed', usdAmount: 150000.00 },
  { id: 9, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 8 * 24 * 60 * 60 * 1000).toISOString(), status: 'upcoming', usdAmount: 600000.00 },
  { id: 10, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 9 * 24 * 60 * 60 * 1000).toISOString(), status: 'pending', usdAmount: 200000.00 },
];

export const fundWalletInflows = [
  { id: 1, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 0 * 24 * 60 * 60 * 1000).toISOString(), type: 'deposit', name: 'LP Partner A', usdAmount: 250000.00 },
  { id: 2, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 1 * 24 * 60 * 60 * 1000).toISOString(), type: 'investment', name: 'Investment X Returns', usdAmount: 100000.00 },
  { id: 3, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 2 * 24 * 60 * 60 * 1000).toISOString(), type: 'deposit', name: 'LP Partner B', usdAmount: 300000.00 },
  { id: 4, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 3 * 24 * 60 * 60 * 1000).toISOString(), type: 'investment', name: 'Investment Y Returns', usdAmount: 50000.00 },
  { id: 5, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 4 * 24 * 60 * 60 * 1000).toISOString(), type: 'deposit', name: 'LP Partner C', usdAmount: 400000.00 },
  { id: 6, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 5 * 24 * 60 * 60 * 1000).toISOString(), type: 'investment', name: 'Investment Z Returns', usdAmount: 75000.00 },
  { id: 7, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 6 * 24 * 60 * 60 * 1000).toISOString(), type: 'deposit', name: 'LP Partner D', usdAmount: 500000.00 },
  { id: 8, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 7 * 24 * 60 * 60 * 1000).toISOString(), type: 'investment', name: 'Investment W Returns', usdAmount: 150000.00 },
  { id: 9, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 8 * 24 * 60 * 60 * 1000).toISOString(), type: 'deposit', name: 'LP Partner E', usdAmount: 600000.00 },
  { id: 10, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 9 * 24 * 60 * 60 * 1000).toISOString(), type: 'investment', name: 'Investment V Returns', usdAmount: 200000.00 },
];

export const investmentOutflows = [
  { id: 1, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 0 * 24 * 60 * 60 * 1000).toISOString(), name: 'Green Energy Project', usdAmount: 250000.00, expectedReturn: 25, socialImpactMetric: 'Carbon reduction', expectedSocialImpactNumber: 1000, units: 'tons' },
  { id: 2, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 1 * 24 * 60 * 60 * 1000).toISOString(), name: 'EdTech Initiative', usdAmount: 100000.00, expectedReturn: 20, socialImpactMetric: 'Students reached', expectedSocialImpactNumber: 10000, units: '' },
  { id: 3, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 2 * 24 * 60 * 60 * 1000).toISOString(), name: 'Clean Water Initiative', usdAmount: 300000.00, expectedReturn: 30, socialImpactMetric: 'People benefited', expectedSocialImpactNumber: 5000, units: '' },
  { id: 4, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 3 * 24 * 60 * 60 * 1000).toISOString(), name: 'Healthcare Program', usdAmount: 50000.00, expectedReturn: 15, socialImpactMetric: 'Patients treated', expectedSocialImpactNumber: 2000, units: '' },
  { id: 5, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 4 * 24 * 60 * 60 * 1000).toISOString(), name: 'Affordable Housing', usdAmount: 400000.00, expectedReturn: 22, socialImpactMetric: 'Houses built', expectedSocialImpactNumber: 150, units: '' },
  { id: 6, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 5 * 24 * 60 * 60 * 1000).toISOString(), name: 'Renewable Energy', usdAmount: 75000.00, expectedReturn: 18, socialImpactMetric: 'Energy produced', expectedSocialImpactNumber: 1000, units: 'MWh' },
  { id: 7, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 6 * 24 * 60 * 60 * 1000).toISOString(), name: 'Education Fund', usdAmount: 500000.00, expectedReturn: 28, socialImpactMetric: 'Scholarships given', expectedSocialImpactNumber: 500, units: '' },
  { id: 8, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 7 * 24 * 60 * 60 * 1000).toISOString(), name: 'Environmental Conservation', usdAmount: 150000.00, expectedReturn: 23, socialImpactMetric: 'Acres conserved', expectedSocialImpactNumber: 2000, units: '' },
  { id: 9, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 8 * 24 * 60 * 60 * 1000).toISOString(), name: 'Community Development', usdAmount: 600000.00, expectedReturn: 17, socialImpactMetric: 'Communities impacted', expectedSocialImpactNumber: 100, units: '' },
  { id: 10, date: new Date(Date.UTC(2024, 11, 27, 1, 23, 43) - 9 * 24 * 60 * 60 * 1000).toISOString(), name: 'Agricultural Initiative', usdAmount: 200000.00, expectedReturn: 24, socialImpactMetric: 'Farmers supported', expectedSocialImpactNumber: 1500, units: '' },
];

export const socialImpactMetrics = [
  { socialImpactMetric: 'Carbon reduction', completionPercentage: 80, expectedSocialImpactNumber: 1000, units: 'tons' },
  { socialImpactMetric: 'Students reached', completionPercentage: 60, expectedSocialImpactNumber: 10000, units: '' },
  { socialImpactMetric: 'People benefited', completionPercentage: 90, expectedSocialImpactNumber: 5000, units: '' },
  { socialImpactMetric: 'Patients treated', completionPercentage: 75, expectedSocialImpactNumber: 2000, units: '' },
  { socialImpactMetric: 'Houses built', completionPercentage: 50, expectedSocialImpactNumber: 150, units: '' },
  { socialImpactMetric: 'Energy produced', completionPercentage: 40, expectedSocialImpactNumber: 1000, units: 'MWh' },
  { socialImpactMetric: 'Scholarships given', completionPercentage: 95, expectedSocialImpactNumber: 500, units: '' },
  { socialImpactMetric: 'Acres conserved', completionPercentage: 65, expectedSocialImpactNumber: 2000, units: '' },
  { socialImpactMetric: 'Communities impacted', completionPercentage: 85, expectedSocialImpactNumber: 100, units: '' },
  { socialImpactMetric: 'Farmers supported', completionPercentage: 70, expectedSocialImpactNumber: 1500, units: '' },
];

export const managers = [
  { id: 1, username: 'manager1', ethAmount: '', optionalText: '' },
  { id: 2, username: 'manager2', ethAmount: '', optionalText: '' },
  { id: 3, username: 'manager3', ethAmount: '', optionalText: '' },
];
