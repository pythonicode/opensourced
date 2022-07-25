import { contract_ABI, contract_bytecode } from '@/lib/tron';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import TronWeb from 'tronweb';

const tron = new TronWeb({
  fullHost: 'https://nile.trongrid.io',
  // headers: { 'TRON-PRO-API-KEY': 'your api key' },
  privateKey: process.env.TRON_PRIVATE_KEY,
});

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const options = {
    feeLimit: 1000000000, //The maximum TRX burns for resource consumption（1TRX = 1,000,000SUN）
    callValue: 1000000, //The TRX transfer to the contract for each call（1TRX = 1,000,000SUN）
    userFeePercentage: 100, //Consume user's resource percentage. It should be an integer between [0, 100]. if 0, means it does not consume user's resource until the developer's resource has been used up
    originEnergyLimit: 10, //The maximum resource consumption of the creator in one execution or creation
    abi: JSON.stringify(contract_ABI), //Abi string
    bytecode: JSON.stringify(contract_bytecode.sourceMap), //Bytecode string
    name: 'Opensourced', //Contract name string
  };
  try {
    await tron.transactionBuilder.createSmartContract(
      options,
      'TQUeJcGU7P5L4Et8VpQw5we1fZdoYjaL8D'
    );
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e });
  }
  return res.status(200).json({ message: 'Deployed' });
};

export default handler;
