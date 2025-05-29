import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// // Supabase configuration
const supabaseUrl = 'https://eqggdskzblfyvtvkhsmn.supabase.co'; // Replace with your Supabase project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxZ2dkc2t6YmxmeXZ0dmtoc21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyMDMxNTksImV4cCI6MjA1MDc3OTE1OX0.qJTybt9GAR7yTT8H17vSYiIzMzLBlvOhjRz573MVIbQ'; // Replace with your Supabase API key
const supabase = createClient(supabaseUrl, supabaseKey);

const SUPPORTED_CHAINS: Record<number, string> = {
  1: "investments_mainnet", // Ethereum Mainnet
  11155111: "investments", // Sepolia Testnet
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const chainId = Number(req.query.chainId);
      console.log("Fetching investments for chainId:", chainId);

      if (!chainId || !SUPPORTED_CHAINS[chainId]) {
        console.error("Invalid chainId:", chainId);
        return res.status(400).json({ error: "Invalid or missing chainId" });
      }

      const tableName = SUPPORTED_CHAINS[chainId];
      console.log("Using table:", tableName);

      const { data, error } = await supabase.from(tableName).select("*");

      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({ error: "Failed to fetch data." });
      }

      // Log the raw data for debugging
      console.log(`Fetched ${data?.length || 0} records from ${tableName}`);

      // Transform the data to ensure consistent types
      const transformedData = data?.map(item => ({
        ...item,
        expected_returns: typeof item.expected_returns === 'string' 
          ? parseFloat(item.expected_returns) 
          : item.expected_returns
      }));

      res.status(200).json(transformedData);
    } catch (err) {
      console.error("Unexpected error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
