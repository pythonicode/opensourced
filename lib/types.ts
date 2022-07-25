import { Endpoints } from '@octokit/types';

declare global {
  interface Window {
    tronWeb: any;
    tronLink: any;
  }
}

export type FirestoreUser = {
  token: string;
  account: string;
};

export type GithubEvent = Endpoints['GET /events']['response']['data'][0] & {
  payload: { pull_request: { merged: boolean }; commits: any; ref: string; ref_type: string };
};
