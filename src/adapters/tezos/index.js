import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { Buffer } from 'buffer';

const DAPP_NAME = "SpaceOz";
const RPC_URL = "https://jakartanet.smartpy.io";
const NETWORK = "jakartanet";
const CONTRACT_ADDRESS = "KT1BWCZkyNyE2AHomVsQvi4sfZdDHL7BZi8P";

const Tezos = new TezosToolkit(RPC_URL);

const wallet = new BeaconWallet({
  name: DAPP_NAME,
  preferredNetwork: NETWORK,
  colorMode: "dark",
});

// Setting the wallet as the wallet provider for Taquito.
Tezos.setWalletProvider(wallet);


const network = {
  type: NETWORK,
  rpcUrl: RPC_URL,
};

const getActiveAccount = async () => {
  const activeAccount = await wallet.client.getActiveAccount();
  return activeAccount;
};

const connectAccount = async () => {
  const activeAccount = await wallet.client.getActiveAccount();
  // no active account, we need permissions first
  if (!activeAccount) {
    await wallet.requestPermissions({ network });
    return getActiveAccount();
  }
  return activeAccount;
};

const clearActiveAccount = async () => {
  return wallet.client.clearActiveAccount();
};

const getContract = async () => {
  return Tezos.wallet.at(CONTRACT_ADDRESS);
};

const getContractStorage = async () => {
  return (await getContract()).storage();
};


// const mint = async ({ url, price, title }) => {
//   return await getContract().then((c) => {
//     return c.methods
//       .mint(
//         price,
//         title,
//         url,
//       )
//       .send();
//   });
// };
// const confirmOperation = async (operation) => {
//   console.log(`Awaiting for ${operation.opHash} to be confirmed...`);
//   return operation.confirmation(1).then(() => operation.opHash);
// };

// const collect = async ({ token_id, price }) => {
//   return await getContract().then((c) => {
//     return c.methods.collect(token_id).send({
//       amount: price,
//       mutez: true,
//     });
//   });
// };

// const updatePrice = async ({ token_id, price }) => {
//   return await getContract().then((c) => {
//     return c.methods.update(price, token_id).send();
//   });
// };

export {
  Tezos,
  wallet,
  getActiveAccount,
  connectAccount,
  clearActiveAccount,
  getContract,
  getContractStorage,
    //   updatePrice,
  //   mint as createItem,
  //   confirmOperation,
  //   collect as createSale,
};