export async function getSmartContract(address: string): Promise<any> {
  return await window.tronWeb.contract().at(address);
}
