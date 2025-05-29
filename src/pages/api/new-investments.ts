import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js';

// // Supabase configuration
const supabaseUrl = 'https://eqggdskzblfyvtvkhsmn.supabase.co'; // Replace with your Supabase project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxZ2dkc2t6YmxmeXZ0dmtoc21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyMDMxNTksImV4cCI6MjA1MDc3OTE1OX0.qJTybt9GAR7yTT8H17vSYiIzMzLBlvOhjRz573MVIbQ'; // Replace with your Supabase API key
const supabase = createClient(supabaseUrl, supabaseKey);

const SUPPORTED_CHAINS: Record<number, string> = {
    1: "investments_mainnet", // Ethereum Mainnet
    11155111: "investments", // Sepolia Testnet
};

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { chainId, investmentName, walletAddress, amount, expectedReturns, socialImpactMetric, expectedSocialImpact } =
                req.body;

            if (!chainId || !SUPPORTED_CHAINS[Number(chainId)]) {
                return res.status(400).json({ error: "Invalid or missing chainId." });
            }

            if (!investmentName || !walletAddress || !amount) {
                return res.status(400).json({ error: "Missing required fields." });
            }

            // Validate data types
            if (
                typeof chainId !== "number" ||
                typeof investmentName !== "string" ||
                typeof walletAddress !== "string" ||
                typeof amount !== "string" ||
                typeof expectedReturns !== "string" ||
                typeof socialImpactMetric !== "string" ||
                typeof expectedSocialImpact !== "string"
            ) {
                return res.status(400).json({ error: "Invalid input types." });
            }
            // Insert data into Supabase
            const tableName = SUPPORTED_CHAINS[chainId];

            const { data, error } = await supabase.from(tableName).insert([
                {
                    investment_name: investmentName,
                    wallet_address: walletAddress,
                    amount: amount,
                    expected_returns: expectedReturns,
                    social_impact_metric: socialImpactMetric,
                    expected_social_impact: expectedSocialImpact,
                },
            ]);

            if (error) {
                console.error("Error saving data to Supabase:", error);
                return res.status(500).json({ error: "Failed to save data." });
            }

            return res.status(201).json({ message: "Data saved successfully.", data })
        } catch (err) {
            console.error("Unexpected error:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
