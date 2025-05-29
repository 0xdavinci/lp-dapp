export interface LPData {
    totalCommitmentInETH: string;
    commitmentEndTime: number;
    depositedToDateInETH: string;
    remainingCommitmentInETH: string;
    depositedPercentage: number;
    remainingPercentage: number;
}

export interface PaymentEvent {
    id: number;
    type: string;
    blockNumber: number;
    transactionHash: string;
    lp: string;
    amount: string; // Amount as formatted ETH
    tranche: number;
}

export interface WithdrawalEvent {
    id: number;
    type: string;
    blockNumber: number;
    transactionHash: string;
    to: string;
    amount: string;
}

export const formatNumber = (numberForFormat: (string | undefined)) => {
    return Intl.NumberFormat('en-US', { maximumFractionDigits: 3 }).format(+(numberForFormat ?? 0));
}

export const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const toFixed = (x: any) => {
    if (Math.abs(x) < 1.0) {
        var e = parseInt(x.toString().split('e-')[1]);
        if (e) {
            x *= Math.pow(10, e - 1);
            x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
        }
    } else {
        var e = parseInt(x.toString().split('+')[1]);
        if (e > 20) {
            e -= 20;
            x /= Math.pow(10, e);
            x += (new Array(e + 1)).join('0');
        }
    }
    return x;
}
