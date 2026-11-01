export const SUPPORTED_ASSETS = [
  {
    symbol: 'USDT',
    name: 'Tether USD',
    network: 'TRON (TRC20) / Polygon',
    iconColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    dotColor: 'bg-emerald-400',
    decimals: 2,
    rateUsd: 1.00,
    address: 'TJ8hN7k4m9vP2yQWzR1e5S6tXuYaLdEb4c',
    minDeposit: '5.00',
    minWithdraw: '10.00',
    fee: '1.00 USDT'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    network: 'ERC-20 / Arbitrum One',
    iconColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    dotColor: 'bg-indigo-400',
    decimals: 6,
    rateUsd: 3450.00,
    address: '0x71C...b846f40b49744c7da82',
    minDeposit: '0.002',
    minWithdraw: '0.005',
    fee: '0.001 ETH'
  },
  {
    symbol: 'LTC',
    name: 'Litecoin',
    network: 'Litecoin Mainnet',
    iconColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    dotColor: 'bg-blue-400',
    decimals: 4,
    rateUsd: 82.50,
    address: 'ltc1qf8w5j76vckp3w6r6x8r4e99zq7y9t2p3k8w',
    minDeposit: '0.05',
    minWithdraw: '0.10',
    fee: '0.002 LTC'
  },
  {
    symbol: 'DOGE',
    name: 'Dogecoin',
    network: 'Dogecoin Network',
    iconColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    dotColor: 'bg-amber-400',
    decimals: 2,
    rateUsd: 0.165,
    address: 'D9vP2k7m4wRyQe5S6tXuYaLdEb4cTJ8hN7',
    minDeposit: '20.0',
    minWithdraw: '50.0',
    fee: '2.0 DOGE'
  }
];

export const DEFAULT_BALANCES = {
  USDT: 0.00,
  ETH: 0.0000,
  LTC: 0.0000,
  DOGE: 0.00
};

