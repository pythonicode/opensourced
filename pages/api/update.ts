import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import TronWeb from 'tronweb';
import { admin } from '@/lib/firebase-admin';
import { Octokit } from '@octokit/core';
import { GithubEvent } from '@/lib/types';

const tron = new TronWeb({
  fullHost: 'https://nile.trongrid.io',
  // headers: { 'TRON-PRO-API-KEY': 'your api key' },
  privateKey: process.env.TRON_PRIVATE_KEY,
});

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { uid, token } = req.query;
  if (!uid) return res.status(500).json({ error: 'No uid provided' });
  if (!token) return res.status(500).json({ error: 'No accessToken provided' });

  const ref = admin.firestore().doc(`users/${uid}`);
  const doc = await ref.get();
  if (!doc.exists) return res.status(500).json({ error: 'User not found' });

  let { account, updated } = doc.data() as { account: string; updated: number };
  console.log(updated);

  if (!account) return res.status(500).json({ error: 'No account found' });
  if (!updated) updated = 0;

  const octokit = new Octokit({ auth: token });
  const user = (await octokit.request('GET /user', {})).data;
  const events = await octokit.request('GET /users/{username}/events', {
    username: user.login,
  });

  const contract = await tron.contract().at('TKmgNGi49rEc3rsLrZnPNB7WiymKB9MHJ4');

  const changed = [];

  for (const event of events.data as GithubEvent[]) {
    if (parseInt(event.id) <= updated) continue;
    if (event.type === 'CreateEvent' && event.payload.ref_type == 'repository') {
      await contract.rewardRepositoryCreation(account).send();
    }
    changed.push(parseInt(event.id));
  }

  if (changed.length > 0) await ref.set({ ...doc.data(), updated: Math.max(...changed) });

  const balance = await contract.balanceOf(account).call();

  return res.status(200).json({ message: 'Updated', balance: balance });
};

export default handler;
