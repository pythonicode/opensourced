import TronWeb from 'tronweb';

const tron = new TronWeb({
  fullHost: 'https://nile.trongrid.io',
  // headers: { 'TRON-PRO-API-KEY': 'your api key' },
  privateKey: process.env.TRON_PRIVATE_KEY,
});
