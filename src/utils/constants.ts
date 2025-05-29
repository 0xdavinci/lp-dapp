export const CONTRACT_ADDRESSES: { [chainId: number]: `0x${string}` } = {
  1: "0xD049B4D84Df95f3947916e0c719024351208caE7", // Mainnet
  11155111: "0x8a09d779fD23EA420054d23658e161D871e6ef7A", // Sepolia
};

export const WSS_CHAINSTACK_URL: { [chainId: number]: string } = {
  1: "wss://ethereum-mainnet.core.chainstack.com/9b9fe60aa234e7c133a0b75d93f3b558", // Mainnet
  11155111: "wss://ethereum-sepolia.core.chainstack.com/dbaf0c732e5e69abc5a86e487ef286c3", // Sepolia
};

export const CASHCALL_TOPIC = "0x14954c6ff5a56809714735fb131bd55e42938c7e5bc1a1715593b0ba52000ccf";