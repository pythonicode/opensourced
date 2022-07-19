declare global {
  interface Window {
    tronWeb: any;
  }
}

export type FirestoreUser = {
  token: string;
  account: string;
};
